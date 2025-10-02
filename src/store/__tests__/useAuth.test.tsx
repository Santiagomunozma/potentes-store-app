/**
 * @jest-environment jsdom
 */
import { renderHook } from "../../test/test-utils";
import { act } from "react";
import useAuthStore from "../useAuth";
import { User } from "../../types/users";

// Mock user data
const mockCustomerUser: User = {
  id: "1",
  firstName: "Cliente",
  lastName: "Test",
  email: "cliente@test.com",
  phone: "1234567890",
  password: "password123",
  identificationType: "CC",
  identificationNumber: "12345678",
  userType: "Customer",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

const mockAdminUser: User = {
  id: "2",
  firstName: "Admin",
  lastName: "Test",
  email: "admin@test.com",
  phone: "1234567890",
  password: "password123",
  identificationType: "CC",
  identificationNumber: "87654321",
  userType: "Employee",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  employee: {
    id: "1",
    userId: "2",
    salary: 50000,
    employeeType: "Admin",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
};

const mockEmployeeUser: User = {
  id: "3",
  firstName: "Empleado",
  lastName: "Test",
  email: "empleado@test.com",
  phone: "1234567890",
  password: "password123",
  identificationType: "CC",
  identificationNumber: "11223344",
  userType: "Employee",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  employee: {
    id: "2",
    userId: "3",
    salary: 30000,
    employeeType: "Sales",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  },
};

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  it("tiene el estado inicial correcto", () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it("establece correctamente un usuario cliente", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockCustomerUser);
    });

    expect(result.current.user).toEqual(mockCustomerUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it("establece correctamente un usuario administrador", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockAdminUser);
    });

    expect(result.current.user).toEqual(mockAdminUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
  });

  it("establece correctamente un empleado no administrador", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(mockEmployeeUser);
    });

    expect(result.current.user).toEqual(mockEmployeeUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it("cierra sesión correctamente", () => {
    const { result } = renderHook(() => useAuthStore());

    // Primero establecer un usuario
    act(() => {
      result.current.setUser(mockAdminUser);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);

    // Luego cerrar sesión
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it("maneja empleados sin información de employee", () => {
    const employeeWithoutDetails: User = {
      ...mockEmployeeUser,
      employee: undefined,
    };

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setUser(employeeWithoutDetails);
    });

    expect(result.current.user).toEqual(employeeWithoutDetails);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  it("persiste el estado entre múltiples renders", () => {
    const { result: result1 } = renderHook(() => useAuthStore());

    act(() => {
      result1.current.setUser(mockCustomerUser);
    });

    // Crear un nuevo hook y verificar que el estado persiste
    const { result: result2 } = renderHook(() => useAuthStore());

    expect(result2.current.user).toEqual(mockCustomerUser);
    expect(result2.current.isAuthenticated).toBe(true);
  });
});
