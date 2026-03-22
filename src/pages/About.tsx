import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';

const indicators = [
  {
    name: 'Gini Index',
    desc: 'Measures income inequality within a country on a scale from 0 to 100. A value of 0 represents perfect equality, while 100 represents complete inequality.',
  },
  {
    name: 'Median Income',
    desc: 'Proportion of people living below 50% of median income (%). This indicator measures relative poverty and social inequality within countries.',
  },
  {
    name: 'GDP per Capita (Constant LCU)',
    desc: 'Represents the average economic output per person adjusted for inflation, reflecting real economic growth over time.',
  },
  {
    name: 'GDP per Capita (Current LCU)',
    desc: 'Nominal GDP per person in local currency units, reflecting the current market value without inflation adjustment.',
  },
  {
    name: 'GDP per Capita (Current US$)',
    desc: 'Average economic output per person in US dollars, enabling direct international comparisons of economic performance.',
  },
  {
    name: 'Income Share – Top 10%',
    desc: 'Percentage of total national income earned by the richest 10% of the population. Higher values indicate stronger income concentration at the top.',
  },
  {
    name: 'Income Share – Top 20%',
    desc: 'Percentage of total national income earned by the richest 20%. Tracks broader upper-income concentration patterns.',
  },
  {
    name: 'Income Share – Bottom 10%',
    desc: 'Share of total income earned by the poorest 10%. Lower values indicate higher levels of inequality and income vulnerability.',
  },
  {
    name: 'Income Share – Bottom 20%',
    desc: 'Share of total income earned by the poorest 20%. A key measure of economic inclusion and poverty distribution.',
  },
];

const About = () => {
  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            About the Project
          </motion.h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Understanding global income distribution through 9 key economic indicators across 55 countries and 25 years of data.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 space-y-8">
        <SectionCard title="Dataset Overview">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-primary">55</div>
              <div className="text-sm text-muted-foreground mt-1">Countries Covered</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-primary">25</div>
              <div className="text-sm text-muted-foreground mt-1">Years (2000–2024)</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="text-3xl font-bold text-primary">9</div>
              <div className="text-sm text-muted-foreground mt-1">Economic Indicators</div>
            </div>
          </div>
        </SectionCard>

        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">The 9 Indicators</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.map((ind, i) => (
              <SectionCard key={ind.name} delay={i * 0.05}>
                <h4 className="font-semibold text-primary text-lg mb-2">{ind.name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
              </SectionCard>
            ))}
          </div>
        </div>

        <SectionCard title="Data Source">
          <p className="text-muted-foreground leading-relaxed">
            All data is sourced from the <strong className="text-foreground">World Bank Group – World Development Indicators (WDI)</strong>. 
            The dataset includes country name, country code, series name, series code, and annual values from 2000 to 2024. 
            Data transformations include rounding GDP values to two decimal places, creating GDP Category and Inequality Level calculated columns using DAX.
          </p>
        </SectionCard>
      </section>
    </PageWrapper>
  );
};

export default About;
