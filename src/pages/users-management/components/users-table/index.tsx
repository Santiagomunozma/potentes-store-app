import {
  Avatar,
  Button,
  Card,
  Group,
  Loader,
  Menu,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useGetUsers } from "./service";
import { useUserStore } from "../../store";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "../create-form-modal/service";
import { User } from "../../../../types/users";
import toast from "react-hot-toast";

const Userstable = () => {
  const { data: users, error, isSuccess, isError } = useGetUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const queryClient = useQueryClient();

  const { setUser, setOpenFormModal } = useUserStore();

  const handleOpenEdit = (user: User) => {
    setUser(user);
    setOpenFormModal(true);
  };

  const handleDelete = (id: string) => {
    deleteUser(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success("Usuario eliminado correctamente");
      },
      onError: () => {
        toast.error("Error al eliminar usuario");
      },
    });
  };

  if (isError) {
    return <Text c="red">Error: {error.message}</Text>;
  }

  if (isSuccess) {
    return (
      <Card withBorder shadow="none" bg="white">
        <Table highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Compras</Table.Th>
              <Table.Th>Ventas</Table.Th>
              <Table.Th>Tipo de usuario</Table.Th>
              <Table.Th align="right"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.data.map((user) => (
              <Table.Tr key={user.email}>
                <Table.Td>
                  <Group>
                    <Avatar src={""} radius="xl" />
                    <Text>{user.firstName + " " + user.lastName}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{""}</Table.Td>
                <Table.Td>{""}</Table.Td>
                <Table.Td>{user.userType}</Table.Td>
                <Table.Td align="right">
                  <Menu shadow="md" position="bottom-end" withArrow>
                    <Menu.Target>
                      <Button variant="subtle" size="xs" px={6}>
                        <IconDotsVertical size={16} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => handleOpenEdit(user)}>
                        Editar
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        onClick={() => handleDelete(user.id ?? "")}
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
    );
  }
  return (
    <Stack align="center" justify="center" py="xl">
      <Loader size="lg" color="green" />
      <Text>Cargando productos...</Text>
    </Stack>
  );
};

export { Userstable };
