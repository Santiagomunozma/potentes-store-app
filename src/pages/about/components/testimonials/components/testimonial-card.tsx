import { Avatar, Card, Stack, Text } from "@mantine/core";

type TestimonialCardProps = {
  name: string;
  content: string;
  avatar: string;
  location: string;
};
const TestimonialCard = ({
  name,
  content,
  avatar,
  location,
}: TestimonialCardProps) => {
  return (
    <Card withBorder radius="md" p="xl" shadow="none" bg="white">
      <Stack gap="sm">
        <Text size="sm">“{content}”</Text>
        <Stack gap={0} mt="md">
          <Avatar src={avatar} size="sm" radius="xl" />
          <Text fw={600} size="sm" mt={4}>
            {name}
          </Text>
          <Text size="xs" c="gray.5">
            {location}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
};

export { TestimonialCard };
