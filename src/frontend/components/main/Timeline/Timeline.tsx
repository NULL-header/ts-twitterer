import React, {
  useRef,
  useMemo,
  useLayoutEffect,
  MutableRefObject,
  useEffect,
  useCallback,
  memo,
} from "react";
import { Divider, Box, VStack } from "@chakra-ui/react";
import { delayCall, useConstAsyncTask } from "frontend/util";
import {
  loadNewTweets,
  saveTimelineDetail,
  loadTimelineDetail,
} from "frontend/worker/connect";
import { CurrentListInitError } from "frontend/errors";
import { useMount } from "react-use";
import { useAsyncTask } from "react-hooks-async";
import { TimelineDetail } from "./TimelineDetail";
import { Tweet } from "./Tweet";
import { ListSelector } from "./ListSelector";
import { ToolButton } from "./ToolButton";
import { Provider, useTimelineDetail } from "./context";

// extract to pass key only
const TweetBox = React.memo(({ tweet }: { tweet: Tweet }) => (
  <>
    <Divider width="calc(100% - 10vw)" />
    <Tweet tweet={tweet} />
  </>
));

TweetBox.displayName = "TweetBox";

const makeGetSholdUpdate = (
  ref: MutableRefObject<HTMLDivElement>,
  acceptDif = 100,
) => () => {
  const { current: target } = ref;
  const screenHeight = window.innerHeight;
  const { scrollHeight } = target;
  const scrollBottom = screenHeight + target.scrollTop;
  const diff = scrollHeight - scrollBottom;
  return diff < acceptDif;
};

const useScrollEndEffect = (
  ref: MutableRefObject<HTMLDivElement | null>,
  effect: () => void,
) => {
  useLayoutEffect(() => {
    const getShouldUpdate = makeGetSholdUpdate(
      ref as MutableRefObject<HTMLDivElement>,
    );
    const handler = delayCall(() => {
      const shouldUpdate = getShouldUpdate();
      if (shouldUpdate) effect();
    });
    const { current: target } = ref;
    if (target == null) throw new Error("ref is null");
    target.addEventListener("scroll", handler);
    return () => target.removeEventListener("scroll", handler);
  }, []);
};

const Empty = memo(() => <Box marginTop="50vh" />);

const Tweets = memo<{ tweets: TimelineDetail["tweetsDetail"]["tweets"] }>(
  ({ tweets }) => {
    // firstがundefinedである可能性を潰す
    if (tweets.size === 0) return <>{undefined}</>;
    const firstTweet = tweets.first() as Tweet;
    return (
      <>
        {tweets.size === 0 ? undefined : (
          <VStack spacing="5vw">
            <Tweet key={firstTweet.dataid} tweet={firstTweet} />
            {tweets.slice(1).map((e: Tweet) => (
              <TweetBox key={e.dataid} tweet={e} />
            ))}
          </VStack>
        )}
      </>
    );
  },
);

type Args<T> = T extends (...args: infer A) => any ? A : never;

const updateTweets = async (...args: Args<typeof loadNewTweets>) => {
  let result;
  try {
    result = await loadNewTweets(...args);
  } catch (e) {
    if (e instanceof CurrentListInitError) {
      result = undefined;
    }
  }
  return result;
};

const TimelineContainer = memo(() => {
  const [timelineDetail, setTimelineDetail] = useTimelineDetail();
  const loadTask = useConstAsyncTask(
    timelineDetail,
    async ({ signal, getState }) => {
      const { currentList, tweetsDetail } = getState();
      const newTweets = await updateTweets({
        currentList,
        tweetsDetailObj: tweetsDetail.toJS(),
      });
      if (signal.aborted || newTweets == null) return;
      setTimelineDetail((detail) =>
        detail.set(
          "tweetsDetail",
          detail.tweetsDetail.mergeDeep(newTweets as any),
        ),
      );
    },
  );
  const initLoadTask = useAsyncTask(
    useCallback(async ({ signal }) => {
      setTimelineDetail((detail) => detail.set("isLoadingFromDB", true));
      const nextTimelineDetail = await loadTimelineDetail();
      if (signal.aborted) return;
      if (nextTimelineDetail == null) {
        setTimelineDetail((detail) => detail.set("isLoadingFromDB", false));
        return;
      }
      setTimelineDetail((detail) =>
        detail
          .mergeDeep(nextTimelineDetail as any)
          .set("isLoadingFromDB", false),
      );
    }, []),
  );
  const tweets = useMemo(() => timelineDetail.tweetsDetail.tweets, [
    timelineDetail.tweetsDetail.tweets,
  ]);
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollEndEffect(ref as any, () => loadTask.start());
  useEffect(() => {
    if (tweets.size !== 0) return;
    loadTask.start();
  }, [tweets]);
  useEffect(() => {
    if (
      timelineDetail.isLoadingFromDB == null ||
      timelineDetail.isLoadingFromDB
    ) {
      return;
    }
    console.log("save timelineDetail");
    saveTimelineDetail(timelineDetail.toJS());
  }, [timelineDetail]);
  useMount(() => {
    initLoadTask.start();
  });

  return (
    <>
      <ListSelector />
      <Box padding="3vw" overflowY="scroll" height="auto" ref={ref}>
        <Empty />
        <Tweets tweets={tweets} />
        <Empty />
      </Box>
      <ToolButton />
    </>
  );
});

const Timeline = memo(() => (
  <Provider>
    <TimelineContainer />
  </Provider>
));

export { Timeline };
