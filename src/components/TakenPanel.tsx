import React, { useState, useCallback } from 'react';
import { OverdrachtItem } from '@/hooks/useOverdracht';
import { toast } from 'sonner';

const DOG_EMOJIS = ['🐕', '🐶', '🐩', '🐕‍🦺', '🦮', '🐾', '🐕'];
const CATEGORIES = ['Alle', 'Marketing'];

const MILESTONES = [5, 10, 15, 20];

interface TakenPanelProps {
  items: OverdrachtItem[];
  toggleItem: (id: string, done: boolean) => void;
  userName: string;
  setUserName: (n: string) => void;
  doneCount: number;
  streak: number;
  xp: number;
  totalItems: number;
}

const TakenPanel: React.FC<TakenPanelProps> = ({
  items, toggleItem, userName, setUserName, doneCount, streak, xp, totalItems
}) => {
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [popEmoji, setPopEmoji] = useState<{ emoji: string; id: number } | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [shownMilestones, setShownMilestones] = useState<Set<number>>(new Set());

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const filteredItems = activeCategory === 'Alle' ? items : items.filter(i => i.category === activeCategory);

  const handleToggle = useCallback((id: string, currentDone: boolean) => {
    const newDone = !currentDone;
    toggleItem(id, newDone);

    if (newDone) {
      // Emoji pop
      const emoji = DOG_EMOJIS[Math.floor(Math.random() * DOG_EMOJIS.length)];
      setPopEmoji({ emoji, id: Date.now() });
      setTimeout(() => setPopEmoji(null), 1300);

      // Confetti
      setConfetti(true);
      setTimeout(() => setConfetti(false), 900);

      // Toast
      toast.success('Item afgerond! 🎉', { description: `+10 XP` });

      // Milestone
      const newCount = doneCount + 1;
      if (MILESTONES.includes(newCount) && !shownMilestones.has(newCount)) {
        setShownMilestones(prev => new Set([...prev, newCount]));
        toast(`🏆 Milestone: ${newCount} items afgerond!`, { duration: 4000 });
      }
    } else {
      toast('Item heropend', { description: '-10 XP' });
    }
  }, [toggleItem, doneCount, shownMilestones]);

  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-5 relative">
      {/* Emoji pop overlay */}
      {popEmoji && (
        <div key={popEmoji.id} className="fixed bottom-24 left-1/2 -translate-x-1/2 text-6xl animate-emoji-pop pointer-events-none z-50">
          {popEmoji.emoji}
        </div>
      )}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                background: ['#8abd24', '#0d5a4d', '#e83f4b', '#a2c4ba', '#ffd700'][i % 5],
                left: `${50 + (Math.random() - 0.5) * 60}%`,
                top: `${50 + (Math.random() - 0.5) * 40}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Farewell note */}
      <div className="rounded-none bg-card shadow-card p-4 border-l-4 border-accent">
        <p className="text-sm text-foreground">
          <strong>Beste collega's,</strong> bedankt voor de samenwerking. In dit document vinden jullie alles wat nodig is voor een soepele overdracht. Succes! — Maurice
        </p>
      </div>

      {/* User bar */}
      <div className="flex items-center gap-3 rounded-none bg-card shadow-card p-3">
        <div className={`w-10 h-10 rounded-none flex items-center justify-center text-sm font-bold ${userName ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
          {initials}
        </div>
        <input
          type="text"
          placeholder="Aftekenen als:"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Overgedragen', value: doneCount },
          { label: 'Nog open', value: totalItems - doneCount },
          { label: 'Streak', value: `🔥 ${streak}` },
          { label: 'XP', value: xp },
        ].map(stat => (
          <div key={stat.label} className="rounded-none bg-card shadow-card p-3 text-center">
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-none text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`rounded-none shadow-card p-4 transition-colors ${
              item.done ? 'bg-secondary/50' : 'bg-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => handleToggle(item.id, item.done)}
                className="mt-1 w-5 h-5 rounded accent-primary cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold text-sm ${item.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {item.title}
                  </span>
                  {item.deadline && (
                    <span className={`text-xs px-2 py-0.5 rounded-none font-medium ${
                      isExpired(item.deadline)
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {item.deadline}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                {item.done && item.checked_by && (
                  <p className="text-xs text-accent mt-1">
                    ✓ Afgetekend door {item.checked_by} op {item.checked_date}
                  </p>
                )}
              </div>
              {!item.done && (
                <button
                  onClick={() => handleToggle(item.id, false)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-none bg-accent text-accent-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Ik pak dit op
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TakenPanel;
