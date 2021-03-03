import React, {
  useRef,
  useLayoutEffect,
  MutableRefObject,
  useEffect,
} from "react";
import { useTracked } from "frontend/globalState";
import { Divider, Box, VStack } from "@chakra-ui/react";
import { delayCall } from "frontend/util";
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

const useScrollEndEffect = (effect: () => void) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const getShouldUpdate = makeGetSholdUpdate(
      targetRef as MutableRefObject<HTMLDivElement>,
    );
    const handler = delayCall(() => {
      const shouldUpdate = getShouldUpdate();
      if (shouldUpdate) effect();
    });
    const { current: target } = targetRef;
    if (target == null) throw new Error("ref is null");
    target.addEventListener("scroll", handler);
    return () => target.removeEventListener("scroll", handler);
  }, []);
  return targetRef;
};

const Timeline = () => {
  console.log("hey");
  const [state, dispatch] = useTracked();
  const { currentList, tweetGroup } = state;
  const tweetDetails =
    currentList == null
      ? undefined
      : // tweetDetails is nullable when currentList just exists and
        // no tweetGroup has it as key of property.
        (tweetGroup[currentList] as Tweet[] | undefined);
  const divRef = useScrollEndEffect(() =>
    dispatch({ type: "UPDATE_TWEETS", dispatch }),
  );
  useEffect(() => {
    if (tweetDetails == null || tweetDetails.length !== 0) return;
    dispatch({ type: "UPDATE_TWEETS", dispatch });
  }, [tweetDetails]);
  return (
    <ContentContainer header="Timeline" ref={divRef}>
      <Box marginTop="10vw" />
      {tweetDetails == null || tweetDetails.length === 0 ? undefined : (
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
};

export { Timeline };
