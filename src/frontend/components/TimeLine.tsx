import React, { useRef, useLayoutEffect, MutableRefObject } from "react";
import { useTracked } from "frontend/globalState";
import { Divider, Box, VStack } from "@chakra-ui/react";
import { Tweet } from "./Tweet";
import { ContentContainer } from "./ContentContainer";

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

const useScrollEndEffect = (effect: () => void, delayMs = 500) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const { current: target } = targetRef;
    if (target == null) return;
    const getShouldUpdate = makeGetSholdUpdate(
      targetRef as MutableRefObject<HTMLDivElement>,
    );
    const callback = () => {
      const shouldUpdate = getShouldUpdate();
      if (shouldUpdate) effect();
      timeout = null;
    };
    const handleScroll = () => {
      if (timeout != null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(callback, delayMs);
    };
    target.addEventListener("scroll", handleScroll);
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);
  return targetRef;
};

const Timeline = React.memo(() => {
  const [state, dispatch] = useTracked();
  const { currentList, tweetGroup } = state;
  const tweetDetails =
    currentList == null
      ? undefined
      : // tweetDetails is nullable when currentList just exists and
        // no tweetGroup has it as key of property.
        (tweetGroup[currentList] as Tweet[] | undefined);
  console.log({ tweetGroup, currentList });
  const divRef = useScrollEndEffect(() =>
    dispatch({ type: "UPDATE_TWEETS", dispatch }),
  );
  return (
    <ContentContainer header="Timeline" ref={divRef}>
      <Box marginTop="10vw" />
      {tweetDetails == null ? undefined : (
        <VStack spacing="5vw">
          <Tweet key={tweetDetails[0].dataid} tweet={tweetDetails[0]} />
          {tweetDetails.slice(1).map((e) => (
            <TweetBox key={e.dataid} tweet={e} />
          ))}
        </VStack>
      )}
      <Box marginTop="50vh" />
    </ContentContainer>
  );
});
Timeline.displayName = "Timeline";

export { Timeline };
