import React from "react";
import { useSelector } from "src/frontend/globalState";
export const Data: React.FC = React.memo(() => {
  const limitData = useSelector((state) => state.limitData);
  return <div>{JSON.stringify(limitData)}</div>;
});
