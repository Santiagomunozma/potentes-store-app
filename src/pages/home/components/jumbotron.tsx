import {
  Box,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import ImageJumbotron from "../../../assets/images/jumbotron.jpg";
import Logo from "../../../assets/images/brand/logo.png";
import { IconSwipeDown } from "@tabler/icons-react";
import { motion } from "framer-motion";

const Jumbotron = () => {
  const { colors } = useMantineTheme();

  return (
    <Stack>
      <Grid gutter="xl" align="center">
        <Grid.Col span={{ xs: 12, md: 6 }}>
          <Group justify="center">
            <Stack gap="lg" maw={600}>
              <Group>
                <Image
                  src={Logo}
                  alt="Logo"
                  w={200}
                  h={200}
                  draggable={false}
                />
              </Group>
              <Box>
                <Title order={1} fw={900} size="3rem" lh={1}>
                  <span
                    style={{
                      fontSize: "3rem",
                      fontWeight: 400,
                      lineHeight: 1,
                      fontStyle: "italic",
                    }}
                  >
                    MAS QUE UNA
                  </span>{" "}
                  <br />
                  TIENDA DE ROPA
                </Title>
                <Text mt="md" c="dimmed">
                  Introducing our innovative Double Layered Zipper Mask Hoodie –
                  the epitome of functionality and style. Crafted from a robust
                  blend of heavy-duty cotton, fleece, and polyester, this hoodie
                  ensures durability and comfort.
                </Text>
              </Box>
            </Stack>
          </Group>
        </Grid.Col>

        <Grid.Col span={{ xs: 12, md: 6 }}>
          <Box style={{ position: "relative" }}>
            <Image
              src={ImageJumbotron}
              alt="Hoodie"
              fit="cover"
              w="100%"
              h="auto"
              style={{ maxHeight: "80vh" }}
              radius="md"
            />
          </Box>
        </Grid.Col>
      </Grid>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack
          onClick={() => {
            window.location.href = "#products";
          }}
          justify="center"
          align="center"
          gap="0"
          pt="xl"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <IconSwipeDown size={20} color={colors.primary[5]} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Text fs="italic" c="primary">
              Conoce nuestros productos
            </Text>
          </motion.div>
        </Stack>
      </motion.div>
    </Stack>
  );
};

export { Jumbotron };
