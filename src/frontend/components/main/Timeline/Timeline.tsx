import React, {
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
  MutableRefObject,
  useEffect,
  memo,
  useCallback,
} from "react";
import { Divider, Box, VStack } from "@chakra-ui/react";
import { delayCall, useConstAsyncTask } from "frontend/util";
import { loadNewTweets } from "frontend/worker/connect";
import { CurrentListInitError } from "frontend/errors";
import { TimelineDetail } from "./TimelineDetail";
import { Tweet } from "./Tweet";
import { ListSelector } from "./ListSelector";

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

const Timeline = memo(() => {
  const [timelineDetail, setTimelineDetail] = useState(new TimelineDetail());
  const loadTask = useConstAsyncTask(
    timelineDetail,
    async ({ signal, getState }) => {
      const { currentList, tweetsDetail } = getState();
      const nextTweetsDetail = await updateTweets({
        currentList,
        tweetsDetailObj: tweetsDetail.toJS(),
      });
      if (signal.aborted || nextTweetsDetail == null) return;
      setTimelineDetail((detail) => detail.merge(nextTweetsDetail as any));
    },
  );
  const tweets = useMemo(() => timelineDetail.tweetsDetail.tweets, [
    timelineDetail.tweetsDetail.tweets,
  ]);
  const currentList = useMemo(() => timelineDetail.currentList, [
    timelineDetail.currentList,
  ]);
  const setCurrentList = useCallback(
    (listid: string) =>
      setTimelineDetail((detail) => detail.set("currentList", listid)),
    [],
  );
  const listids = useMemo(() => timelineDetail.listids, [
    timelineDetail.listids,
  ]);
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollEndEffect(ref as any, () => loadTask.start());
  useEffect(() => {
    if (tweets.size !== 0) return;
    loadTask.start();
  }, [tweets]);
  return (
    <>
      <ListSelector
        currentList={currentList}
        setCurrentList={setCurrentList}
        listids={listids}
      />
      <Box padding="3vw" overflowY="scroll" height="100%" ref={ref}>
        <Empty />
        <Tweets tweets={tweets} />
        <Empty />
      </Box>
    </>
  );
});

export { Timeline };
