import React from "react";
import { Box, Grid, GridItem, Heading, Divider } from "@chakra-ui/react";

interface Props {
  header: string;
  children: React.ReactNode;
}

const ContentContainer = (props: Props) => {
  const { header, children } = props;
  return (
    <Grid
      aria-label={header}
      role="article"
      templateRows="auto auto 1fr"
      height="100%"
      paddingRight="5vh"
    >
      <GridItem paddingLeft="5vw">
        <Heading size="xl">{header}</Heading>
      </GridItem>
      <Divider />
      <Box padding="3vw" overflowY="scroll" height="100%">
        {children}
      </Box>
    </Grid>
  );
};

const memorized = React.memo(ContentContainer);
memorized.displayName = ContentContainer.name;
export { memorized as ContentContainer };
