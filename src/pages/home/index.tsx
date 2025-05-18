import { Container, Stack } from "@mantine/core";
import { Jumbotron } from "./components/jumbotron";
import AboutUsUrban from "./components/about-us-urban";
import { Products } from "./components/products";
import RegisterCallToAction from "./components/register-call-to-action";
import AnnouncementTicker from "../../components/annoucement-ticker";

const Home = () => {
  return (
    <Container fluid>
      <Stack>
        <Jumbotron />
        <AnnouncementTicker />
        <AboutUsUrban />
        <RegisterCallToAction />
        <Products />
      </Stack>
    </Container>
  );
};

export { Home };
