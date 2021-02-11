import React from "react";
import { useSelector } from "src/frontend/globalState";
import { ThemeProvider } from "src/frontend/theme";
import { ScreenContainer } from "..";

export const LoadContainer: React.FC = React.memo(() => {
  const state = useSelector((state) => state);
  console.log({ state });
  const isInit = useSelector((state) => state.isInitializing);
  if (isInit == null) return <div>Starting</div>;
  else if (isInit) return <div>Loading</div>;
  else return <ThemeLoader />;
});

const ThemeLoader: React.FC = React.memo(() => {
  const themename = useSelector((state) => state.themename);
  return (
    <ThemeProvider themeName={themename}>
      <ScreenContainer />
    </ThemeProvider>
  );
});
