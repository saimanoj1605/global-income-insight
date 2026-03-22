import { ReactNode } from 'react';
import Footer from './Footer';

interface PageWrapperProps {
  children: ReactNode;
  showFooter?: boolean;
}

const PageWrapper = ({ children, showFooter = true }: PageWrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col gradient-section">
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageWrapper;
