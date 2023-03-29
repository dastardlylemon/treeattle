import { Box, Paper, Space } from "@mantine/core";
import Logo from "./Logo";
import Filters from "./Filters";

export default function ControlPanel() {
  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing.md,
        position: "absolute",
        width: 400,
        left: 0,
        top: 0,
        zIndex: 1,
      })}
    >
      <Paper shadow="md" radius="md" p="md">
        <Logo />
        <Space h="md" />
        <Filters />
      </Paper>
    </Box>
  );
}
