import React from "react";
import { useStyles } from "./style";

export const Tweet: React.FC<{ tweet: Tweet }> = React.memo((props) => {
  console.log(props.tweet.media);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.tweetContainer}>
        <img src={props.tweet.iconUrl} className={classes.icon}></img>
        <div className={classes.user}>
          <div>{props.tweet.username}</div>
          <div>{"@" + props.tweet.userid}</div>
        </div>
        <div className={classes.tweetContent}>{props.tweet.content}</div>
      </div>
      <div className={classes.image}>{makeImageElement(props.tweet)}</div>
    </div>
  );
});

const makeImageElement = (tweet: Tweet) => {
  console.log(tweet);
  if (tweet.media == null || tweet.media.type !== "photo") return;
  return tweet.media.mediaUrl.map((e, i) => <img src={e} key={i} />);
};
