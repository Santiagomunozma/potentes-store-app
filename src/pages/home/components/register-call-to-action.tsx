import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";

const RegisterCallToAction = () => {
  const { colors } = useMantineTheme();
  return (
    <Box
      py={80}
      style={{
        backgroundColor: colors.primary[5],
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/debut-light.png")',
        backgroundSize: "auto",
        color: "white",
        textAlign: "center",
        borderRadius: "10px",
      }}
    >
      <Container>
        <Stack gap="sm" align="center">
          <Title order={2} size="3rem" fw={900} tt="uppercase">
            Únete al Movimiento
          </Title>
          <Text size="lg">
            Regístrate y sé el primero en descubrir las nuevas colecciones,
            lanzamientos exclusivos y ofertas callejeras que no verás en ningún
            otro lado.
          </Text>
          <Button
            component={Link}
            href="/register"
            size="lg"
            radius="sm"
            variant="white"
            mt="md"
            style={{ fontWeight: 700, textTransform: "uppercase" }}
          >
            Registrarme Ahora
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default RegisterCallToAction;
