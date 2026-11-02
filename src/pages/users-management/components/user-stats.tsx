import { useEffect, useState } from "react";
import { StatsCards } from "../../../components/stats-cards";
import { getUserStats, type UserStats } from "../services/stats";

export const UserStatsCards = () => {
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return null;
  }

  return <StatsCards stats={stats} />;
};
