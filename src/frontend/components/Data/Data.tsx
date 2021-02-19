import React from "react";
import { useTracked } from "frontend/globalState";

export const Data: React.FC = React.memo(() => {
  const [state] = useTracked();
  const { limitData } = state;
  return <div>{JSON.stringify(limitData)}</div>;
});
