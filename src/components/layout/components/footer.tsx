import {
  Box,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Anchor,
  useMantineTheme,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

const Footer = () => {
  const { colors } = useMantineTheme();

  return (
    <Box component="footer" bg="white" p="xl">
      <Container fluid>
        <Stack gap="xs" align="center">
          <Stack gap={0} align="center">
            <Title order={6} fw={400}>
              LOS
            </Title>
            <Title order={4} lh={1}>
              P O T E N T E S
            </Title>
          </Stack>
          <Text c="dimmed" size="sm">
            Marca de ropa urbana para hombres y mujeres, con un estilo moderno y
            urbano.
          </Text>
          <Group mt="sm" gap={6}>
            <IconMail size={16} color={colors.primary[5]} />
            <Anchor href="mailto:hi@hoodie.com" underline="always" c="primary">
              hi@potentes.com
            </Anchor>
          </Group>
        </Stack>

        <Divider my="xl" />

        <Group justify="space-between" gap="xs" fz="xs">
          <Text c="dimmed">© 2025 Potentes. All Rights Reserved.</Text>
          <Group gap="sm">
            <Anchor href="#" c="primary">
              Terms of Service
            </Anchor>
            <Anchor href="#" c="primary">
              Privacy Policy
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
