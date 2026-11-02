import { potentesApi } from "../../../utils/api";

export interface UserStats {
  label: string;
  value: string;
  change: string;
}

export const getUserStats = async (): Promise<UserStats[]> => {
  const { data } = await potentesApi.get<UserStats[]>("/users/stats");
  return data;
};
