import { Card, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import React from "react";

type ValuesSectionCardProps = {
  title: string;
  description: string;
  icon: React.FC<{ size: number }>;
};

const ValuesSectionCard = ({
  title,
  description,
  ...props
}: ValuesSectionCardProps) => {
  return (
    <Card radius="md" padding="xl" bg="white" shadow="none">
      <Stack gap="xs">
        <ThemeIcon size={48} radius="xl" variant="outline">
          <props.icon size={28} />
        </ThemeIcon>
        <Title order={4} c="primary">
          {title}
        </Title>
        <Text>{description}</Text>
      </Stack>
    </Card>
  );
};

export { ValuesSectionCard };
