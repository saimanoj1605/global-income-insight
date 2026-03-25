import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const messages = [
  "👋 Welcome to the Global Income Inequality Dashboard! Explore data across 55 countries and 25 years.",
  "📊 Check out the Dashboard page for interactive Power BI visualizations of income distribution.",
  "🌍 This project uses World Bank indicators including Gini Index, GDP per Capita, and Median Income.",
  "📁 Visit Datasets to download raw data, master sheets, and documentation.",
  "💬 Don't forget to leave your feedback and suggestions before you go!",
  "📈 The Overview page breaks down all 9 socio-economic indicators used in this analysis.",
];

const AnimeAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-72 p-4 rounded-xl bg-card border border-border shadow-elevated"
          >
            <button
              onClick={() => setShowBubble(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
            <p className="text-sm text-foreground leading-relaxed pr-4">{messages[msgIndex]}</p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (isOpen) {
            setShowBubble(!showBubble);
          } else {
            setIsOpen(true);
            setShowBubble(true);
          }
        }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center text-2xl"
      >
        {isOpen && showBubble ? <X size={20} /> : <MessageCircle size={20} />}
      </motion.button>
    </div>
  );
};

export default AnimeAvatar;
