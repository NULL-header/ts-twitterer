import React from "react";

export const Tweet: React.FC<{ tweet: Tweet }> = React.memo((props) => {
  return (
    <div>
      <img src={props.tweet.iconUrl} alt="icon"></img>
      <div>
        <span>{props.tweet.username}</span>
        <span>{props.tweet.userid}</span>
      </div>
      <div>{props.tweet.content}</div>
    </div>
  );
});
