import { Grid } from "@mantine/core";
import { StatCard } from "./stat-card";

type Stat = {
  label: string;
  value: string;
  change: string;
};

type StatsCardsProps = {
  stats: Stat[];
};
const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <Grid mb="lg">
      {stats.map((stat, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
          <StatCard
            label={stat.label}
            value={stat.value}
            change={stat.change}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export { StatsCards };
