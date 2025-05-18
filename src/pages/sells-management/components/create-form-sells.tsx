import { Button, Group, Modal, Stack } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { NumberInputField } from "../../../components/inputs/number-input";
import { SelectField } from "../../../components/inputs/select-input";
import { TextInputField } from "../../../components/inputs/text-input";

interface SellFormData {
  name: string;
  stock: number;
  totalAmount: number;
  status: string;
}

type CreateFormSellsProps = {
  opened: boolean;
  close: () => void;
};

const CreateFormModal = ({ opened, close }: CreateFormSellsProps) => {
  const methods = useForm<SellFormData>({
    defaultValues: {
      name: "",
      stock: 0,
      totalAmount: 0,
      status: "pending",
    },
  });

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Registrar nueva venta"
      centered
    >
      <FormProvider {...methods}>
        <Stack>
          <TextInputField
            control={methods.control}
            name="name"
            label="Nombre del cliente"
            placeholder="Ingrese el nombre del cliente"
            required
          />
          <NumberInputField
            control={methods.control}
            name="stock"
            label="Cantidad de productos"
            placeholder="Ingrese la cantidad"
            required
          />
          <NumberInputField
            control={methods.control}
            name="totalAmount"
            label="Monto total"
            placeholder="Ingrese el monto"
            required
          />
          <SelectField
            control={methods.control}
            name="status"
            label="Estado"
            placeholder="Seleccione el estado"
            options={[
              { value: "pending", label: "Pendiente" },
              { value: "complete", label: "Completado" },
            ]}
            required
            clearable
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit">Agregar venta</Button>
          </Group>
        </Stack>
      </FormProvider>
    </Modal>
  );
};

export { CreateFormModal };
