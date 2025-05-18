type User = {
  id?: string;
  userType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  identificationType: string;
  identificationNumber: string;
  createdAt: Date;
  updatedAt: Date;

  customer?: Customer;
  employee?: Employee;
};

type Customer = {
  id?: string;
  userId?: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

type Employee = {
  id?: string;
  userId?: string;
  salary?: number;
  employeeType: string;
  createdAt: Date;
  updatedAt: Date;
};

export type { User, Customer, Employee };
