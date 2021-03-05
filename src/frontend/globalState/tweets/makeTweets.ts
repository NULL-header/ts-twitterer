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
    retweeter_name: retweeterName,
  } = tweetColumns;
  const tweet = {
    content,
    id,
    createdAt,
    iconUrl,
    userid,
    username,
    dataid,
    listId,
    isRetweeted,
    retweeterName,
  } as Tweet;
  return tweet;
};

const makeMedia = (mediaColumns?: MediaColumns) => {
  if (mediaColumns == null) return undefined;
  const { type: mediaType, media_url: mediaUrl } = mediaColumns;
  return { type: mediaType, mediaUrl } as Media;
};

export const makeTweet = (tweetLow: any): Tweet => {
  const tweet = extractData(tweetLow);
  tweet.media = makeMedia(tweetLow.media);
  return tweet;
};

export const makeTweets = (tweetLows: TweetColumns[]): Tweet[] =>
  tweetLows.map(makeTweet);
