import { potentesApi } from "../../utils/api";

export type AdminOverview = {
  monthSales: number;
  monthRevenue: number;
  activeProducts: number;
  lowStock: number;
  dailyRevenue: { date: string; ingresos: number }[];
  topProducts: { name: string; quantity: number }[];
};

export const getAdminOverview = async () => {
  const { data } = await potentesApi.get<{ data: AdminOverview }>(
    "/admin/overview"
  );
  return data.data;
};
