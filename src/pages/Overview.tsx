import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { BarChart3, SlidersHorizontal, PieChart, TrendingUp, TreePine, Activity, Gauge } from 'lucide-react';

const kpis = [
  {
    title: 'Average GDP (USD)',
    value: '22.46K',
    desc: 'This KPI displays the average GDP per capita in US dollars across all countries in the dataset. It provides a quick overview of the overall economic standing globally, helping users benchmark individual countries against the world average.',
  },
  {
    title: 'GDP Growth %',
    value: '0.04',
    desc: 'This KPI measures the year-to-year GDP growth rate, calculated using DAX by comparing the current year\'s average GDP to the previous year. It allows users to assess whether the global economy is expanding or contracting over time.',
  },
  {
    title: 'Average Gini Index',
    value: '37.08',
    desc: 'The average Gini Index across all countries provides a snapshot of global inequality. A higher value indicates greater income disparity. This metric helps track whether global income inequality is improving or worsening.',
  },
  {
    title: 'Average Median Income',
    value: '13.77',
    desc: 'This KPI represents the average proportion of people living below 50% of median income across all countries. It serves as a relative poverty indicator, showing how many people live significantly below their country\'s median income level.',
  },
];

const slicers = [
  { title: 'Year', desc: 'Allows filtering data by specific years (2000–2024), enabling time-based trend analysis to observe how economic indicators change over time.' },
  { title: 'Country', desc: 'Filters the dashboard to show data for specific countries, enabling focused national-level analysis and cross-country comparison.' },
  { title: 'GDP Category', desc: 'Categorizes countries into High GDP, Middle GDP, and Low GDP groups using a calculated column in DAX, allowing segmented economic analysis.' },
  { title: 'Inequality Level', desc: 'Segments countries into High, Moderate, and Low inequality levels based on Gini Index thresholds, enabling targeted inequality analysis.' },
];

const charts = [
  {
    icon: PieChart,
    title: 'Donut Chart – GDP Category Distribution',
    desc: 'This donut chart visualizes how many countries fall under High, Middle, and Low GDP categories. It provides a quick proportional view of global economic groupings, helping identify the distribution of wealth across the world.',
  },
  {
    icon: PieChart,
    title: 'Donut Chart – Inequality Level Distribution',
    desc: 'This donut chart shows the distribution of countries by their inequality level (High, Moderate, Low). It helps users understand how many countries experience severe versus moderate income inequality globally.',
  },
  {
    icon: TrendingUp,
    title: 'Line Chart – GDP Growth Trend',
    desc: 'This line chart plots the average GDP per capita (USD) over the years (2000–2024). It reveals long-term economic growth patterns and helps identify periods of acceleration, stagnation, or decline in global economic performance.',
  },
  {
    icon: TrendingUp,
    title: 'Line Chart – Inequality Trend',
    desc: 'This line chart tracks the average Gini Index over time, showing whether global inequality is increasing or decreasing. It provides essential context for understanding the relationship between economic growth and income distribution.',
  },
  {
    icon: TreePine,
    title: 'Tree Map – Income Concentration by Country',
    desc: 'The tree map visualizes which countries have the highest income concentration among the richest 10% of their population. Larger blocks represent countries where income is more heavily concentrated at the top, making it easy to spot extreme inequality.',
  },
  {
    icon: Activity,
    title: 'Area Chart – Income Gap Trend',
    desc: 'This area chart displays the income gap trend over time, measuring the difference between income held by the top 20% and bottom 20%. The filled area helps visualize the magnitude and direction of income disparity changes across years.',
  },
  {
    icon: Gauge,
    title: 'Gauge Chart – GDP Performance Indicator',
    desc: 'The gauge chart visually represents overall economic performance compared to a maximum benchmark. It allows viewers to quickly assess whether the average GDP level is low, moderate, or high, providing an intuitive "speedometer" style visualization.',
  },
];

const Overview = () => {
  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Dashboard Overview
          </motion.h1>
          <p className="text-primary-foreground/80 text-lg">
            Detailed explanation of all dashboard components, KPIs, slicers, and charts.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 space-y-12">
        {/* KPIs */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-7 h-7 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground">Key Performance Indicators (KPIs)</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {kpis.map((kpi, i) => (
              <SectionCard key={kpi.title} delay={i * 0.05}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-primary text-lg">{kpi.title}</h4>
                  <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{kpi.desc}</p>
              </SectionCard>
            ))}
          </div>
        </div>

        {/* Slicers */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <SlidersHorizontal className="w-7 h-7 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground">Slicers (Filters)</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {slicers.map((s, i) => (
              <SectionCard key={s.title} delay={i * 0.05}>
                <h4 className="font-semibold text-primary text-lg mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </SectionCard>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-7 h-7 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground">Charts & Visualizations</h2>
          </div>
          <div className="space-y-6">
            {charts.map((chart, i) => (
              <SectionCard key={chart.title} delay={i * 0.03}>
                <div className="flex items-start gap-4">
                  <chart.icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground text-lg mb-2">{chart.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{chart.desc}</p>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Overview;
