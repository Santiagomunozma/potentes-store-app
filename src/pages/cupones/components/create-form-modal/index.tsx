import { Button, Group, Modal, Stack } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { TextInputField } from "../../../../components/inputs/text-input";
import { NumberInputField } from "../../../../components/inputs/number-input";
import { SelectField } from "../../../../components/inputs/select-input";
import { useCreateCoupons } from "./service";
import { useEffect } from "react";
import { DateInputField } from "../../../../components/inputs/date-input";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface CouponFormData {
  id?: string;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  status: string;
}

type CreateFormCouponsProps = {
  opened: boolean;
  close: () => void;
  defaultValues?: CouponFormData;
};

const CreateFormCouponModal = ({
  opened,
  close,
  defaultValues,
}: CreateFormCouponsProps) => {
  const { mutate: createCoupon, isPending } = useCreateCoupons();

  const methods = useForm<CouponFormData>({
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
        code: "",
        discount: 0,
        status: "active",
      });
    }
  }, [defaultValues, methods]);

  const onSubmit = (data: CouponFormData) => {
    createCoupon(data, {
      onSuccess: () => {
        close();
        methods.reset();
        queryClient.invalidateQueries({ queryKey: ["coupons"] });
        toast.success(
          `${isEditing ? "Cupón editado" : "Cupón creado"} correctamente`
        );
      },
      onError: () => {
        toast.error(
          `${isEditing ? "Error al editar cupón" : "Error al crear cupón"}`
        );
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`${isEditing ? "Editar cupón" : "Crear nuevo cupón"}`}
      centered
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack>
            <TextInputField
              control={methods.control}
              name="code"
              label="Código del cupón"
              placeholder="Ingrese el código"
              required
            />
            <NumberInputField
              control={methods.control}
              name="discount"
              label="Descuento (%)"
              placeholder="Ingrese el porcentaje de descuento"
              required
              min={1}
            />
            <DateInputField
              control={methods.control}
              name="startDate"
              label="Fecha de inicio"
              placeholder="Ingrese la fecha de inicio"
              required
            />
            <DateInputField
              control={methods.control}
              name="endDate"
              label="Fecha de fin"
              placeholder="Ingrese la fecha de fin"
              required
            />
            <SelectField
              control={methods.control}
              name="status"
              label="Estado"
              placeholder="Seleccione el estado"
              options={[
                { value: "active", label: "Activo" },
                { value: "inactive", label: "Inactivo" },
              ]}
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button loading={isPending} type="submit">
                {isEditing ? "Editar cupón" : "Crear cupón"}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { CreateFormCouponModal };
export type { CouponFormData };
