import {
  Box,
  Button,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowRight, IconSwipeDown } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

const Jumbotron = () => {
  const { colors } = useMantineTheme();

  return (
    <Stack id="jumbotron">
      <Grid gutter="xl" align="center">
        <Grid.Col span={{ xs: 12, md: 6 }}>
          <Box style={{ position: "relative" }}>
            <Image
              src="https://monoicstudios.com/cdn/shop/articles/aime-leon-dore.jpg?v=1681352380"
              alt="Hoodie"
              fit="cover"
              w="100%"
              h="auto"
              style={{ maxHeight: "80vh" }}
              radius="md"
            />
          </Box>
        </Grid.Col>
        <Grid.Col span={{ xs: 12, md: 6 }}>
          <Group justify="center">
            <Stack gap="xl" maw={600}>
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
                  En <strong>Potentes POOI</strong>, no solo vendemos ropa,
                  ofrecemos una experiencia. Mas que una tienda, somos una
                  comunidad que apoya el estilo unico de cada persona,
                  impulsando la confianza.
                </Text>
              </Box>
              <Group>
                <Button
                  component={Link}
                  href="/products"
                  variant="filled"
                  fw={400}
                  rightSection={<IconArrowRight size={16} />}
                >
                  Comprar
                </Button>
              </Group>
            </Stack>
          </Group>
        </Grid.Col>
      </Grid>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack
          onClick={() => {
            window.location.href = "#aboutUsUrban";
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
              Conoce nuestra historia
            </Text>
          </motion.div>
        </Stack>
      </motion.div>
    </Stack>
  );
};

export { Jumbotron };
