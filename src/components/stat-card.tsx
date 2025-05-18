import { Card, Stack, Text, Title } from "@mantine/core";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
};

const StatCard = ({ label, value, change }: StatCardProps) => (
  <Card withBorder radius="md" padding="lg" shadow="none" bg="white">
    <Stack gap={2}>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Title order={3}>{value}</Title>
      <Text size="xs" c={change.includes("+") ? "green" : "red"}>
        {change} desde el mes pasado
      </Text>
    </Stack>
  </Card>
);

export { StatCard };
