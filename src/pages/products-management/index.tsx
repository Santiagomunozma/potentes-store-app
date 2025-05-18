import { Box, Button, Container, Group, Title } from "@mantine/core";
import { CreateFormModal } from "./components/create-form-modal";
import { ProductsTable } from "./components/products-table";
import { ProductStats } from "./components/product-stats";
import { useProductStore } from "./store";
import { IconPlus } from "@tabler/icons-react";

const ProductsManagementPage = () => {
  const { product, openFormModal, setOpenFormModal, setProduct } =
    useProductStore();

  return (
    <Box py="xl" px="md">
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de productos</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setOpenFormModal(true)}
          >
            Agregar producto
          </Button>
        </Group>

        <CreateFormModal
          opened={openFormModal}
          close={() => {
            setOpenFormModal(false);
            setProduct(null);
          }}
          defaultValues={
            product
              ? {
                  id: product.id,
                  name: product.name,
                  careInstructions: product.careInstructions,
                  description: product.description,
                  imageUrl: product.imageUrl,
                  sku: product.sku,
                  price: product.price,
                  status: product.status,
                  inventory: product.inventories
                    ? product.inventories.map((inventory) => ({
                        color: inventory.color.id,
                        size: inventory.size.id,
                        stock: inventory.quantity,
                      }))
                    : [],
                }
              : undefined
          }
        />

        <ProductStats />

        <ProductsTable />
      </Container>
    </Box>
  );
};

export { ProductsManagementPage };
