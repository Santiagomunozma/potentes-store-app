import { Button, Group, Modal, Stack } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateUser } from "./service";
import { SelectField } from "../../../../components/inputs/select-input";
import { TextInputField } from "../../../../components/inputs/text-input";
import { PasswordInputField } from "../../../../components/inputs/password-input";
import { useEffect } from "react";
import { NumberInputField } from "../../../../components/inputs/number-input";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface UserFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  identificationType: string;
  identificationNumber: string;
  role: string;
  customer?: {
    address?: string;
  };
  employee?: {
    employeeType?: string;
    salary?: number;
  };
}

type CreateFormUsersProps = {
  opened: boolean;
  close: () => void;
  defaultValues?: UserFormData;
};

const CreateFormModal = ({
  opened,
  close,
  defaultValues,
}: CreateFormUsersProps) => {
  const { mutate: createUser, isPending } = useCreateUser();

  const methods = useForm<UserFormData>({
    defaultValues: {
      ...defaultValues,
    },
  });

  const isEditing = !!defaultValues;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    } else {
      methods.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        identificationType: "",
        identificationNumber: "",
      });
    }
  }, [defaultValues, methods]);

  const userType = methods.watch("role");

  const onSubmit = (data: UserFormData) => {
    console.log("data", data);
    createUser(data, {
      onSuccess: () => {
        close();
        methods.reset();
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast.success(
          `${isEditing ? "Usuario editado" : "Usuario creado"} correctamente`
        );
      },
      onError: () => {
        toast.error(
          `${isEditing ? "Error al editar usuario" : "Error al crear usuario"}`
        );
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`${isEditing ? "Editar usuario" : "Crear nuevo usuario"}`}
      centered
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack>
            <SelectField
              control={methods.control}
              name="role"
              label="Tipo de Usuario"
              placeholder="Seleccione el tipo de usuario"
              options={[
                { value: "Customer", label: "Cliente" },
                { value: "Employee", label: "Empleado" },
              ]}
            />

            <TextInputField
              control={methods.control}
              name="firstName"
              label="Nombre"
              placeholder="Ingrese el nombre"
              required
            />

            <TextInputField
              control={methods.control}
              name="lastName"
              label="Apellido"
              placeholder="Ingrese el apellido"
              required
            />

            <TextInputField
              control={methods.control}
              name="email"
              label="Email"
              placeholder="Ingrese el email"
              required
            />

            <TextInputField
              control={methods.control}
              name="phone"
              label="Teléfono"
              placeholder="Ingrese el teléfono"
              required
            />

            {!defaultValues && (
              <PasswordInputField
                control={methods.control}
                name="password"
                label="Contraseña"
                placeholder="Ingrese la contraseña"
                required
              />
            )}

            <SelectField
              control={methods.control}
              name="identificationType"
              label="Tipo de Identificación"
              placeholder="Ingrese el tipo de identificación"
              required
              options={[
                { value: "CC", label: "Cédula de Ciudadanía" },
                { value: "CE", label: "Cédula de Extranjería" },
                { value: "PP", label: "Pasaporte" },
              ]}
            />

            <TextInputField
              control={methods.control}
              name="identificationNumber"
              label="Número de Identificación"
              placeholder="Ingrese el número de identificación"
              required
            />

            {userType === "Customer" && (
              <TextInputField
                control={methods.control}
                name="customer.address"
                label="Dirección"
                placeholder="Ingrese la dirección"
                required
              />
            )}

            {userType === "Employee" && (
              <>
                <NumberInputField
                  control={methods.control}
                  name="employee.salary"
                  label="Salario"
                  placeholder="Ingrese el salario"
                  required
                />

                <SelectField
                  control={methods.control}
                  name="employee.employeeType"
                  label="Tipo de Empleado"
                  placeholder="Seleccione el tipo de empleado"
                  required
                  options={[
                    { value: "Employee", label: "Empleado" },
                    { value: "Admin", label: "Administrador" },
                  ]}
                />
              </>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button loading={isPending} type="submit">
                {isEditing ? "Editar usuario" : "Crear usuario"}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { CreateFormModal };
export type { UserFormData };
