import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Download, FileSpreadsheet, FileText, Database, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const datasetSections = [
  {
    title: 'Raw Data',
    icon: Database,
    files: [
      {
        name: 'Shivani_Bhatt-Milestone_1.docx',
        desc: 'Raw data collection document containing the original World Bank WDI dataset with all 9 indicators across 55 countries. Includes dataset structure, indicator descriptions, and initial data tables for Gini Index, Income Share, Median Income, and GDP per Capita.',
        path: '/datasets/Shivani_Bhatt-Milestone_1.docx',
      },
    ],
  },
  {
    title: 'Master Dataset',
    icon: FileSpreadsheet,
    files: [
      {
        name: 'Mastersheet.xlsx',
        desc: 'The consolidated master dataset (Mastersheet-1.xlsx) containing cleaned and merged data for all 55 countries across 25 years (2000–2024). Includes columns: Countries, Years, Gini Index, Median Income, GDP per Capita (3 types), Income Share (Top 10%, Top 20%, Bottom 10%, Bottom 20%).',
        path: '/datasets/Mastersheet.xlsx',
      },
    ],
  },
  {
    title: 'Dashboard File',
    icon: BarChart3,
    files: [
      {
        name: 'Interactive_Analytics_Dashboard.pbix',
        desc: 'The Power BI dashboard file containing all KPIs, slicers, charts (Donut, Line, Tree Map, Area, Gauge), calculated columns (GDP Category, Inequality Level), and DAX measures. Ready to open in Power BI Desktop.',
        path: '/datasets/Interactive_Analytics_Dashboard_For_Global_Income_Distribution.pbix',
      },
    ],
  },
  {
    title: 'Documentation',
    icon: FileText,
    files: [
      {
        name: 'Documentation_Milestone_2.docx',
        desc: 'Complete project documentation covering data loading, transformations, calculated columns, DAX measures, dashboard design, chart configurations, slicer setup, and styling details. Serves as the technical reference for the entire project.',
        path: '/datasets/Documentation_Milestone_2.docx',
      },
    ],
  },
];

const Datasets = () => {
  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Datasets
          </motion.h1>
          <p className="text-primary-foreground/80 text-lg">
            Download and explore all project datasets, documentation, and dashboard files.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 space-y-8">
        {datasetSections.map((section, si) => (
          <SectionCard key={section.title} title={section.title} delay={si * 0.1}>
            <div className="space-y-4">
              {section.files.map(file => (
                <div key={file.name} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-muted border border-border">
                  <section.icon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{file.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{file.desc}</p>
                  </div>
                  <a href={file.path} download>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download size={16} /> Download
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </section>
    </PageWrapper>
  );
};

export default Datasets;
