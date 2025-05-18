import { Button, Group, Modal, Stack } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { TextInputField } from "../../../../components/inputs/text-input";
import { useCreateColors } from "./service";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface colorFormData {
  id?: string;
  color: string;
}

type CreateFormColorsProps = {
  opened: boolean;
  close: () => void;
  defaultValues?: colorFormData;
};

const CreateFormColorModal = ({
  opened,
  close,
  defaultValues,
}: CreateFormColorsProps) => {
  const isEditing = !!defaultValues;

  const queryClient = useQueryClient();

  const { mutate: createColor, isPending } = useCreateColors();

  const methods = useForm<colorFormData>({
    defaultValues: {
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    } else {
      methods.reset({
        color: "",
      });
    }
  }, [defaultValues, methods]);

  const onSubmit = (data: colorFormData) => {
    createColor(data, {
      onSuccess: () => {
        close();
        methods.reset();
        queryClient.invalidateQueries({
          queryKey: ["colors"],
        });

        toast.success(
          `Color ${isEditing ? "editado" : "creado"} correctamente`
        );
      },
      onError: () => {
        toast.error("Error al crear el color");
      },
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={isEditing ? "Editar color" : "Crear color"}
      centered
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack>
            <TextInputField
              control={methods.control}
              name="color"
              label="Color"
              placeholder="Ingrese el color"
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button loading={isPending} type="submit">
                {isEditing ? "Editar color" : "Crear color"}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Modal>
  );
};

export { CreateFormColorModal };
export type { colorFormData };
