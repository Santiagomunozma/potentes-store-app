import {
  Box,
  Container,
  Grid,
  Loader,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/product-card";
import { useGetProducts } from "../products-management/components/products-table/service";
import { potentesApi } from "../../utils/api";

const Products = () => {
  const { data: products, error, isSuccess, isError } = useGetProducts();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await potentesApi.get<{
        data: { id: string; name: string }[];
      }>("/categories");
      return response.data.data;
    },
  });

  if (isError) {
    return <Text c="red">Error: {error.message}</Text>;
  }

  if (isSuccess) {
    const visible = products.data.filter(
      (product) =>
        product.status === "active" &&
        (!categoryId || product.categoryId === categoryId)
    );
    return (
      <Container py="4rem" fluid>
        <Stack gap="lg" align="center">
          <Title order={2} size="3rem" fw={900} tt="uppercase">
            Nuestros Productos
          </Title>
          <Text>
            Descubre nuestra colección de ropa urbana, diseñada para personas
            que buscan un estilo único y auténtico.
          </Text>
          <Select
            placeholder="Todas las categorías"
            clearable
            data={(categories || []).map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            value={categoryId}
            onChange={setCategoryId}
            maw={320}
            w="100%"
          />
          <Box py="xl" w="100%">
            <Grid gutter="lg">
              {visible.map((product) => (
                <Grid.Col key={product.sku} span={{ base: 12, md: 6, lg: 4 }}>
                  <ProductCard product={product} />
                </Grid.Col>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>
    );
  }

  return (
    <Stack align="center" justify="center" py="xl">
      <Loader size="lg" color="green" />
      <Text>Cargando productos...</Text>
    </Stack>
  );
};

export { Products };
