import {
  ActionIcon,
  Button,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@mantine/core";

import { useGetSizes } from "../../../../sizes/components/sizes-table/service";
import { SelectField } from "../../../../../components/inputs/select-input";
import { Form, useForm, useFormContext } from "react-hook-form";
import { ProductFormData } from "..";
import { NumberInputField } from "../../../../../components/inputs/number-input";
import { IconTrash } from "@tabler/icons-react";
import { useGetColors } from "../../../../colors/components/colors-table/service";
import { Color } from "../../../../../types/colors";
import { Size } from "../../../../../types/sizes";

type Inventory = {
  color: string;
  size: string;
  stock: number;
};

const InventoryManager = () => {
  const methods = useForm<Inventory>();
  const { watch, setValue } = useFormContext<ProductFormData>();

  // Aseguramos que inventory siempre sea un array
  const inventory = watch("inventory") || [];

  const { data: colors, isLoading } = useGetColors();
  const { data: sizes, isLoading: isLoadingSizes } = useGetSizes();

  const handleAddInventory = (data: Inventory) => {
    // Creamos un nuevo array para evitar mutar el existente
    const updatedInventory = [...inventory, data];
    setValue("inventory", updatedInventory);

    // Reiniciamos el formulario
    methods.reset({
      color: undefined,
      size: undefined,
      stock: undefined,
    });
  };

  return (
    <Stack>
      <Form {...methods}>
        <Stack>
          <SimpleGrid cols={3}>
            <SelectField
              control={methods.control}
              name="color"
              label="Color"
              disabled={isLoading}
              options={
                colors?.data?.map((color: Color) => ({
                  value: color.id,
                  label: color.color,
                })) || []
              }
              required
            />
            <SelectField
              control={methods.control}
              name="size"
              label="Talla"
              disabled={isLoadingSizes}
              options={
                sizes?.data?.map((size: Size) => ({
                  value: size.id,
                  label: size.size,
                })) || []
              }
              required
            />
            <NumberInputField
              control={methods.control}
              name="stock"
              label="Stock"
              placeholder="Ingrese el stock"
              min={1}
              required
            />
          </SimpleGrid>
          <Button onClick={methods.handleSubmit(handleAddInventory)}>
            Agregar
          </Button>
        </Stack>
      </Form>
      {inventory.length > 0 && (
        <div className="mt-4">
          <Text fw={700} mb="xs">
            Inventario
          </Text>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Color</Table.Th>
                <Table.Th>Talla</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {inventory.map((item, index) => (
                <Table.Tr key={`${item.color}-${item.size}-${index}`}>
                  <Table.Td>
                    {colors?.data?.find((c: Color) => c.id === item.color)
                      ?.color || item.color}
                  </Table.Td>
                  <Table.Td>
                    {sizes?.data?.find((s: Size) => s.id === item.size)?.size ||
                      item.size}
                  </Table.Td>
                  <Table.Td>{item.stock}</Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      onClick={() => {
                        const newInventory = [...inventory];
                        newInventory.splice(index, 1);
                        setValue("inventory", newInventory);
                      }}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      )}
    </Stack>
  );
};

export default InventoryManager;
