import { Box, Container, Grid, Stack, Text, Title } from "@mantine/core";
import { TestimonialCard } from "./components/testimonial-card";

const testimonials = [
  {
    name: "Camila R.",
    location: "Medellín, CO",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "La calidad de POTENTES es brutal. La hoodie que pedí llegó rápido y se siente premium. Ya quiero la nueva colección.",
  },
  {
    name: "Juan P.",
    location: "Bogotá, CO",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content:
      "Ropa con actitud. Se nota que saben lo que hacen, diseño brutal y vibra real. ¡Sigan así!",
  },
  {
    name: "Natalia M.",
    location: "Cali, CO",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    content:
      "La experiencia de compra fue rápida, clara y el empaque está de otro nivel. ¡Muy potentes!",
  },
];

const TestimonialsSection = () => {
  return (
    <Box id="testimonialSection">
      <Container>
        <Stack align="center" mb="xl">
          <Title order={2} size="3rem" fw={900} tt="uppercase">
            Lo Que Dicen de Nosotros
          </Title>
          <Text c="gray.5" ta="center" maw={600}>
            Historias reales de clientes que ya son parte de la tribu.
          </Text>
        </Stack>

        <Grid gutter="xl">
          {testimonials.map((t, i) => (
            <Grid.Col key={i} span={{ base: 12, sm: 4 }}>
              <TestimonialCard
                name={t.name}
                content={t.content}
                avatar={t.avatar}
                location={t.location}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
