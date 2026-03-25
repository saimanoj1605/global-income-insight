import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-6 px-4 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto flex justify-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-semibold text-sm text-primary">Infosys Springboard</span>
          </div>
          <div className="text-right text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Infosys Springboard Internship 6.0</p>
            <p>Mentor: <span className="font-medium text-foreground">Sri Kumar Sir</span></p>
            <p>Coordinator: <span className="font-medium text-foreground">Praveen Sir</span></p>
            <p>Made by <span className="font-medium text-primary">Shivani Bhatt</span></p>
            <p>Batch 13</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
