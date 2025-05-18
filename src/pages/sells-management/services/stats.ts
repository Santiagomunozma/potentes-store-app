import { potentesApi } from "../../../utils/api";

export interface SellStats {
  label: string;
  value: string;
  change: string;
}

export const getSellStats = async (): Promise<SellStats[]> => {
  const { data } = await potentesApi.get<SellStats[]>("/sells/stats");
  return data;
};
