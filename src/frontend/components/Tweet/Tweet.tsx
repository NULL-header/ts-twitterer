import React from "react";

interface Props {
  content: string;
  username: string;
  userid: string;
  iconUrl: string;
}

export const Tweet: React.FC<Props> = React.memo((props) => {
  return (
    <div>
      <div>{props.iconUrl}</div>
      <div>
        <span>{props.username}</span>
        <span>{props.userid}</span>
      </div>
      <div>{props.content}</div>
    </div>
  );
});
