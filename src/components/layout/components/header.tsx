import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Group,
  Indicator,
  Menu,
  Stack,
  Title,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconUser,
  IconLogout,
  IconHistory,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import useCartStore from "../../../store/useCart";
import useAuthStore from "../../../store/useAuth";

type HeaderProps = {
  opened: boolean;
  toggle: () => void;
};

const Header = ({ opened, toggle }: HeaderProps) => {
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const { cart } = useCartStore();

  const isEmployee = user?.userType === "Employee";

  const handleNavigation = (to: string) => {
    navigate({ to });
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
          color="primary"
        />
        <Stack gap={0} align="center">
          <Title order={6} fw={400}>
            LOS
          </Title>
          <Title order={4} lh={1}>
            P O T E N T E S
          </Title>
        </Stack>
        <Group justify="center" style={{ flex: 1 }} visibleFrom="sm">
          <Group ml="xl" gap={0}>
            <Button
              variant="subtle"
              fw={400}
              onClick={() => handleNavigation("/")}
            >
              Inicio
            </Button>
            <Button
              variant="subtle"
              fw={400}
              onClick={() => handleNavigation("/products")}
            >
              Productos
            </Button>
            <Button
              variant="subtle"
              fw={400}
              onClick={() => handleNavigation("/about")}
            >
              Nosotros
            </Button>
            {isEmployee && (
              <Menu shadow="md" position="bottom-end" withArrow>
                <Menu.Target>
                  <Button variant="subtle" fw={400}>
                    Gestión
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {isAdmin && (
                    <Menu.Item onClick={() => handleNavigation("/users")}>
                      Usuarios
                    </Menu.Item>
                  )}
                  <Menu.Item
                    onClick={() => handleNavigation("/products-management")}
                  >
                    Productos
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => handleNavigation("/sells-management")}
                  >
                    Ventas
                  </Menu.Item>
                  <Menu.Item onClick={() => handleNavigation("/coupons")}>
                    Cupones
                  </Menu.Item>
                  <Menu.Item onClick={() => handleNavigation("/sizes")}>
                    Tallas
                  </Menu.Item>
                  <Menu.Item onClick={() => handleNavigation("/colors")}>
                    Colores
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
        <Group>
          {isAuthenticated ? (
            <Menu shadow="md" position="bottom-end" withArrow>
              <Menu.Target>
                <Button variant="subtle" fw={400}>
                  Hola {user?.firstName} {user?.lastName}!
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {!isAdmin && (
                  <Menu.Item
                    leftSection={<IconHistory size={16} />}
                    onClick={() => handleNavigation("/purchase-history")}
                  >
                    Mis compras
                  </Menu.Item>
                )}
                <Menu.Item
                  leftSection={<IconLogout size={16} />}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <ActionIcon
              variant="subtle"
              size="lg"
              radius="xl"
              onClick={() => handleNavigation("/login")}
            >
              <IconUser stroke={1} />
            </ActionIcon>
          )}
          <Indicator
            label={cart.length}
            size={20}
            color="primary"
            disabled={cart.length === 0}
          >
            <ActionIcon
              variant="subtle"
              size="lg"
              radius="xl"
              onClick={() => handleNavigation("/cart")}
            >
              <IconShoppingCart stroke={1} />
            </ActionIcon>
          </Indicator>
        </Group>
      </Group>
    </AppShell.Header>
  );
};

export { Header };
