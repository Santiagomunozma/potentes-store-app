import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import ProductCard from "../../../components/product-card";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useGetProducts } from "../../products-management/components/products-table/service";

const Products = () => {
  const { data: products } = useGetProducts();

  return (
    <Container id="products" py="4rem" fluid>
      <Stack gap="lg" align="center">
        <Title order={2} size="3rem" fw={900} tt="uppercase">
          Nuestros Productos
        </Title>
        <Text>
          Descubre nuestra colección de ropa urbana, diseñada para personas que
          buscan un estilo único y auténtico.
        </Text>
        <Box py="xl" w="100%">
          <Grid gutter="lg">
            {products?.data.map((product) => (
              <Grid.Col key={product.sku} span={{ base: 12, md: 6, lg: 4 }}>
                <ProductCard product={product} />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
        <Button
          component={Link}
          href="/products"
          variant="filled"
          rightSection={<IconArrowRight size={16} />}
        >
          Ver más
        </Button>
      </Stack>
    </Container>
  );
};

export { Products };
