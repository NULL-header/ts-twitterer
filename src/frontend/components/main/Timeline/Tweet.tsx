import React from "react";
import {
  Box,
  Divider,
  Grid,
  GridItem,
  Text,
  Image,
  VStack,
} from "@chakra-ui/react";

const makeMediaElement = (tweet: Tweet) => {
  if (tweet.media == null) return;
  switch (tweet.media.type) {
    case "photo": {
      return (
        <VStack spacing="5vw">
          {tweet.media.mediaUrl.map((e, i) => (
            // no it changes
            // eslint-disable-next-line react/no-array-index-key
            <Image src={e} key={i} />
          ))}
        </VStack>
      );
    }
    case "animated_gif": {
      break;
    }
    case "video": {
      break;
    }
    default: {
      throw new Error("An error occurred in showing media");
    }
  }
};

const makeUsername = (username: string) =>
  username.length > 20 ? `${username.slice(0, 21)}…` : username;

const Tweet = React.memo(({ tweet }: { tweet: Tweet }) => {
  const username = makeUsername(tweet.user.name);
  return (
    <Box role="group" width="100%">
      {tweet.isRetweeted && (
        <>
          <Text role="note">{`${tweet.retweeterName}さんがリツイート`}</Text>
          <Divider />
        </>
      )}
      <Grid templateColumns="auto 1fr" templateRows="auto auto 1fr">
        <GridItem rowSpan={2} colSpan={1}>
          <Image src={tweet.user.iconUrl} alt="icon" />
        </GridItem>
        <GridItem paddingLeft="2vw">
          <Text>{username}</Text>
        </GridItem>
        <GridItem paddingLeft="2vw">
          <Text>{`@${tweet.user.twitterId}`}</Text>
        </GridItem>
        <GridItem colSpan={2}>
          <Text whiteSpace="pre-line">{tweet.content}</Text>
        </GridItem>
      </Grid>
      {makeMediaElement(tweet)}
    </Box>
  );
});

Tweet.displayName = "Tweet";
export { Tweet };
