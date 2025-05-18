import { potentesApi } from "../../../utils/api";

export interface ProductStats {
  label: string;
  value: string;
  change: string;
}

export const getProductStats = async (): Promise<ProductStats[]> => {
  const { data } = await potentesApi.get<ProductStats[]>("/products/stats");
  return data;
};
