import {
  Badge,
  Button,
  Card,
  Loader,
  Menu,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import { useGetCoupons } from "./service";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCoupon } from "../create-form-modal/service";
import { Coupon } from "../../../../types/coupons";
import { useCouponStore } from "../../store";
import toast from "react-hot-toast";

const CouponsTable = () => {
  const { data: coupons, error, isSuccess, isError } = useGetCoupons();
  const { mutate: deleteCoupon, isPending: isDeleting } = useDeleteCoupon();
  const queryClient = useQueryClient();

  const { setCoupon, setOpenFormModal } = useCouponStore();

  const handleOpenEdit = (coupon: Coupon) => {
    setCoupon(coupon);
    setOpenFormModal(true);
  };

  const handleDelete = (id: string) => {
    deleteCoupon(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["coupons"] });
        toast.success("Cupón eliminado correctamente");
      },
      onError: () => {
        toast.error("Error al eliminar cupón");
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
              <Table.Th>ID</Table.Th>
              <Table.Th>Código</Table.Th>
              <Table.Th>Descuento</Table.Th>
              <Table.Th>Fecha inicio</Table.Th>
              <Table.Th>Fecha fin</Table.Th>
              <Table.Th>Usos</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th align="right"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {coupons.data.map((coupon: Coupon) => (
              <Table.Tr key={coupon.id}>
                <Table.Td>{coupon.id}</Table.Td>
                <Table.Td>
                  <Text fw={500}>{coupon.code}</Text>
                </Table.Td>
                <Table.Td>{coupon.discount}</Table.Td>
                <Table.Td>
                  {dayjs(coupon.startDate).format("DD/MM/YYYY")}
                </Table.Td>
                <Table.Td>
                  {dayjs(coupon.endDate).format("DD/MM/YYYY")}
                </Table.Td>
                <Table.Td>{0}</Table.Td>
                <Table.Td>
                  <Badge color={coupon.status === "active" ? "green" : "gray"}>
                    {coupon.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </Table.Td>
                <Table.Td></Table.Td>
                <Table.Td></Table.Td>
                <Table.Td align="right">
                  <Menu shadow="md" position="bottom-end" withArrow>
                    <Menu.Target>
                      <Button variant="subtle" size="xs" px={6}>
                        <IconDotsVertical size={16} />
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => handleOpenEdit(coupon)}>
                        Editar
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        onClick={() => handleDelete(coupon.id || "")}
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

export { CouponsTable };
