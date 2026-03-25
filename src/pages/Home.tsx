import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Button } from '@/components/ui/button';
import { BarChart3, Globe2, TrendingUp, Target, Heart } from 'lucide-react';
import { toast } from 'sonner';

const Home = () => {
  const [totalLikes, setTotalLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    try {
      const res = await fetch('http://localhost:5000/viewer/likes');
      const data = await res.json();
      setTotalLikes(data.totalLikes);
    } catch (err) {
      console.error('Error fetching likes:', err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch('http://localhost:5000/viewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Anonymous',
          city: 'Unknown',
          state: 'Unknown',
          country: 'Unknown',
          feedback: 'Liked the dashboard',
          liked: true,
        }),
      });
      if (res.ok) {
        setLiked(true);
        setTotalLikes(prev => prev + 1);
        toast.success('Thanks for liking!');
      }
    } catch (err) {
      toast.error('Error liking');
    }
  };
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="gradient-hero py-20 md:py-28 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Interactive Analytics Dashboard for <br className="hidden md:block" />
            <span className="text-accent">Global Income Distribution</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed"
          >
            A comprehensive data analytics project exploring global income inequality across 55 countries 
            over 25 years, powered by World Bank indicators and visualized through an interactive Power BI dashboard.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-8">
        <SectionCard title="What is Global Income Inequality?" delay={0}>
          <p className="text-muted-foreground leading-relaxed">
            Global income inequality refers to the extreme, uneven distribution of income among the world's population, 
            where a small percentage of individuals or nations hold a disproportionate share of global wealth. 
            It measures disparities in economic, social, and political opportunities across the globe, 
            often using the Gini coefficient to track gaps between the rich and poor.
          </p>
        </SectionCard>

        <div className="grid md:grid-cols-2 gap-8">
          <SectionCard title="Purpose of This Dashboard" delay={0.1}>
            <p className="text-muted-foreground leading-relaxed">
              This project transforms raw economic data into meaningful analytical insights using Power BI. 
              It addresses key questions: How is global economic growth changing? Is inequality increasing or decreasing? 
              How does GDP growth relate to income distribution?
            </p>
          </SectionCard>

          <SectionCard title="Data Source" delay={0.2}>
            <p className="text-muted-foreground leading-relaxed">
              All data is sourced from the World Bank's World Development Indicators (WDI) database, 
              covering 55 countries from 2000 to 2024 with 9 socio-economic indicators including 
              Gini Index, GDP per capita, median income, and income share distributions.
            </p>
          </SectionCard>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Globe2, label: '55 Countries', desc: 'Worldwide coverage' },
            { icon: BarChart3, label: '9 Indicators', desc: 'Economic metrics' },
            { icon: TrendingUp, label: '25 Years', desc: '2000–2024 data' },
            { icon: Target, label: '4 KPIs', desc: 'Key performance' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="gradient-card rounded-lg shadow-card border border-border p-6 text-center"
            >
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-bold text-foreground text-lg">{item.label}</div>
              <div className="text-sm text-muted-foreground">{item.desc}</div>
            </motion.div>
          ))}
        </div>

        <SectionCard title="Support This Project" delay={0.3}>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">If you found this dashboard helpful, show your support!</p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleLike} disabled={liked} variant="outline" className="gap-2">
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <div className="text-sm text-muted-foreground">
                Total Likes: {totalLikes}
              </div>
            </div>
          </div>
        </SectionCard>
      </section>
    </PageWrapper>
  );
};

export default Home;
