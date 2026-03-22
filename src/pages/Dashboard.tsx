import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Monitor } from 'lucide-react';

const Dashboard = () => {
  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Power BI Dashboard
          </motion.h1>
          <p className="text-primary-foreground/80 text-lg">
            Interactive analytics dashboard for global income distribution analysis.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <SectionCard>
          <div className="text-center py-16 space-y-6">
            <Monitor className="w-20 h-20 text-primary mx-auto opacity-50" />
            <h3 className="font-display text-2xl font-bold text-foreground">
              Power BI Dashboard Embed Area
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              The Power BI dashboard for the Interactive Analytics Dashboard for Global Income Distribution 
              is embedded here. The dashboard provides comprehensive visualizations of GDP trends, 
              inequality metrics, and income distribution patterns across 55 countries from 2000 to 2024.
            </p>
            <div className="bg-muted rounded-lg p-8 border-2 border-dashed border-border">
              <p className="text-muted-foreground text-sm">
                To embed your Power BI dashboard, replace this placeholder with your Power BI embed URL using an iframe. 
                The dashboard file (.pbix) is available in the Datasets section for download.
              </p>
            </div>
          </div>
        </SectionCard>
      </section>
    </PageWrapper>
  );
};

export default Dashboard;
