import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck, IconShoppingBag } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const PurchaseSuccessPage = () => {
  const theme = useMantineTheme();

  return (
    <Box py="xl" style={{ minHeight: "100vh" }}>
      <Container size="md" px="md">
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack align="center" gap="xl">
            <Box
              style={{
                backgroundColor: theme.colors.green[1],
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconCheck size={40} color={theme.colors.green[6]} />
            </Box>

            <Title order={1} c={theme.primaryColor} ta="center">
              ¡Compra realizada con éxito!
            </Title>

            <Text size="lg" ta="center">
              Gracias por tu compra. Hemos recibido tu pedido y será procesado a
              la brevedad.
            </Text>

            <Text size="md" c="dimmed" ta="center">
              Recibirás un correo con los detalles de tu compra y el seguimiento
              de tu pedido.
            </Text>

            <Button
              component={Link}
              href="/products"
              leftSection={<IconShoppingBag size={16} />}
              variant="filled"
              mt="lg"
              size="lg"
            >
              Continuar comprando
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default PurchaseSuccessPage;
