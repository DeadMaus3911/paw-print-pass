import { useState, useEffect, useCallback } from 'react';
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

const LEVELS = [
  { min: 0, label: 'Starter' },
  { min: 3, label: 'Opwarmer' },
  { min: 6, label: 'Op dreef' },
  { min: 10, label: 'Halverwege' },
  { min: 14, label: 'Bijna klaar' },
  { min: 18, label: 'Bijna compleet' },
  { min: 20, label: 'VOLLEDIG OVERGEDRAGEN' },
];

export function getLevel(count: number) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (count >= l.min) level = l;
  }
  return level;
}

export function useOverdracht() {
  const [items, setItems] = useState<OverdrachtItem[]>(PLACEHOLDER_ITEMS);
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState('');

  // Load from supabase on mount
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

  // Subscribe to realtime
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

      // Optimistic update
      setItems(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, done, checked_by: checkedBy ?? undefined, checked_date: checkedDate ?? undefined }
            : item
        )
      );

      if (done) setStreak(s => s + 1);

      // Upsert to supabase
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

  const reset = useCallback(async () => {
    setStreak(0);
    setItems(prev => prev.map(i => ({ ...i, done: false, checked_by: undefined, checked_date: undefined })));
    for (const item of items) {
      await supabase
        .from('overdracht_items')
        .upsert({ id: item.id, done: false, checked_by: null, checked_date: null, updated_at: new Date().toISOString() });
    }
  }, [items]);

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
  };
}
