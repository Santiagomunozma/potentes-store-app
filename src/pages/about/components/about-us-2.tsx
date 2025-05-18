import {
  Box,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";

const AboutUs2 = () => {
  return (
    <Box id="about2" py="5rem">
      <Container fluid>
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group justify="center">
              <Stack gap="sm" maw={600}>
                <Title order={2} size="3rem" fw={900} tt="uppercase">
                  Sobre Nosotros
                </Title>
                <Text c="gray.5" size="md" lh="1.6">
                  En <strong>POTENTES</strong>,
                </Text>
                <Text c="gray.5" size="md" lh="1.6">
                  Desde 2023, venimos rompiendo esquemas con colecciones que
                  mezclan estilo, actitud y autenticidad. Somos más que una
                  marca: somos un movimiento.
                </Text>
              </Stack>
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box style={{ position: "relative" }}>
              <Image
                src="https://shakawear.com/cdn/shop/articles/IMG5171-R01-001A.jpg?v=1701971603"
                alt="Streetwear look"
                radius="md"
                style={{
                  border: "2px solid white",
                  objectFit: "cover",
                  maxHeight: "50vh",
                }}
                w="100%"
                h="auto"
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export { AboutUs2 };
