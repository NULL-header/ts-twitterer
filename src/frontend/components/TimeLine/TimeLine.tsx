import React from "react";
import { useTracked } from "frontend/globalState";
import { Divider, Box, VStack } from "@chakra-ui/react";
import { Tweet } from "../Tweet";
import { ContentContainer } from "../ContentContainer";

// extract to pass key only
const TweetBox = React.memo(({ tweet }: { tweet: Tweet }) => (
  <>
    <Divider width="calc(100% - 10vw)" />
    <Tweet tweet={tweet} />
  </>
));

TweetBox.displayName = "TweetBox";

const Timeline = React.memo(() => {
  const [state] = useTracked();
  const { currentList, tweetGroup } = state;
  const tweetDetails =
    currentList == null
      ? undefined
      : // tweetDetails is nullable when currentList just exists and
        // no tweetGroup has it as key of property.
        (tweetGroup[currentList] as Tweet[] | undefined);
  console.log({ tweetGroup, currentList });
  return (
    <ContentContainer header="Timeline">
      <Box marginTop="5vw" />
      {tweetDetails == null ? undefined : (
        <VStack spacing="5vw">
          <Tweet key={tweetDetails[0].dataid} tweet={tweetDetails[0]} />
          {tweetDetails.slice(1).map((e) => (
            <TweetBox key={e.dataid} tweet={e} />
          ))}
        </VStack>
      )}
      <Box marginTop="5vw" />
    </ContentContainer>
  );
});
Timeline.displayName = "Timeline";

export { Timeline };
