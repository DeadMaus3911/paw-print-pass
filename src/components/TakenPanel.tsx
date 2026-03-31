import React, { useState, useCallback, useRef, useEffect } from 'react';
import { OverdrachtItem, MILESTONES, MilestoneData, getCategoryProgress } from '@/hooks/useOverdracht';

const DOG_EMOJIS = ['🐶', '🐕', '🦮', '🐩', '🐕‍🦺'];
const TOAST_MESSAGES = [
  { msg: 'Afgetekend!', emoji: '🐶' },
  { msg: 'Goed bezig!', emoji: '🐕' },
  { msg: 'Prins-kwaliteit!', emoji: '🦮' },
  { msg: 'Zo gaat dat!', emoji: '🐩' },
];
const CONFETTI_COLORS = ['#0d5a4d', '#8abd24', '#a2c4ba', '#e83f4b', '#ffffff'];
const CATEGORIES = ['Alle', 'Marketing'];

interface TakenPanelProps {
  items: OverdrachtItem[];
  toggleItem: (id: string, done: boolean) => void;
  userName: string;
  setUserName: (n: string) => void;
  doneCount: number;
  streak: number;
  xp: number;
  totalItems: number;
  categories: string[];
}

interface DogEmoji {
  id: number;
  emoji: string;
  driftX: number;
}

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  rotation: number;
  delay: number;
  isCircle: boolean;
  size: number;
}

interface CustomToast {
  id: number;
  msg: string;
  emoji: string;
  leaving: boolean;
}

interface MilestoneBanner {
  id: number;
  data: MilestoneData;
  leaving: boolean;
}

