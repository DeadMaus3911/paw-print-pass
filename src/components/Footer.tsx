import React from 'react';

interface FooterProps {
  levelLabel: string;
  doneCount: number;
  onReset: () => void;
}

const Footer: React.FC<FooterProps> = ({ levelLabel, doneCount, onReset }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-card">
      <div className="max-w-[860px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 rounded-none bg-primary text-primary-foreground text-xs font-bold">
            {levelLabel}
          </span>
          <span className="text-sm text-muted-foreground">{doneCount} items afgerond</span>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-destructive hover:underline font-medium"
        >
          Reset
        </button>
      </div>
    </footer>
  );
};

export default Footer;
