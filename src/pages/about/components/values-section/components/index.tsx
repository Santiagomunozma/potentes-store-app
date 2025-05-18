import { Box, Container, Grid, Stack, Text, Title } from "@mantine/core";
import {
  IconStars,
  IconFlame,
  IconHeartHandshake,
  IconUsersGroup,
} from "@tabler/icons-react";
import { ValuesSectionCard } from "../values-section-card";

const values = [
  {
    icon: IconStars,
    title: "Autenticidad",
    description:
      "Celebramos lo real. Cada prenda es una declaración de identidad, sin filtros ni imitaciones.",
  },
  {
    icon: IconFlame,
    title: "Actitud",
    description:
      "Diseñamos para quienes viven intensamente, con estilo y sin pedir permiso.",
  },
  {
    icon: IconHeartHandshake,
    title: "Compromiso",
    description:
      "Nos importa tu experiencia. Apostamos por la calidad, el detalle y el respeto por la cultura urbana.",
  },
  {
    icon: IconUsersGroup,
    title: "Comunidad",
    description:
      "Más que clientes, somos una tribu. Una familia que vibra con la moda y la calle.",
  },
];

const ValuesSection = () => {
  return (
    <Box id="valuesSection">
      <Container fluid>
        <Stack align="center" mb="xl">
          <Title
            order={2}
            size="3rem"
            fw={900}
            tt="uppercase"
            ta="center"
            style={{ letterSpacing: "-0.5px" }}
          >
            Nuestros Valores
          </Title>
          <Text c="gray.5" ta="center" maw={600}>
            Lo que defendemos y llevamos en cada prenda.
          </Text>
        </Stack>

        <Grid gutter="xl" justify="center" align="center">
          {values.map((value) => (
            <Grid.Col key={value.title} span={{ base: 12, sm: 5, md: 3 }}>
              <ValuesSectionCard
                title={value.title}
                description={value.description}
                icon={value.icon}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export { ValuesSection };
