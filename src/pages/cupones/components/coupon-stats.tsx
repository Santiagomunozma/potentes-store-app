import { useEffect, useState } from "react";
import { StatsCards } from "../../../components/stats-cards";
import type { CouponStats as CouponStatsType } from "../services/stats";
import { getCouponStats } from "../services/stats";

export const CouponStats = () => {
  const [stats, setStats] = useState<CouponStatsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCouponStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching coupon stats:", error);
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
