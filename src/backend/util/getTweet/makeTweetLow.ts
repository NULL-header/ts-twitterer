import { extractDataFromMedia } from "./makeMedia";
import { removeUrl } from "./removeUrl";

const extractData = (tweetData: any) => {
  const {
    full_text: contentData,
    created_at: createdAt,
    user: {
      screen_name: twitterId,
      name,
      profile_image_url_https: iconUrl,
      description,
      profile_banner_url: bannerUrl,
    },
    extended_entities: extendedEntities,
  } = tweetData;
  const mutable = {
    content: contentData,
    media: undefined as Media | undefined,
    hasMedia: false,
  };
  if (extendedEntities != null) {
    const { indicesArray, media: mediaNonNullable } = extractDataFromMedia(
      extendedEntities.media,
    ) as NonNullable<ReturnType<typeof extractDataFromMedia>>;
    mutable.media = mediaNonNullable;
    mutable.hasMedia = true;
    mutable.content = removeUrl(indicesArray, contentData);
  }
  return {
    tweet: {
      createdAt,
      user: {
        name,
        twitterId,
        iconUrl,
        description,
        bannerUrl,
      },
      ...mutable,
    },
  };
};

export const makeTweetLow = (tweetData: any, listId: string): TweetColumns => {
  let tweetLow: any;
  const { id_str: dataid } = tweetData;
  if (tweetData.retweeted_status) {
    tweetLow = extractData(tweetData.retweeted_status);
    tweetLow.tweet.isRetweeted = true;
    tweetLow.tweet.retweeterName = tweetData.user.name;
  } else {
    tweetLow = extractData(tweetData);
    tweetLow.tweet.isRetweeted = false;
  }
  tweetLow.tweet.listId = listId;
  tweetLow.tweet.dataid = dataid;
  return tweetLow as TweetColumns;
};
