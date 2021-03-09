import React, {
  useRef,
  useLayoutEffect,
  MutableRefObject,
  useEffect,
  memo,
} from "react";
import { useTracked } from "frontend/globalState";
import { Divider, Box, VStack } from "@chakra-ui/react";
import { delayCall } from "frontend/util";
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
  const [state, dispatch] = useTracked();
  const { tweets } = state;
  const ref = useRef<HTMLDivElement | null>(null);
  useScrollEndEffect(ref as any, () =>
    dispatch({ type: "UPDATE_TWEETS", dispatch }),
  );
  useEffect(() => {
    if (tweets.length !== 0) return;
    dispatch({ type: "UPDATE_TWEETS", dispatch });
  }, [tweets]);
  return (
    <>
      <Box padding="3vw" overflowY="scroll" height="100%" ref={ref}>
        <Box marginTop="10vw" />
        {tweets.length === 0 ? undefined : (
          <VStack spacing="5vw">
            <Tweet key={tweets[0].dataid} tweet={tweets[0]} />
            {tweets.slice(1).map((e) => (
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
