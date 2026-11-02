import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import toast from "react-hot-toast";
import { potentesApi } from "../../utils/api";

type Category = { id: string; name: string };

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await potentesApi.get<{ data: Category[] }>(
        "/categories"
      );
      return response.data.data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        await potentesApi.put(`/categories/${editing.id}`, { name });
        return;
      }
      await potentesApi.post("/categories", { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(editing ? "Categoría actualizada" : "Categoría creada");
      setOpened(false);
      setName("");
      setEditing(null);
    },
    onError: () => toast.error("No se pudo guardar la categoría"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await potentesApi.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada");
    },
    onError: () =>
      toast.error("No se pudo eliminar. Puede tener productos asignados."),
  });

  return (
    <Box py="xl" px="md">
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <Title order={2}>Categorías</Title>
          <Button
            onClick={() => {
              setEditing(null);
              setName("");
              setOpened(true);
            }}
          >
            Nueva categoría
          </Button>
        </Group>
        {isLoading ? (
          <Text>Cargando categorías...</Text>
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(data || []).map((category) => (
                <Table.Tr key={category.id}>
                  <Table.Td>{category.name}</Table.Td>
                  <Table.Td>
                    <Group justify="flex-end">
                      <Button
                        size="xs"
                        variant="default"
                        onClick={() => {
                          setEditing(category);
                          setName(category.name);
                          setOpened(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        variant="light"
                        onClick={() => remove.mutate(category.id)}
                      >
                        Eliminar
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title={editing ? "Editar categoría" : "Nueva categoría"}
          centered
        >
          <Stack>
            <TextInput
              label="Nombre"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <Button loading={save.isPending} onClick={() => save.mutate()}>
              Guardar
            </Button>
          </Stack>
        </Modal>
      </Container>
    </Box>
  );
};

export { CategoriesPage };
