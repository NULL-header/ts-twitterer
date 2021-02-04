/* eslint-disable camelcase */
export const makeTweetLow = (tweetData: any) => {
  const {
    text: content,
    id: dataid,
    created_at,
    user: { screen_name: userid, name: username, profile_image_url: icon_url },
  } = tweetData;
  return { content, dataid, created_at, userid, username, icon_url } as const;
};
