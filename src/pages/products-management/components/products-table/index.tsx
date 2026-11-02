import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Group,
  Loader,
  Menu,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useGetProducts } from "./service";
import { useQueryClient } from "@tanstack/react-query";
import { useProductStore } from "../../store";
import { Product } from "../../../../types/product";
import { useDeleteProduct } from "../create-form-modal/service";
import toast from "react-hot-toast";
import { ProductImage } from "../../../../components/product-image";

const ProductsTable = () => {
  const { data: products, error, isSuccess, isError } = useGetProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const queryClient = useQueryClient();

  const { setProduct, setOpenFormModal } = useProductStore();
  const [query, setQuery] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);

  const handleOpenEdit = (product: Product) => {
    setProduct(product);
    setOpenFormModal(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Producto eliminado correctamente");
      },
      onError: () => {
        toast.error("Error al eliminar producto");
      },
    });
  };

  if (isError) {
    return <Text c="red">Error: {error.message}</Text>;
  }

  if (isSuccess) {
    const rows = products.data.filter((product) => {
      const haystack = `${product.name} ${product.sku}`.toLowerCase();
      const matchesQuery = haystack.includes(query.trim().toLowerCase());
      const low = product.inventories?.some((item) => item.quantity <= 5);
      return matchesQuery && (!onlyLow || low);
    });
    return (
      <Stack>
        <Group>
          <TextInput
            placeholder="Buscar por nombre o SKU"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Checkbox
            label="Solo stock bajo"
            checked={onlyLow}
            onChange={(event) => setOnlyLow(event.currentTarget.checked)}
          />
        </Group>
      <Card withBorder shadow="none" bg="white">
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Producto</Table.Th>
              <Table.Th>SKU</Table.Th>
              <Table.Th>Categoría</Table.Th>
              <Table.Th>Precio</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th align="right"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((product) => (
              <Table.Tr key={product.sku}>
                <Table.Td>
                  <Group>
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.name}
                      w={40}
                      h={40}
                      radius="sm"
                    />
                    <Text>{product.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{product.sku}</Table.Td>
                <Table.Td>{product.category?.name || "Sin categoría"}</Table.Td>
                <Table.Td>{product.price}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Badge color={product.status === "active" ? "green" : "gray"}>
                      {product.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                    {product.inventories?.some((item) => item.quantity <= 5) && (
                      <Badge color="orange">Stock bajo</Badge>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td align="right">
                  <Menu shadow="md" position="bottom-end" withArrow>
                    <Menu.Target>
                      <Button variant="subtle" size="xs" px={6}>
                        <IconDotsVertical size={16} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => handleOpenEdit(product)}>
                        Editar
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                      >
                        Eliminar
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
      </Stack>
    );
  }

  return (
    <Stack align="center" justify="center" py="xl">
      <Loader size="lg" color="green" />
      <Text>Cargando productos...</Text>
    </Stack>
  );
};

export { ProductsTable };
