import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Download, FileSpreadsheet, FileText, Database, BarChart3, FolderOpen, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const milestone1Files = [
  { name: 'Gini_Index.xlsx', desc: 'Gini Index data across 55 countries measuring income inequality within each nation.', path: '/datasets/Gini_Index.xlsx' },
  { name: 'GDP_Per_Capita.xlsx', desc: 'GDP per Capita data showing average economic output per person across countries.', path: '/datasets/GDP_Per_Capita.xlsx' },
  { name: 'Median_Income.xlsx', desc: 'Median income data — the midpoint income level where half earns more and half earns less.', path: '/datasets/Median_Income.xlsx' },
  { name: 'income_share_by_decile.xlsx', desc: 'Income share distribution data showing how income is divided among population deciles.', path: '/datasets/income_share_by_decile.xlsx' },
  { name: 'Shivani_Bhatt-Milestone_1.docx', desc: 'Raw data collection document with the original World Bank WDI dataset, indicator descriptions, and initial data tables.', path: '/datasets/Shivani_Bhatt-Milestone_1.docx' },
  { name: 'Mastersheet.xlsx', desc: 'Consolidated master dataset with cleaned and merged data for all 55 countries across 25 years (2000–2024).', path: '/datasets/Mastersheet.xlsx' },
  { name: 'Documentation_Milestone_2.docx', desc: 'Documentation covering data loading, transformations, and technical reference for Milestone 1.', path: '/datasets/Documentation_Milestone_2.docx' },
];

const milestone2Files = [
  { name: 'Interactive_Analytics_Dashboard.pbix', desc: 'Power BI dashboard file with all KPIs, slicers, charts (Donut, Line, Tree Map, Area, Gauge), calculated columns and DAX measures.', path: '/datasets/Interactive_Analytics_Dashboard_For_Global_Income_Distribution.pbix' },
  { name: 'Documentation_Milestone_2.docx', desc: 'Complete project documentation covering dashboard design, chart configurations, slicer setup, and styling details.', path: '/datasets/Documentation_Milestone_2.docx' },
  { name: 'Mastersheet-2.xlsx', desc: 'Updated master dataset with additional calculated columns (GDP Category, Inequality Level) used in the dashboard.', path: '/datasets/Mastersheet-2.xlsx' },
];

const Datasets = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => setIsAdmin(!!data));
    }
  }, [user]);

  const toggleFolder = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderFileList = (files: typeof milestone1Files, canDownload: boolean) => (
    <div className="space-y-3 mt-4">
      {files.map(file => (
        <div key={file.name} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-muted border border-border">
          <FileSpreadsheet className="w-6 h-6 text-primary flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground text-sm">{file.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{file.desc}</p>
          </div>
          {canDownload ? (
            <a href={file.path} download>
              <Button variant="outline" size="sm" className="gap-2">
                <Download size={16} /> Download
              </Button>
            </a>
          ) : (
            <Lock size={16} className="text-muted-foreground" />
          )}
        </div>
      ))}
    </div>
  );

  const renderFolder = (
    title: string,
    key: string,
    description: string,
    files: typeof milestone1Files,
    paymentLink: string,
    icon: React.ReactNode
  ) => (
    <SectionCard key={key}>
      <button onClick={() => toggleFolder(key)} className="w-full text-left flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <FolderOpen size={20} className={`text-muted-foreground transition-transform ${expanded[key] ? 'rotate-0' : '-rotate-90'}`} />
      </button>

      {expanded[key] && (
        <div className="mt-4">
          {isAdmin ? (
            <>
              <div className="flex items-center gap-2 mb-2 text-sm text-primary font-medium">
                <Download size={16} /> Admin access — Download all files
              </div>
              {renderFileList(files, true)}
            </>
          ) : (
            <>
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={18} className="text-accent" />
                  <h4 className="font-semibold text-foreground text-sm">Purchase to Download</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Access all files in this folder by completing the payment. You'll be able to download each file individually after purchase.
                </p>
                <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <CreditCard size={16} /> Pay & Get Access
                  </Button>
                </a>
              </div>
              {renderFileList(files, false)}
            </>
          )}
        </div>
      )}
    </SectionCard>
  );

  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Datasets
          </motion.h1>
          <p className="text-primary-foreground/80 text-lg">
            Browse and download project datasets organized by milestone. Each folder contains all related files.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 space-y-8">
        <div className="p-4 rounded-lg bg-muted border border-border text-center">
          <p className="text-sm text-muted-foreground">
            📂 Datasets are organized in <strong>folder format</strong> by milestone sequence. Click a folder to preview its contents.
          </p>
        </div>

        {renderFolder(
          'Milestone 1 — Data Collection & Preparation',
          'milestone1',
          'Contains raw data of 4 indicators (Gini Index, GDP per Capita, Median Income, Income Share), master dataset, and Milestone 1 documentation.',
          milestone1Files,
          'https://rzp.io/rzp/Qpmz6gf',
          <Database size={20} className="text-primary" />
        )}

        {renderFolder(
          'Milestone 2 — Dashboard & Analysis',
          'milestone2',
          'Contains the interactive Power BI dashboard (.pbix), updated mastersheet with calculated columns, and Milestone 2 documentation.',
          milestone2Files,
          'https://rzp.io/rzp/EENRiw8l',
          <BarChart3 size={20} className="text-primary" />
        )}
      </section>
    </PageWrapper>
  );
};

export default Datasets;
