export const makeConfigs = (configColumns: ConfigColumns): Configs => {
  const {
    current_list: currentList,
    last_tweet_id_group: lastTweetIdGroup,
    list_ids: listIds,
    newest_tweet_data_id_group: newestTweetDataIdGroup,
  } = configColumns;
  return { currentList, lastTweetIdGroup, listIds, newestTweetDataIdGroup };
};
