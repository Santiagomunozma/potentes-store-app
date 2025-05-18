import { useEffect, useState } from "react";
import { StatsCards } from "../../../components/stats-cards";
import type { SellStats as SellStatsType } from "../services/stats";
import { getSellStats } from "../services/stats";

export const SellStats = () => {
  const [stats, setStats] = useState<SellStatsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSellStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching sell stats:", error);
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
