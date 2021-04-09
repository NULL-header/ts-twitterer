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
import { delayCall } from "frontend/util";
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

const Tweets = memo<{ tweets: TimelineDetail["tweetsManager"]["tweets"] }>(
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

const TimelineContainer = memo(() => {
  const [timelineDetail, dispatch] = useTimelineDetail();
  const loadTweets = useCallback(
    () =>
      dispatch({
        type: "DISPATCH_ASYNC",
        updater: (state) =>
          state.updateAsync("tweetsManager", (manager) => manager.getTweets()),
      }),
    [],
  );
  const tweets = useMemo(() => timelineDetail.tweetsManager.tweets, [
    timelineDetail.tweetsManager.tweets,
  ]);
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollEndEffect(ref as any, () => loadTweets());
  useEffect(() => {
    if (tweets.size !== 0) return;
    loadTweets();
  }, [tweets]);

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
