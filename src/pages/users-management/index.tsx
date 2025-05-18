import {
  Box,
  Button,
  Container,
  Group,
  Tabs,
  TextInput,
  Title,
} from "@mantine/core";
import { Userstable } from "./components/users-table";
import { StatsCards } from "../../components/stats-cards";
import { CreateFormModal } from "./components/create-form-modal";
import { useUserStore } from "./store";

const stats = [
  {
    label: "Usuarios activos",
    value: "1,248",
    change: "+12.3%",
  },
  {
    label: "Usuarios nuevos",
    value: "156",
    change: "+8.7%",
  },
  {
    label: "Usuarios inactivos",
    value: "324",
    change: "-5.2%",
  },
  {
    label: "Total usuarios",
    value: "1,572",
    change: "+9.4%",
  },
];

const UsersManagementPage = () => {
  const { user, openFormModal, setOpenFormModal, setUser } = useUserStore();

  return (
    <Box py="xl" px="md">
      <Container size="xl">
        <Group justify="space-between" mb="xl">
          <Title order={2}>Gestión de usuarios</Title>
          <Button onClick={() => setOpenFormModal(true)}>
            Agregar usuario
          </Button>
        </Group>

        <CreateFormModal
          opened={openFormModal}
          close={() => {
            setOpenFormModal(false);
            setUser(null);
          }}
          defaultValues={
            user
              ? {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phone: user.phone,
                  password: user.password,
                  identificationType: user.identificationType,
                  identificationNumber: user.identificationNumber,
                  role: user.userType,
                  customer: {
                    address: user.customer?.address,
                  },
                  employee: {
                    employeeType: user.employee?.employeeType,
                    salary: user.employee?.salary,
                  },
                }
              : undefined
          }
        />

        <StatsCards stats={stats} />

        <Group justify="space-between" mb="md">
          <Tabs defaultValue="clients">
            <Tabs.List>
              <Tabs.Tab value="all">Todos</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Group>
            <TextInput placeholder="Buscar usuario" />
          </Group>
        </Group>
        <Userstable />
      </Container>
    </Box>
  );
};

export { UsersManagementPage };
