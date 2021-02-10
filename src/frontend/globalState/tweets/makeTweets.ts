export const makeTweets = (tweetLows: TweetColumns[]): Tweet[] => {
  return tweetLows.map((e) => {
    const tweet = extractData(e);
    tweet.media = makeMedia(e.media);
    return tweet;
  });
};

const makeMedia = (mediaColumns?: MediaColumns) => {
  if (mediaColumns == null) return undefined;
  const { type: mediaType, media_url: mediaUrl } = mediaColumns;
  return { type: mediaType, mediaUrl } as Media;
};

const extractData = (tweetColumns: TweetColumns): Tweet => {
  const {
    content,
    id,
    created_at: createdAt,
    icon_url: iconUrl,
    userid,
    dataid,
    username,
    list_id: listId,
    is_retweeted: isRetweeted,
  } = tweetColumns;
  const retweeterName = (tweetColumns as any).retweeter_name as
    | string
    | undefined;
  const retweetData = makeRetweetData(isRetweeted, retweeterName);
  const tweet: Tweet = {
    content,
    id,
    createdAt,
    iconUrl,
    userid,
    username,
    dataid,
    listId,
    ...retweetData,
  };
  return tweet;
};

const makeRetweetData = (isRetweeted: boolean, retweeterName?: string) => {
  if (isRetweeted) {
    if (retweeterName == null) throw new Error("retweeterName is undefined");
    return { isRetweeted, retweeterName };
  } else {
    return { isRetweeted };
  }
};
