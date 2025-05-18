import { Button, Group, Modal, Stack } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateSize } from "./service";
import { TextInputField } from "../../../../components/inputs/text-input";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface SizeFormData {
  id?: string;
  size: string;
}

type CreateFormSizeModalProps = {
  opened: boolean;
  close: () => void;
  defaultValues?: SizeFormData;
};

const CreateFormSizeModal = ({
  opened,
  close,
  defaultValues,
}: CreateFormSizeModalProps) => {
  const { mutate: createSize, isPending } = useCreateSize();

  const methods = useForm<SizeFormData>({
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
        size: "",
      });
    }
  }, [defaultValues, methods]);

  const onSubmit = (data: SizeFormData) => {
    createSize(data, {
      onSuccess: () => {
        close();
        methods.reset();
        queryClient.invalidateQueries({ queryKey: ["sizes"] });
        toast.success(
          `${isEditing ? "Talla editada" : "Talla creada"} correctamente`
        );
      },
      onError: () => {
        toast.error(
          `${isEditing ? "Error al editar talla" : "Error al crear talla"}`
        );
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`${isEditing ? "Editar talla" : "Crear nueva talla"}`}
      centered
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack>
            <TextInputField
              control={methods.control}
              name="size"
              label="Talla"
              placeholder="Ingrese la talla"
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button loading={isPending} type="submit">
                {isEditing ? "Editar talla" : "Crear talla"}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { CreateFormSizeModal };
export type { SizeFormData };
