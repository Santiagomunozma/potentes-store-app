import { Container, Stack } from "@mantine/core";
import AboutUsUrban from "./components/about-us-urban";
import { Jumbotron } from "./components/jumbotron";
import { ValuesSection } from "./components/values-section/components";
import { AboutUs2 } from "./components/about-us-2";
import TestimonialsSection from "./components/testimonials";

const About = () => {
  return (
    <Container fluid>
      <Stack>
        <Jumbotron />
        <AboutUsUrban />
        <ValuesSection />
        <AboutUs2 />
        <TestimonialsSection />
      </Stack>
    </Container>
  );
};

export { About };
