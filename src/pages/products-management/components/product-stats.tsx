import { useEffect, useState } from "react";
import { StatsCards } from "../../../components/stats-cards";
import type { ProductStats as ProductStatsType } from "../services/stats";
import { getProductStats } from "../services/stats";

export const ProductStats = () => {
  const [stats, setStats] = useState<ProductStatsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getProductStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching product stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return null; // You might want to add a loading state here
  }

  return <StatsCards stats={stats} />;
};
