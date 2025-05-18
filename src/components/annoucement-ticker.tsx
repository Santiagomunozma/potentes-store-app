import { Box, Text } from "@mantine/core";
import { motion } from "framer-motion";

// Estilo base del contenedor
const containerStyles = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  display: "flex",
  padding: "0.5rem 0",
};

// Variantes para animación infinita sin cortes
const marqueeVariants = {
  animate: {
    x: ["0%", "-100%"],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 15,
        ease: "linear",
      },
    },
  },
};

const AnnouncementTicker = () => {
  const phrases = [
    "✶ MUESTRA TU ESTILO  ",
    "✶ POTENTES STREETWEAR  ",
    "✶ MAS QUE UNA TIENDA  ",
    "✶ ACTITUD URBANA  ",
  ];
  const text = phrases.join("");

  return (
    <Box bg="primary.5" style={containerStyles}>
      <motion.div
        variants={marqueeVariants}
        animate="animate"
        style={{
          display: "flex",
          minWidth: "200%",
        }}
      >
        {[...Array(2)].map((_, index) => (
          <Text
            key={index}
            c="white"
            fw={600}
            size="2rem"
            px="md"
            style={{ display: "inline-block" }}
          >
            {text.repeat(5)}
          </Text>
        ))}
      </motion.div>
    </Box>
  );
};

export default AnnouncementTicker;
