import React from "react";
import { useTracked } from "frontend/globalState";
import { ThemeProvider } from "frontend/theme";
import { ScreenContainer } from "../ScreenContainer";

const ThemeLoader: React.FC = React.memo(() => {
  const [state] = useTracked();
  return (
    <ThemeProvider themeName={state.themename}>
      <ScreenContainer />
    </ThemeProvider>
  );
});
export const LoadContainer: React.FC = React.memo(() => {
  const [state] = useTracked();
  console.log({ state });
  if (state.isInitializing == null) return <div>Starting</div>;
  if (state.isInitializing) return <div>Loading</div>;
  return <ThemeLoader />;
});
