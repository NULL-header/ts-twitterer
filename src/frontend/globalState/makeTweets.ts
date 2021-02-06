export const makeTweets = async (
  tweetLows: TweetColumns[]
): Promise<Tweet[]> => {
  return tweetLows.map((e) => {
    const {
      content,
      media: mediaColumns,
      id,
      created_at: createdAt,
      icon_url: iconUrl,
      userid,
      dataid,
      username,
      list_id: listId,
    } = e;
    const media: Media[] | undefined = mediaColumns
      ? mediaColumns.map((e) => {
          const { media_url: mediaUrl, sizes, type: mediaType } = e;
          return { mediaUrl, sizes, type: mediaType };
        })
      : undefined;
    return {
      content,
      media,
      id,
      createdAt,
      iconUrl,
      userid,
      dataid,
      username,
      listId,
    };
  });
};
