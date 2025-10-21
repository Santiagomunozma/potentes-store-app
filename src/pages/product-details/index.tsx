import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  NumberInput,
  Select,
  Stack,
  Tabs,
  Text,
  Title,
  Skeleton,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconBolt,
  IconTruck,
  IconShield,
  IconRefresh,
} from "@tabler/icons-react";
import { useState, useMemo } from "react";
import { useGetProductDetails } from "./service";
import { useNavigate, useParams } from "@tanstack/react-router";
import useCartStore from "../../store/useCart";
import { ProductSell } from "../../types/product-sell";
import { Color } from "../../types/colors";
import { Size } from "../../types/sizes";
import toast from "react-hot-toast";

const ProductDetailsView = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const [color, setColor] = useState<Color | null>(null);
  const [size, setSize] = useState<Size | null>(null);

  const { addToCart, cart, removeFromCart } = useCartStore();

  const { id } = useParams({ from: "/product-details/$id" });
  const { data: response, isLoading } = useGetProductDetails(id);

  const availableSizes = useMemo(() => {
    if (!response?.data) return [];
    const uniqueSizes = [
      ...new Set(response.data.inventories.map((inv) => inv.size.size)),
    ];
    return uniqueSizes
      .map(
        (sizeValue) =>
          response.data.inventories.find((inv) => inv.size.size === sizeValue)
            ?.size
      )
      .filter(Boolean);
  }, [response?.data]);

  const availableColors = useMemo(() => {
    if (!response?.data || !size) return [];
    return [
      ...new Set(
        response.data.inventories
          .filter((inv) => inv.size.size === size?.size)
          .map((inv) => inv.color)
      ),
    ];
  }, [response?.data, size]);

  const availableStock = useMemo(() => {
    if (!response?.data || !size || !color) return 0;

    const inventory = response.data.inventories.find((inv) => {
      return inv.size.size === size?.size && inv.color.color === color?.color;
    });

    return inventory?.quantity ?? 0;
  }, [response?.data, size, color]);

  const handleAddToCart = () => {
    if (!response?.data || !size || !color) return;

    // Validamos si el producto ya esta en el carro
    const productInCart = cart.find(
      (product) =>
        product.product.id === response.data.id &&
        product.color.color === color.color &&
        product.size.size === size.size
    );

    if (productInCart) {
      // Si el producto ya esta en el carro, actualizamos la cantidad
      const updatedProduct = {
        ...productInCart,
        quantity: productInCart.quantity + quantity,
      };

      // Validamos disponibilidad en el inventario
      if (updatedProduct.quantity > availableStock) {
        toast.error("No hay suficiente stock");
        return;
      }

      removeFromCart(productInCart);
      addToCart(updatedProduct);
      return;
    }

    // Si el producto no esta en el carro, lo agregamos
    const productSell: ProductSell = {
      id: `${response.data.id}-${size}-${color}-${Date.now()}`,
      product: response.data,
      quantity,
      color,
      size,
      totalPrice: response.data.price * quantity,
    };

    // Validamos disponibilidad en el inventario
    if (productSell.quantity > availableStock) {
      toast.error("No hay suficiente stock");
      return;
    }

    addToCart(productSell);
  };

  const handleBuyNow = () => {
    if (!response?.data || !size || !color) return;

    const productSell: ProductSell = {
      id: `${response.data.id}-${size}-${color}-${Date.now()}`,
      product: response.data,
      quantity,
      color,
      size,
      totalPrice: response.data.price * quantity,
    };

    addToCart(productSell);
    navigate({ to: "/checkout" });
  };

  // Resetear color cuando cambia la talla
  const handleSizeChange = (newSize: Size | null) => {
    setSize(newSize);
    setColor(null);
    setQuantity(1);
  };

  const handleColorChange = (newColor: Color | null) => {
    setColor(newColor);
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <Box py="xl">
        <Container fluid>
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Skeleton height={300} radius="md" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <Skeleton height={30} width={100} />
                <Skeleton height={40} width="80%" />
                <Skeleton height={30} width={120} />
                <Skeleton height={100} width="100%" />
                <Skeleton height={40} width="100%" />
                <Skeleton height={40} width="100%" />
                <Skeleton height={40} width="100%" />
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!response?.data) {
    return (
      <Box py="xl">
        <Container>
          <Text>Producto no encontrado</Text>
        </Container>
      </Box>
    );
  }

  const product = response.data;

  return (
    <Box py="xl">
      <Container fluid>
        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Image
                src={product.imageUrl}
                alt={product.name}
                radius="md"
                fit="contain"
                w="100%"
                h={300}
                mah={500}
              />
            </Stack>
          </Grid.Col>

          {/* Detalles */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              <Group>
                <Badge variant="filled">{product.status}</Badge>
              </Group>

              <Title order={2} fw={900}>
                {product.name}
              </Title>
              <Group>
                <Text size="xl" fw={700}>
                  ${product.price.toLocaleString("es-CO")}
                </Text>
              </Group>

              <Text size="sm" c="gray.6" mt="xs">
                {product.description}
              </Text>

              <Divider my="sm" />

              <Stack gap="xs">
                <Select
                  label="Talla"
                  data={availableSizes.map((size) => size?.size || "")}
                  value={size?.size}
                  onChange={(value) => {
                    const selectedSize = availableSizes.find(
                      (s) => s?.size === value
                    );
                    if (selectedSize) {
                      const sizeWithDateObjects = {
                        ...selectedSize,
                        createdAt: new Date(selectedSize.createdAt),
                        updatedAt: new Date(selectedSize.updatedAt),
                      };
                      handleSizeChange(sizeWithDateObjects);
                    } else {
                      handleSizeChange(null);
                    }
                  }}
                  placeholder="Selecciona una talla"
                />

                <Select
                  label="Color"
                  data={availableColors.map((color) => color.color)}
                  value={color?.color}
                  onChange={(value) => {
                    const selectedColor = availableColors.find(
                      (c) => c.color === value
                    );
                    if (selectedColor) {
                      const colorWithDateObjects = {
                        ...selectedColor,
                        createdAt: new Date(selectedColor.createdAt),
                        updatedAt: new Date(selectedColor.updatedAt),
                      };
                      handleColorChange(colorWithDateObjects);
                    } else {
                      handleColorChange(null);
                    }
                  }}
                  placeholder="Selecciona un color"
                  disabled={!size}
                />

                {size && color && (
                  <NumberInput
                    label={`Cantidad (${availableStock} disponibles)`}
                    min={1}
                    max={availableStock}
                    value={quantity}
                    onChange={(v) => setQuantity(Number(v) || 1)}
                    disabled={availableStock === 0}
                  />
                )}
              </Stack>

              <Group grow mt="lg">
                <Button
                  leftSection={<IconShoppingCart size={18} />}
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!size || !color || availableStock === 0}
                >
                  Agregar al carrito
                </Button>
                <Button
                  leftSection={<IconBolt size={18} />}
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!size || !color || availableStock === 0}
                >
                  Comprar ahora
                </Button>
              </Group>

              <Divider my="sm" />

              <Group>
                <Group gap="xs">
                  <IconTruck size={20} />
                  <Text size="sm">
                    Envío gratis en compras mayores a $200.000
                  </Text>
                </Group>
              </Group>
              <Group>
                <Group gap="xs">
                  <IconShield size={20} />
                  <Text size="sm">Garantía de 30 días</Text>
                </Group>
              </Group>
              <Group>
                <Group gap="xs">
                  <IconRefresh size={20} />
                  <Text size="sm">Devoluciones sin costo</Text>
                </Group>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="xl" />

        <Tabs defaultValue="details">
          <Tabs.List>
            <Tabs.Tab value="details">Detalles del producto</Tabs.Tab>
            <Tabs.Tab value="care">Cuidados</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="md">
            <Stack>
              <Group>
                <Text fw={600}>SKU:</Text>
                <Text>{product.sku}</Text>
              </Group>
              <Group>
                <Text fw={600}>Disponibilidad:</Text>
                <Text>{product.stock > 0 ? "En stock" : "Agotado"}</Text>
              </Group>
              <Group>
                <Text fw={600}>Código del producto:</Text>
                <Text>{product.id}</Text>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="care" pt="md">
            <Text>{product.careInstructions}</Text>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
};

export default ProductDetailsView;
