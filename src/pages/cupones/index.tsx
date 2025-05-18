import { Box, Button, Container, Group, Title } from "@mantine/core";
import { IconTicket } from "@tabler/icons-react";
import { CreateFormCouponModal } from "./components/create-form-modal";
import { useCouponStore } from "./store";
import { CouponsTable } from "./components/coupons-table";
import { CouponStats } from "./components/coupon-stats";

const CouponsManagementPage = () => {
  const { coupon, openFormModal, setOpenFormModal, setCoupon } =
    useCouponStore();

  return (
    <Box py="xl" px="md">
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de Cupones</Title>
          <Button
            leftSection={<IconTicket size={16} />}
            onClick={() => setOpenFormModal(true)}
          >
            Crear Cupón
          </Button>
        </Group>

        <CreateFormCouponModal
          opened={openFormModal}
          close={() => {
            setOpenFormModal(false);
            setCoupon(null);
          }}
          defaultValues={
            coupon
              ? {
                  id: coupon.id,
                  code: coupon.code,
                  discount: coupon.discount,
                  status: coupon.status,
                  startDate: coupon.startDate,
                  endDate: coupon.endDate,
                }
              : undefined
          }
        />

        <CouponStats />

        <CouponsTable />
      </Container>
    </Box>
  );
};

export { CouponsManagementPage };