const TakenPanel: React.FC<TakenPanelProps> = ({
  items, toggleItem, userName, setUserName, doneCount, streak, xp, totalItems, categories
}) => {
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [dogEmojis, setDogEmojis] = useState<DogEmoji[]>([]);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [toasts, setToasts] = useState<CustomToast[]>([]);
  const [milestones, setMilestones] = useState<MilestoneBanner[]>([]);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const shownMilestonesRef = useRef<Set<number>>(new Set());

  const initials = userName
    ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const filteredItems = activeCategory === 'Alle' ? items : items.filter(i => i.category === activeCategory);

  const spawnDogEmoji = useCallback(() => {
    const emoji = DOG_EMOJIS[Math.floor(Math.random() * DOG_EMOJIS.length)];
    const driftX = (Math.random() - 0.5) * 60;
    const id = Date.now() + Math.random();
    setDogEmojis(prev => [...prev, { id, emoji, driftX }]);
    setTimeout(() => setDogEmojis(prev => prev.filter(d => d.id !== id)), 1500);
  }, []);

  const spawnConfetti = useCallback(() => {
    const pieces: ConfettiPiece[] = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      left: 10 + Math.random() * 80,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotation: 360 + Math.random() * 720,
      delay: i * 0.04,
      isCircle: Math.random() > 0.5,
      size: 6 + Math.random() * 4,
    }));
    setConfettiPieces(pieces);
    setTimeout(() => setConfettiPieces([]), 1400);
  }, []);

  const showToast = useCallback(() => {
    const t = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg: t.msg, emoji: t.emoji, leaving: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(toast => toast.id === id ? { ...toast, leaving: true } : toast));
      setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 350);
    }, 2500);
  }, []);

  const checkMilestone = useCallback((newCount: number) => {
    const milestone = MILESTONES.find(m => m.count === newCount);
    if (milestone && !shownMilestonesRef.current.has(newCount)) {
      shownMilestonesRef.current.add(newCount);
      const id = Date.now();
      setMilestones(prev => [...prev, { id, data: milestone, leaving: false }]);
      if (!milestone.permanent) {
        setTimeout(() => {
          setMilestones(prev => prev.map(m => m.id === id ? { ...m, leaving: true } : m));
          setTimeout(() => setMilestones(prev => prev.filter(m => m.id !== id)), 600);
        }, 5000);
      }
    }
  }, []);

  const handleToggle = useCallback((id: string, currentDone: boolean) => {
    const newDone = !currentDone;
    toggleItem(id, newDone);

    if (newDone) {
      // Animate checkbox
      setAnimatingItems(prev => new Set([...prev, id]));
      setTimeout(() => setAnimatingItems(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }), 300);

      spawnDogEmoji();
      spawnConfetti();
      showToast();
      checkMilestone(doneCount + 1);
    }
  }, [toggleItem, doneCount, spawnDogEmoji, spawnConfetti, showToast, checkMilestone]);

  const isExpired = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-5 relative">
      {/* Dog emoji animations */}
      {dogEmojis.map(dog => (
        <div
          key={dog.id}
          className="fixed bottom-20 left-1/2 z-50 animate-dog-arc"
          style={{
            fontSize: '36px',
            '--drift-x': `${dog.driftX}px`,
          } as React.CSSProperties}
        >
          {dog.emoji}
        </div>
      ))}

      {/* Confetti from top */}
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="fixed top-0 z-50 animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.isCircle ? '50%' : '0',
            animationDelay: `${piece.delay}s`,
            '--confetti-rot': `${piece.rotation}deg`,
          } as React.CSSProperties}
        />
      ))}

      {/* Custom toasts — right side */}
      <div className="fixed top-20 right-4 z-50 space-y-2" style={{ maxWidth: '280px' }}>
        {toasts.map(t => (
          <div
            key={t.id}
            className={`bg-primary text-primary-foreground px-4 py-3 shadow-card flex items-center gap-3 ${
              t.leaving ? 'animate-toast-out' : 'animate-toast-in'
            }`}
          >
            <span className="text-xl">{t.emoji}</span>
            <div>
              <div className="text-sm font-bold">{t.msg}</div>
              <div className="text-xs opacity-80">+10 XP</div>
            </div>
          </div>
        ))}
      </div>

      {/* Milestone banners */}
      {milestones.map(m => (
        <div
          key={m.id}
          className={`bg-accent text-accent-foreground px-5 py-4 shadow-card flex items-center gap-4 ${
            m.leaving ? 'animate-milestone-out' : 'animate-milestone-in'
          }`}
        >
          <span className="text-3xl">{m.data.emoji}</span>
          <div>
            <div className="font-bold text-base">{m.data.title}</div>
            <div className="text-sm opacity-90">{m.data.subtitle}</div>
          </div>
        </div>
      ))}

      {/* Farewell note */}
      <div className="bg-card shadow-card p-4 border-l-4 border-accent">
        <p className="text-sm text-foreground">
          <strong>Beste collega's,</strong> bedankt voor de samenwerking. In dit document vinden jullie alles wat nodig is voor een soepele overdracht. Succes! — Maurice
        </p>
      </div>

      {/* User bar */}
      <div className="flex items-center gap-3 bg-card shadow-card p-3">
        <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold ${userName ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
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
          <div key={stat.label} className="bg-card shadow-card p-3 text-center">
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter with progress bars */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => {
          const catProgress = cat === 'Alle'
            ? (totalItems > 0 ? (doneCount / totalItems) * 100 : 0)
            : getCategoryProgress(items, cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors relative ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
              style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <span className="flex items-center gap-2">
                {cat}
                <span className="inline-block w-14 h-1.5 bg-primary-foreground/20 overflow-hidden">
                  <span
                    className="block h-full bg-accent"
                    style={{ width: `${catProgress}%`, transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="shadow-card p-4"
            style={{
              backgroundColor: item.done ? 'hsl(var(--secondary) / 0.5)' : 'hsl(var(--card))',
              transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => handleToggle(item.id, item.done)}
                className={`mt-1 w-5 h-5 accent-primary cursor-pointer ${
                  animatingItems.has(item.id) ? 'animate-check-pop' : ''
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-semibold text-sm"
                    style={{
                      color: item.done ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                      textDecoration: item.done ? 'line-through' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {item.title}
                  </span>
                  {item.deadline && (
                    <span className={`text-xs px-2 py-0.5 font-medium ${
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
                  <p className="text-xs mt-1" style={{ color: 'hsl(var(--accent))' }}>
                    ✓ Afgetekend door {item.checked_by} op {item.checked_date}
                  </p>
                )}
              </div>
              {!item.done && (
                <button
                  onClick={() => handleToggle(item.id, item.done)}
                  className="shrink-0 text-xs px-3 py-1.5 bg-accent text-accent-foreground font-medium hover:opacity-90"
                  style={{ transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
