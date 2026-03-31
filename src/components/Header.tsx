import React from 'react';

interface HeaderProps {
  xp: number;
  progress: number;
  levelLabel: string;
  levelEmoji: string;
}

const Header: React.FC<HeaderProps> = ({ xp, progress, levelLabel, levelEmoji }) => {
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-card">
      <div className="max-w-[860px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl" role="img" aria-label="paw">🐾</span>
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-tight truncate">Overdracht Maurice Laval</h1>
            <p className="text-sm opacity-80 truncate">Prins Petfoods · Einddatum 24 april 2026</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-semibold">{levelEmoji} {xp} XP · {levelLabel}</span>
          <div className="w-32 h-2.5 bg-primary-foreground/20 overflow-hidden">
            <div
              className="h-full bg-accent"
              style={{
                width: `${Math.min(progress, 100)}%`,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
