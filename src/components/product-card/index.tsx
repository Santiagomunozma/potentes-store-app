import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title,
  Tooltip,
  ActionIcon,
  Select,
  Grid,
  NumberInput,
} from "@mantine/core";
import { IconShoppingCart, IconInfoCircle } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { Product } from "../../types/product";
import { useState, useMemo } from "react";
import { Color } from "../../types/colors";
import { Size } from "../../types/sizes";
import useCartStore from "../../store/useCart";
import { ProductSell } from "../../types/product-sell";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const {
    id,
    name,
    imageUrl,
    price,
    status,
    stock,
    sku,
    description,
    inventories,
  } = product;

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [quantity, setQuantity] = useState(1);

  const isLowStock = stock <= 5;
  const isOutOfStock = stock === 0;

  // Obtener tallas únicas disponibles
  const availableSizes = useMemo(() => {
    return [...new Set(inventories.map((inv) => inv.size))];
  }, [inventories]);

  // Obtener colores disponibles para la talla seleccionada
  const availableColors = useMemo(() => {
    if (!selectedSize) return [];
    return [
      ...new Set(
        inventories
          .filter((inv) => inv.size.size === selectedSize.size)
          .map((inv) => inv.color)
      ),
    ];
  }, [inventories, selectedSize]);

  // Obtener stock disponible para la combinación seleccionada
  const availableStock = useMemo(() => {
    if (!selectedSize || !selectedColor) return 0;
    const inventory = inventories.find(
      (inv) =>
        inv.size.size === selectedSize.size &&
        inv.color.color === selectedColor.color
    );
    return inventory?.quantity ?? 0;
  }, [inventories, selectedSize, selectedColor]);

  const handleSizeChange = (sizeValue: string | null) => {
    if (!sizeValue) {
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
      return;
    }
    const size = availableSizes.find((s) => s.size === sizeValue);
    if (size) {
      const sizeWithDateObjects = {
        ...size,
        createdAt: new Date(size.createdAt),
        updatedAt: new Date(size.updatedAt),
      };
      setSelectedSize(sizeWithDateObjects);
      setSelectedColor(null);
      setQuantity(1);
    }
  };

  const handleColorChange = (colorValue: string | null) => {
    if (!colorValue) {
      setSelectedColor(null);
      setQuantity(1);
      return;
    }
    const color = availableColors.find((c) => c.color === colorValue);
    if (color) {
      const colorWithDateObjects = {
        ...color,
        createdAt: new Date(color.createdAt),
        updatedAt: new Date(color.updatedAt),
      };
      setSelectedColor(colorWithDateObjects);
      setQuantity(1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize || !selectedColor) return;

    const productSell: ProductSell = {
      id: `${id}-${selectedSize.size}-${selectedColor.color}-${Date.now()}`,
      product,
      quantity,
      color: selectedColor,
      size: selectedSize,
      totalPrice: price * quantity,
    };

    addToCart(productSell);
  };

  const handleNavigateToDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: "/product-details/$id", params: { id: id } } as any);
  };

  return (
    <Card
      p="xl"
      style={{
        position: "relative",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      }}
      bg="white"
    >
      <Stack gap="md">
        <Box
          style={{ position: "relative", cursor: "pointer" }}
          onClick={handleNavigateToDetails}
        >
          <Image
            src={imageUrl}
            alt={name}
            radius="md"
            h={400}
            fit="cover"
            style={{ objectPosition: "center", objectFit: "contain" }}
          />
          <Box style={{ position: "absolute", top: 10, left: 10 }}>
            {isOutOfStock ? (
              <Badge color="red" variant="filled" size="lg" c="white">
                AGOTADO
              </Badge>
            ) : isLowStock ? (
              <Badge color="yellow" variant="filled" size="lg" c="white">
                ÚLTIMAS UNIDADES
              </Badge>
            ) : (
              <Badge color="green" variant="filled" size="lg" c="white">
                DISPONIBLE
              </Badge>
            )}
          </Box>
          <Group
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              gap: "xs",
            }}
            justify="flex-end"
          >
            {status === "bestseller" && (
              <Badge color="red" variant="filled" size="lg" c="white">
                🔥 MÁS VENDIDO
              </Badge>
            )}
            <Tooltip label="Ver detalles">
              <ActionIcon
                variant="filled"
                color="primary"
                radius="xl"
                onClick={handleNavigateToDetails}
              >
                <IconInfoCircle size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>

        <Stack gap={8}>
          <Title
            order={2}
            lineClamp={2}
            style={{ minHeight: "3.5rem", cursor: "pointer" }}
            onClick={handleNavigateToDetails}
          >
            {name}
          </Title>

          <Text size="sm" c="dimmed" lineClamp={2}>
            {description}
          </Text>

          <Group align="center" justify="space-between">
            <Text size="xl" fw={700} c="primary">
              ${price.toLocaleString("es-CO")}
            </Text>
            <Text size="sm" c="dimmed">
              SKU: {sku}
            </Text>
          </Group>
        </Stack>

        <Stack gap={8}>
          <Grid gutter="xs">
            <Grid.Col span={6}>
              <Select
                label="Talla"
                placeholder="Selecciona una talla"
                data={availableSizes.map((size) => size.size)}
                value={selectedSize?.size}
                onChange={handleSizeChange}
                disabled={isOutOfStock}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Color"
                placeholder="Selecciona un color"
                data={availableColors.map((color) => color.color)}
                value={selectedColor?.color}
                onChange={handleColorChange}
                disabled={!selectedSize || isOutOfStock}
              />
            </Grid.Col>
          </Grid>

          {selectedSize && selectedColor && (
            <Stack gap={4}>
              <NumberInput
                label="Cantidad"
                placeholder="Selecciona la cantidad"
                min={1}
                max={availableStock}
                value={quantity}
                onChange={(value) => setQuantity(Number(value) || 1)}
                disabled={availableStock === 0}
              />
              <Text size="sm" c="dimmed">
                {availableStock} unidades disponibles
              </Text>
            </Stack>
          )}
        </Stack>

        <Button
          leftSection={<IconShoppingCart size={18} />}
          variant="light"
          color="primary"
          disabled={!selectedSize || !selectedColor || availableStock === 0}
          onClick={handleAddToCart}
          fullWidth
        >
          Agregar al carrito
        </Button>
      </Stack>
    </Card>
  );
};

export default ProductCard;
