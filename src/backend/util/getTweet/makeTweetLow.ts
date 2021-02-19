/* eslint-disable @typescript-eslint/naming-convention */

import { extractDataFromMedia } from "./makeMedia";
import { removeUrl } from "./removeUrl";

const extractData = (tweetData: any) => {
  const {
    full_text: contentData,
    id_str: dataid,
    created_at,
    user: { screen_name: userid, name: username, profile_image_url: icon_url },
    extended_entities,
  } = tweetData;
  let content: string = contentData;
  let media;
  if (extended_entities != null) {
    const { indicesArray, media: mediaNonNullable } = extractDataFromMedia(
      extended_entities.media,
    ) as NonNullable<ReturnType<typeof extractDataFromMedia>>;
    media = mediaNonNullable;
    content = removeUrl(indicesArray, contentData);
  }
  return {
    content,
    dataid,
    created_at,
    userid,
    username,
    icon_url,
    media,
  };
};

export const makeTweetLow = (tweetData: any, listId: string): TweetColumns => {
  let tweetLow: any;
  if (tweetData.retweeted_status) {
    tweetLow = extractData(tweetData.retweeted_status);
    tweetLow.is_retweeted = true;
    tweetLow.retweeter_name = tweetData.user.name;
  } else {
    tweetLow = extractData(tweetData);
    tweetLow.is_retweeted = false;
  }
  tweetLow.list_id = listId;
  return tweetLow;
};
