import { AppShell, NavLink } from "@mantine/core";
import {
  IconGauge,
  IconHanger,
  IconHome2,
  IconInfoCircle,
  IconShoppingCart,
  IconLogout,
  IconLogin,
  IconUserPlus,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import useAuthStore from "../../../store/useAuth";
import { AuthService } from "../../../services/auth.service";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isEmployee = user?.userType === "Employee";

  const handleLogout = () => {
    logout();
    AuthService.logout();
    navigate({ to: "/login" });
  };

  return (
    <AppShell.Navbar py="md" px={4}>
      {/* Public routes - visible to all users */}
      <NavLink
        component={Link}
        href="/"
        label="Inicio"
        leftSection={<IconHome2 stroke={1} />}
        variant="subtle"
      />

      <NavLink
        component={Link}
        href="/products"
        label="Productos"
        leftSection={<IconHanger stroke={1} />}
        variant="subtle"
      />

      <NavLink
        component={Link}
        href="/about"
        label="Nosotros"
        leftSection={<IconInfoCircle stroke={1} />}
        variant="subtle"
        color="primary"
      />

      {/* Carrito - visible para todos los usuarios */}
      <NavLink
        component={Link}
        href="/cart"
        label="Carrito"
        leftSection={<IconShoppingCart stroke={1} />}
        variant="subtle"
      />

      {/* Admin and Employee routes */}
      {isAuthenticated && isEmployee && (
        <NavLink
          component={Link}
          href="#"
          label="Gestión"
          leftSection={<IconGauge stroke={1} />}
          childrenOffset={28}
          variant="subtle"
          color="primary"
        >
          {/* Solo los admin pueden ver gestión de usuarios */}
          {isAdmin && (
            <NavLink component={Link} label="Usuarios" href="/users" />
          )}
          <NavLink component={Link} label="Panel" href="/admin" />
          {/* Ambos tipos de empleados pueden ver estas secciones */}
          <NavLink
            component={Link}
            label="Productos"
            href="/products-management"
          />
          <NavLink component={Link} label="Ventas" href="/sells-management" />
          <NavLink component={Link} label="Cupones" href="/coupons" />
          <NavLink component={Link} label="Colores" href="/colors" />
          <NavLink component={Link} label="Categorías" href="/categories" />
          <NavLink component={Link} label="Tallas" href="/sizes" />
        </NavLink>
      )}

      {/* Authentication links */}
      {isAuthenticated ? (
        <>
          <NavLink
            component={Link}
            label="Cerrar Sesión"
            leftSection={<IconLogout stroke={1} />}
            variant="subtle"
            onClick={handleLogout}
          />
        </>
      ) : (
        <>
          <NavLink
            component={Link}
            href="/login"
            label="Iniciar Sesión"
            leftSection={<IconLogin stroke={1} />}
            variant="subtle"
          />
          <NavLink
            component={Link}
            href="/register"
            label="Registrarse"
            leftSection={<IconUserPlus stroke={1} />}
            variant="subtle"
          />
        </>
      )}
    </AppShell.Navbar>
  );
};

export { Navbar };
