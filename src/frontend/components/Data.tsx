import React from "react";
import { useTracked } from "frontend/globalState";
import { ContentContainer } from "./ContentContainer";

const Data = React.memo(() => {
  const [state] = useTracked();
  const { limitData } = state;
  return (
    <ContentContainer header="Data">
      {JSON.stringify(limitData)}
    </ContentContainer>
  );
});

Data.displayName = "Data";

export { Data };
