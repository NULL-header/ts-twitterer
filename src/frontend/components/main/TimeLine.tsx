import React, {
  useRef,
  useLayoutEffect,
  MutableRefObject,
  useEffect,
  memo,
} from "react";
import { useUpdate, useSelector } from "frontend/globalState";
import { Divider, Box, VStack } from "@chakra-ui/react";
import { delayCall } from "frontend/util";
import Immutable from "immutable";
import { Tweet } from "./Tweet";

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

const Timeline = memo(() => {
  console.log("hey");
  const dispatch = useUpdate();
  const tweets = useSelector((state) => state.tweetsDetail.tweets);
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollEndEffect(ref as any, () => dispatch({ type: "LOAD_NEW_TWEETS" }));
  useEffect(() => {
    if (tweets.size !== 0) return;
    dispatch({ type: "LOAD_NEW_TWEETS" });
  }, [tweets]);
  return (
    <>
      <Box padding="3vw" overflowY="scroll" height="100%" ref={ref}>
        <Box marginTop="10vw" />
        {tweets.size === 0 ? undefined : (
          <VStack spacing="5vw">
            <Tweet key={tweets.first().dataid} tweet={tweets.first()} />
            {tweets.slice(1).map((e: Tweet) => (
              <TweetBox key={e.dataid} tweet={e} />
            ))}
          </VStack>
        )}
        <Box marginTop="50vh" />
      </Box>
    </>
  );
});

export { Timeline };
