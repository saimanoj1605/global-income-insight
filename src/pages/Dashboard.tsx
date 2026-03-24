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
          <div className="w-full aspect-video">
            <iframe
              title="Interactive_Analytics_Dashboard_For_Global_Income_Distribution"
              className="w-full h-full rounded-lg border border-border"
              src="https://app.powerbi.com/view?r=eyJrIjoiOTA4NDQ3NTItNTAxMC00MzgwLWI4YTMtNjlmZWRiZTVjYWFhIiwidCI6IjhmYWQ5NzYxLWZhZGItNDFiNi04YTFkLWRjMDVkNWRjNGY5YiJ9"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </SectionCard>
      </section>
    </PageWrapper>
  );
};

export default Dashboard;
