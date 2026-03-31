import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OverdrachtItem {
  id: string;
  category: string;
  title: string;
  description: string;
  deadline?: string;
  done: boolean;
  checked_by?: string;
  checked_date?: string;
}

const PLACEHOLDER_ITEMS: OverdrachtItem[] = [
  {
    id: 'task-1',
    category: 'Marketing',
    title: 'Campagne Q2 afronden',
    description: 'Alle assets voor de Q2 social media campagne overdragen aan het team.',
    deadline: '2026-04-20',
    done: false,
  },
];

export interface Level {
  min: number;
  label: string;
  emoji: string;
}

const LEVELS: Level[] = [
  { min: 0, label: 'Starter', emoji: '⭐' },
  { min: 3, label: 'Opwarmer', emoji: '🌱' },
  { min: 6, label: 'Op dreef', emoji: '🔥' },
  { min: 10, label: 'Halverwege', emoji: '⚡' },
  { min: 14, label: 'Bijna klaar', emoji: '🏆' },
  { min: 18, label: 'Bijna compleet', emoji: '🌟' },
  { min: 20, label: 'VOLLEDIG OVERGEDRAGEN', emoji: '🎉' },
];

export interface MilestoneData {
  count: number;
  emoji: string;
  title: string;
  subtitle: string;
  permanent: boolean;
}

export const MILESTONES: MilestoneData[] = [
  { count: 5, emoji: '🐶', title: 'Eerste 5 afgetekend!', subtitle: 'Goed bezig — de staart begint te kwispelen.', permanent: false },
  { count: 10, emoji: '🐕', title: 'Halverwege!', subtitle: '50% — dit gaat als een trein.', permanent: false },
  { count: 15, emoji: '🦮', title: '15 punten klaar!', subtitle: 'Bijna — nog even volhouden.', permanent: false },
  { count: 20, emoji: '🏆', title: 'Overdracht compleet!', subtitle: 'Maurice heeft alles overgedragen. Chapeau!', permanent: true },
];

export function getLevel(count: number): Level {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (count >= l.min) level = l;
  }
  return level;
}

export function getFooterStatus(doneCount: number, totalItems: number): string {
  if (doneCount === 0) return 'Begin met overdragen — elk punt telt!';
  if (doneCount >= totalItems && totalItems > 0) {
    const level = getLevel(doneCount);
    return `${level.emoji} Overdracht volledig afgerond — Prins-kwaliteit!`;
  }
  const pct = Math.round((doneCount / totalItems) * 100);
  return `${doneCount} van de ${totalItems} punten overgedragen · ${pct}% klaar`;
}

export function getCategoryProgress(items: OverdrachtItem[], category: string): number {
  const catItems = items.filter(i => i.category === category);
  if (catItems.length === 0) return 0;
  return (catItems.filter(i => i.done).length / catItems.length) * 100;
}

export function useOverdracht() {
  const [items, setItems] = useState<OverdrachtItem[]>(PLACEHOLDER_ITEMS);
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState('');
  const prevDoneCountRef = useRef(0);

  useEffect(() => {
    const loadItems = async () => {
      const { data } = await supabase
        .from('overdracht_items')
        .select('*');

      if (data && data.length > 0) {
        setItems(prev =>
          prev.map(item => {
            const dbItem = data.find(d => d.id === item.id);
            if (dbItem) {
              return {
                ...item,
                done: dbItem.done,
                checked_by: dbItem.checked_by ?? undefined,
                checked_date: dbItem.checked_date ?? undefined,
              };
            }
            return item;
          })
        );
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('overdracht-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'overdracht_items' },
        (payload) => {
          const updated = payload.new as any;
          if (updated) {
            setItems(prev =>
              prev.map(item =>
                item.id === updated.id
                  ? {
                      ...item,
                      done: updated.done,
                      checked_by: updated.checked_by ?? undefined,
                      checked_date: updated.checked_date ?? undefined,
                    }
                  : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleItem = useCallback(
    async (id: string, done: boolean) => {
      const now = new Date().toLocaleDateString('nl-NL');
      const checkedBy = done ? userName || 'Anoniem' : null;
      const checkedDate = done ? now : null;

      setItems(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, done, checked_by: checkedBy ?? undefined, checked_date: checkedDate ?? undefined }
            : item
        )
      );

      if (done) {
        setStreak(s => s + 1);
      }

      await supabase
        .from('overdracht_items')
        .upsert({
          id,
          done,
          checked_by: checkedBy,
          checked_date: checkedDate,
          updated_at: new Date().toISOString(),
        });
    },
    [userName]
  );

  const doneCount = items.filter(i => i.done).length;
  const xp = doneCount * 10;
  const totalItems = items.length;
  const level = getLevel(doneCount);
  const progress = totalItems > 0 ? (doneCount / 20) * 100 : 0;
  const footerStatus = getFooterStatus(doneCount, totalItems);

  // Track previous done count for milestone detection
  useEffect(() => {
    prevDoneCountRef.current = doneCount;
  }, [doneCount]);

  const reset = useCallback(async () => {
    setStreak(0);
    setItems(prev => prev.map(i => ({ ...i, done: false, checked_by: undefined, checked_date: undefined })));
    for (const item of items) {
      await supabase
        .from('overdracht_items')
        .upsert({ id: item.id, done: false, checked_by: null, checked_date: null, updated_at: new Date().toISOString() });
    }
  }, [items]);

  const categories = [...new Set(items.map(i => i.category))];

  return {
    items,
    setItems,
    streak,
    xp,
    doneCount,
    totalItems,
    level,
    progress,
    toggleItem,
    userName,
    setUserName,
    reset,
    footerStatus,
    categories,
    prevDoneCount: prevDoneCountRef.current,
  };
}
