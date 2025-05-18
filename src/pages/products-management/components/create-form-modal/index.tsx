import { Button, Group, Modal, Stack } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { TextInputField } from "../../../../components/inputs/text-input";
import { NumberInputField } from "../../../../components/inputs/number-input";
import { SelectField } from "../../../../components/inputs/select-input";
import { useCreateProduct } from "./service";
import InventoryManager from "./components/inventory-manager";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ProductFormData {
  id?: string;
  name: string;
  sku: string;
  imageUrl: string;
  description: string;
  careInstructions: string;
  price: number;
  status: string;
  inventory: {
    color: string;
    size: string;
    stock: number;
  }[];
}

type CreateFormModalProps = {
  opened: boolean;
  close: () => void;
  defaultValues?: ProductFormData;
};

const CreateFormModal = ({
  opened,
  close,
  defaultValues,
}: CreateFormModalProps) => {
  const { mutate: createProduct, isPending } = useCreateProduct();

  const methods = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      sku: "",
      imageUrl: "",
      description: "",
      careInstructions: "",
      price: 0,
      status: "active",
      inventory: [],
    },
  });

  const isEditing = !!defaultValues;
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("defaultValues", defaultValues);
    if (defaultValues) {
      methods.reset({
        ...defaultValues,
        inventory: defaultValues.inventory.map((inventory) => ({
          color: inventory.color,
          size: inventory.size,
          stock: inventory.stock,
        })),
      });
    } else {
      methods.reset({
        name: "",
        sku: "",
        imageUrl: "",
      });
    }
  }, [defaultValues, methods]);

  const onSubmit = (data: ProductFormData) => {
    createProduct(data, {
      onSuccess: () => {
        close();
        methods.reset();
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success(
          `${isEditing ? "Producto editado" : "Producto creado"} correctamente`
        );
      },
      onError: () => {
        toast.error(
          `${isEditing ? "Error al editar producto" : "Error al crear producto"}`
        );
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`${isEditing ? "Editar producto" : "Agregar nuevo producto"}`}
      centered
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack>
            <TextInputField
              control={methods.control}
              name="name"
              label="Nombre del producto"
              placeholder="Ingrese el nombre"
              required
            />
            <TextInputField
              control={methods.control}
              name="sku"
              label="SKU"
              placeholder="Ingrese el SKU"
              required
            />
            <TextInputField
              control={methods.control}
              name="imageUrl"
              label="Imagen"
              placeholder="Ingrese la URL de la imagen"
              required
              pattern="https?://.+"
            />
            <InventoryManager />
            <NumberInputField
              control={methods.control}
              name="price"
              label="Precio"
              placeholder="Ingrese el precio"
              required
              min={1}
            />
            <TextInputField
              control={methods.control}
              name="description"
              label="Descripcion"
              placeholder="Ingrese la descripcion"
              required
            />
            <TextInputField
              control={methods.control}
              name="careInstructions"
              label="Instrucciones de cuidado"
              placeholder="Ingrese las instrucciones de cuidado"
              required
            />
            <SelectField
              name="status"
              control={methods.control}
              label="Estado"
              placeholder="Seleccione el estado"
              options={[
                { value: "active", label: "Activo" },
                { value: "inactive", label: "Inactivo" },
              ]}
              required
              clearable
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button loading={isPending} type="submit">
                {isEditing ? "Editar producto" : "Agregar producto"}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { CreateFormModal };
export type { ProductFormData };
