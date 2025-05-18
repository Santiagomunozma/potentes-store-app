import { ReactNode, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import useAuthStore from "../store/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes?: string[];
  allowedEmployeeTypes?: string[];
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export const RoleProtectedRoute = ({
  children,
  allowedUserTypes = [],
  allowedEmployeeTypes = [],
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    } else if (user) {
      // Si el usuario es de tipo Employee, verifica el employeeType
      if (user.userType === "Employee") {
        if (
          allowedEmployeeTypes.length > 0 &&
          user.employee &&
          !allowedEmployeeTypes.includes(user.employee.employeeType)
        ) {
          navigate({ to: "/" });
        }
      }
      // Si hay tipos de usuario permitidos y el usuario no está en la lista
      else if (
        allowedUserTypes.length > 0 &&
        !allowedUserTypes.includes(user.userType)
      ) {
        navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, user, allowedUserTypes, allowedEmployeeTypes, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (user) {
    // Si el usuario es empleado, verifica el tipo de empleado
    if (user.userType === "Employee") {
      if (
        allowedEmployeeTypes.length > 0 &&
        user.employee &&
        !allowedEmployeeTypes.includes(user.employee.employeeType)
      ) {
        return null;
      }
    }
    // Si hay tipos de usuario permitidos y el usuario no está en la lista
    else if (
      allowedUserTypes.length > 0 &&
      !allowedUserTypes.includes(user.userType)
    ) {
      return null;
    }
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }: ProtectedRouteProps) => {
  return (
    <RoleProtectedRoute
      allowedUserTypes={["Employee"]}
      allowedEmployeeTypes={["Admin"]}
    >
      {children}
    </RoleProtectedRoute>
  );
};

export const EmployeeRoute = ({ children }: ProtectedRouteProps) => {
  return (
    <RoleProtectedRoute
      allowedUserTypes={["Employee"]}
      allowedEmployeeTypes={["Admin", "Employee"]}
    >
      {children}
    </RoleProtectedRoute>
  );
};
