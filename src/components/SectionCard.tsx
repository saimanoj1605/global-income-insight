import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

const SectionCard = ({ title, children, className = '', delay = 0 }: SectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`gradient-card rounded-lg shadow-card p-6 md:p-8 border border-border ${className}`}
    >
      {title && <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">{title}</h3>}
      {children}
    </motion.div>
  );
};

export default SectionCard;
