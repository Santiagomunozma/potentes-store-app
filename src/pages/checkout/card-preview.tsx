import { Box, Text } from "@mantine/core";

type CardBrand = "visa" | "mastercard" | "unknown";

const detectCardBrand = (digits: string): CardBrand => {
  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  if (digits.length >= 4) {
    const prefix = Number(digits.slice(0, 4));
    if (prefix >= 2221 && prefix <= 2720) return "mastercard";
  }
  return "unknown";
};

const brandStyle: Record<CardBrand, { background: string; label: string }> = {
  visa: {
    background: "linear-gradient(135deg, #1a1f71 0%, #2f5bd3 55%, #5b8def 100%)",
    label: "VISA",
  },
  mastercard: {
    background: "linear-gradient(135deg, #3a0d12 0%, #eb001b 48%, #f79e1b 100%)",
    label: "Mastercard",
  },
  unknown: {
    background: "linear-gradient(135deg, #1f2933 0%, #3d4f5f 100%)",
    label: "TARJETA",
  },
};

type CardPreviewProps = {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  flipped: boolean;
};

const CardPreview = ({ name, number, expiry, cvv, flipped }: CardPreviewProps) => {
  const digits = number.replace(/\D/g, "").slice(0, 16);
  const brand = detectCardBrand(digits);
  const theme = brandStyle[brand];
  const shownNumber = Array.from({ length: 16 }, (_, index) => digits[index] || "•")
    .map((char, index) => (index > 0 && index % 4 === 0 ? ` ${char}` : char))
    .join("");

  return (
    <Box style={{ perspective: 1200, height: 190 }}>
      <Box
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(.4,.2,.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <Box
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            padding: 20,
            color: "white",
            background: theme.background,
            backfaceVisibility: "hidden",
            boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
            overflow: "hidden",
            animation: "cardShine 2.8s ease-in-out infinite",
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: -40,
              right: -30,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
            }}
          />
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box
              style={{
                width: 42,
                height: 32,
                borderRadius: 6,
                background: "linear-gradient(135deg, #f6e27a, #c9a227)",
              }}
            />
            {brand === "mastercard" ? (
              <Box style={{ display: "flex" }}>
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#eb001b",
                  }}
                />
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#f79e1b",
                    marginLeft: -12,
                  }}
                />
              </Box>
            ) : (
              <Text fw={800} size="lg" style={{ letterSpacing: brand === "visa" ? 2 : 1 }}>
                {theme.label}
              </Text>
            )}
          </Box>
          <Text
            mt={36}
            fw={600}
            style={{ letterSpacing: 2, fontFamily: "monospace", fontSize: 20 }}
          >
            {shownNumber}
          </Text>
          <Box style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            <Box>
              <Text size="xs" opacity={0.75}>
                TITULAR
              </Text>
              <Text fw={600} tt="uppercase" lineClamp={1}>
                {name.trim() || "NOMBRE APELLIDO"}
              </Text>
            </Box>
            <Box>
              <Text size="xs" opacity={0.75}>
                VENCE
              </Text>
              <Text fw={600}>{expiry || "MM/AA"}</Text>
            </Box>
          </Box>
        </Box>

        <Box
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            color: "white",
            background: theme.background,
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          <Box style={{ height: 42, marginTop: 22, background: "rgba(0,0,0,0.75)" }} />
          <Box style={{ padding: 20 }}>
            <Text size="xs" opacity={0.75} ta="right">
              CVV
            </Text>
            <Box
              style={{
                marginTop: 6,
                background: "white",
                color: "#111",
                borderRadius: 6,
                padding: "8px 12px",
                textAlign: "right",
                letterSpacing: 3,
                fontFamily: "monospace",
              }}
            >
              {cvv || "•••"}
            </Box>
            <Text mt="md" fw={700} ta="right">
              {theme.label}
            </Text>
          </Box>
        </Box>
      </Box>
      <style>
        {`@keyframes cardShine {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.12); }
        }`}
      </style>
    </Box>
  );
};

export { CardPreview, detectCardBrand };
