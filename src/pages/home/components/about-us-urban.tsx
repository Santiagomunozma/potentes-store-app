import {
  Box,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import ImageAboutUs from "../../../assets/images/about-us.jpg";
import { Link } from "@tanstack/react-router";

const AboutUsUrban = () => {
  return (
    <Box py="5rem">
      <Container fluid>
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Box style={{ position: "relative" }}>
              <Image
                src={ImageAboutUs}
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
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Group justify="center">
              <Stack gap="sm" maw={600}>
                <Title order={2} size="3rem" fw={900} tt="uppercase">
                  Sobre Nosotros
                </Title>
                <Text c="gray.5" size="md" lh="1.6">
                  En <strong>POTENTES</strong>, cstiven es como medio gray
                </Text>
                <Text c="gray.5" size="md" lh="1.6">
                  Desde 2023, venimos rompiendo esquemas con colecciones que
                  mezclan estilo, actitud y autenticidad. Somos más que una
                  marca: somos un movimiento.
                </Text>
                <Group>
                  <Button
                    component={Link}
                    href="/about"
                    variant="filled"
                    fw={400}
                    mt="md"
                  >
                    Conócenos más
                  </Button>
                </Group>
              </Stack>
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUsUrban;
