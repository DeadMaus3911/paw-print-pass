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
  priority?: string;
  involved?: string;
  custom?: boolean;
  subCategory?: string;
}

const PLACEHOLDER_ITEMS: OverdrachtItem[] = [
  // Projecten en opdrachten
  {
    id: 'task-avonturia',
    category: 'Projecten en opdrachten',
    title: 'Avonturia Shop updaten',
    description: 'Content en visuals voor Avonturia winkelcommunicatie bijwerken.',
    done: false,
  },
  {
    id: 'task-puppy-kitten',
    category: 'Projecten en opdrachten',
    title: 'Puppy & Kitten POS Materiaal',
    description: 'POS-materiaal voor Puppy & Kitten assortiment afronden en aanleveren.',
    subCategory: 'Puppy & Kitten materialen',
    done: false,
  },
  // Puppy & Kitten sub-taken
  {
    id: 'task-pk-magneetplaat',
    category: 'Puppy & Kitten materialen',
    title: 'Magneetplaat',
    description: 'POS · Hergebruik van opmaak afgelopen jaar/herdruk van maximaal 10 platen, we hebben er maar 3 nodig. Geen korting hierop communiceren maar algemeen houden afhankelijk van bepaalde boodschap. Formaat: 1 meter.',
    deadline: '2026-04-26',
    done: false,
  },
  {
    id: 'task-pk-checklist',
    category: 'Puppy & Kitten materialen',
    title: 'Checklist',
    description: 'POS/Digitale content · Bestaande checklist aanpassen. Naast downloadbare versie ook fysieke versie laten drukken (op verzoek van Louisa). Oplage: 750 stuks.',
    deadline: '2026-04-26',
    done: false,
  },
  {
    id: 'task-pk-wobbler',
    category: 'Puppy & Kitten materialen',
    title: 'Wobbler',
    description: 'POS · Te weinig aanmeldingen. Ter bespreking omdat het opvallender moet aan het schap — 15% korting duidelijk communiceren hierop.',
    deadline: '2026-04-26',
    done: false,
  },
  {
    id: 'task-pk-schapkaart',
    category: 'Puppy & Kitten materialen',
    title: 'Schapkaart',
    description: 'POS · Graag schapkaart × 10 winkels. Ter bespreking omdat het opvallender moet aan het schap — 15% korting duidelijk communiceren hierop.',
    deadline: '2026-04-26',
    done: false,
  },
  {
    id: 'task-pk-poster-a4',
    category: 'Puppy & Kitten materialen',
    title: 'Poster A4',
    description: 'POS · Graag poster × 10 winkels. 15% korting duidelijk communiceren hierop. Formaat: A4.',
    deadline: '2026-04-26',
    done: false,
  },
  // Gezondheidsplein sub-taken
  {
    id: 'task-gp-magneetplaten',
    category: 'Gezondheidsplein',
    title: 'Magneetplaten accorderen',
    description: 'Magneetplaten geaccordeerd krijgen op tekst en vormgeving.',
    done: false,
  },
  {
    id: 'task-gp-schapstroken',
    category: 'Gezondheidsplein',
    title: 'Schapstroken maken',
    description: 'Schapstroken maken met iconen van Willemijn en teksten.',
    done: false,
  },
  {
    id: 'task-gp-foto-achterplaat',
    category: 'Gezondheidsplein',
    title: 'Nieuwe foto achterplaat',
    description: 'Nieuwe foto op achterplaat in schap plaatsen.',
    done: false,
  },
  {
    id: 'task-gp-bestellen-axent',
    category: 'Gezondheidsplein',
    title: 'Bestellen bij Axent',
    description: 'Materialen bestellen bij Axent Reclame.',
    done: false,
  },
  {
    id: 'task-avonturia-server',
    category: 'Projecten en opdrachten',
    title: 'Avonturia – servermap referentie',
    description: '📂 Bestanden op de server: 01_Prins / Vormgeving / Winkelconcept corporate / 03_Dierenwinkels / Avonturia',
    done: false,
  },
  {
    id: 'task-interzoo',
    category: 'Projecten en opdrachten',
    title: 'InterZoo Mini brochure',
    description: 'Mini brochure ontwerpen en drukklaar aanleveren voor InterZoo.',
    done: false,
  },
  {
    id: 'task-brokkenenzo',
    category: 'Projecten en opdrachten',
    title: 'Brokken&Zo display suggestie',
    description: 'Display-suggestie uitwerken voor Brokken&Zo.',
    done: false,
  },
  {
    id: 'task-gezondheidsplein',
    category: 'Projecten en opdrachten',
    title: 'Gezondheidsplein Accustraat 1',
    description: 'Signing en communicatiemateriaal voor Gezondheidsplein Accustraat 1.',
    done: false,
  },
  {
    id: 'task-giveaway',
    category: 'Projecten en opdrachten',
    title: 'Give Away Actie PC en VC',
    description: 'Give away actie opzetten voor PC en VC kanalen.',
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
        setItems(prev => {
          const updatedItems = prev.map(item => {
            const dbItem = data.find((d: any) => d.id === item.id);
            if (dbItem) {
              return {
                ...item,
                done: dbItem.done,
                checked_by: dbItem.checked_by ?? undefined,
                checked_date: dbItem.checked_date ?? undefined,
                title: dbItem.title || item.title,
                description: dbItem.description || item.description,
              };
            }
            return item;
          });

          // Add custom items from DB that aren't in placeholder
          const customItems = data
            .filter((d: any) => d.custom && !prev.find(p => p.id === d.id))
            .map((d: any) => ({
              id: d.id,
              category: d.category || 'Projecten en opdrachten',
              title: d.title || '',
              description: d.description || '',
              deadline: d.deadline || undefined,
              done: d.done,
              checked_by: d.checked_by ?? undefined,
              checked_date: d.checked_date ?? undefined,
              priority: d.priority || 'Gemiddeld',
              involved: d.involved || undefined,
              custom: true,
            }));

          return [...updatedItems, ...customItems];
        });
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
            setItems(prev => {
              const exists = prev.find(i => i.id === updated.id);
              if (exists) {
                return prev.map(item =>
                  item.id === updated.id
                    ? {
                        ...item,
                        done: updated.done,
                        checked_by: updated.checked_by ?? undefined,
                        checked_date: updated.checked_date ?? undefined,
                        title: updated.title || item.title,
                        description: updated.description || item.description,
                      }
                    : item
                );
              } else if (updated.custom) {
                return [...prev, {
                  id: updated.id,
                  category: updated.category || 'Projecten en opdrachten',
                  title: updated.title || '',
                  description: updated.description || '',
                  deadline: updated.deadline || undefined,
                  done: updated.done,
                  checked_by: updated.checked_by ?? undefined,
                  checked_date: updated.checked_date ?? undefined,
                  priority: updated.priority || 'Gemiddeld',
                  involved: updated.involved || undefined,
                  custom: true,
                }];
              }
              return prev;
            });
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

  const updateItemField = useCallback(
    async (id: string, field: 'title' | 'description', value: string) => {
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );

      await supabase
        .from('overdracht_items')
        .upsert({
          id,
          [field]: value,
          updated_at: new Date().toISOString(),
        } as any);
    },
    []
  );

  const addItem = useCallback(
    async (item: Omit<OverdrachtItem, 'done' | 'checked_by' | 'checked_date'>) => {
      const newItem: OverdrachtItem = {
        ...item,
        done: false,
        custom: true,
      };

      setItems(prev => [...prev, newItem]);

      await supabase
        .from('overdracht_items')
        .upsert({
          id: item.id,
          done: false,
          custom: true,
          category: item.category,
          title: item.title,
          description: item.description,
          deadline: item.deadline || null,
          priority: item.priority || 'Gemiddeld',
          involved: item.involved || null,
          updated_at: new Date().toISOString(),
        } as any);
    },
    []
  );

  const doneCount = items.filter(i => i.done).length;
  const xp = doneCount * 10;
  const totalItems = items.length;
  const level = getLevel(doneCount);
  const progress = totalItems > 0 ? (doneCount / 20) * 100 : 0;
  const footerStatus = getFooterStatus(doneCount, totalItems);

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
    updateItemField,
    addItem,
    userName,
    setUserName,
    reset,
    footerStatus,
    categories,
    prevDoneCount: prevDoneCountRef.current,
  };
}
