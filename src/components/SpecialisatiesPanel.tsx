import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SkillCard {
  id?: string;
  emoji: string;
  title: string;
  description: string;
  fromDb?: boolean;
}

const HARDCODED_SKILLS: SkillCard[] = [
  { emoji: '🧊', title: '3D Design', description: 'Productvisualisaties, retailmockups en conceptmodellen in 3D' },
  { emoji: '🛒', title: 'Winkelcommunicatie en POS', description: 'Schapstroken, toppers, displays, vloerstickers en retailsigning' },
  { emoji: '🎬', title: 'Animatie', description: 'Motion graphics, productvideo\'s en sociale media animaties' },
  { emoji: '📚', title: 'E-learning en illustraties', description: 'Lesstof en illustraties voor EduPet en interne trainingen' },
  { emoji: '🤖', title: 'AI-beeldgeneratie', description: 'Midjourney, DALL-E en Firefly voor campagnes en conceptvisualisaties' },
  { emoji: '💻', title: 'AI-Vibecoding', description: 'Bouwen van tools en apps via AI zonder traditioneel programmeren' },
  { emoji: '⚙️', title: 'AI-workflows', description: 'Automatisering via Make, Power Automate en GPT-integraties' },
  { emoji: '🎓', title: 'Stagebegeleiding', description: 'Begeleiding en coaching van stagiairs' },
  { emoji: '🐾', title: 'EduPet huisstijl bewaking', description: 'Bewaken van merkidentiteit en huisstijlconsistentie voor EduPet' },
  { emoji: '🖨️', title: 'DTP-werk', description: 'Opmaak en aanlevering van drukklare bestanden voor alle uitingen' },
  { emoji: '🗃️', title: 'Displaydesign', description: 'Ontwerp van vrijstaande displays, palletdisplays en retail fixtures' },
];

const SpecialisatiesPanel: React.FC = () => {
  const [dbSkills, setDbSkills] = useState<SkillCard[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [emoji, setEmoji] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadDbSkills = useCallback(async () => {
    const { data } = await (supabase as any).from('overdracht_skills').select('*');
    if (data) {
      setDbSkills(data.map((s: any) => ({
        id: s.id,
        emoji: s.emoji || '⭐',
        title: s.title,
        description: s.description || '',
        fromDb: true,
      })));
    }
  }, []);

  useEffect(() => { loadDbSkills(); }, [loadDbSkills]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await (supabase as any).from('overdracht_skills').insert({
      emoji: emoji.trim() || '⭐',
      title: title.trim(),
      description: description.trim() || null,
    });
    setSaving(false);
    setEmoji(''); setTitle(''); setDescription('');
    setModalOpen(false);
    loadDbSkills();
  };

  const allSkills = [...HARDCODED_SKILLS, ...dbSkills];

  const inputClass = "w-full bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Mijn capaciteiten en expertise</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-1.5 bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
          style={{ transition: 'opacity 0.2s' }}
        >
          + Expertise toevoegen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allSkills.map((skill, idx) => (
          <div key={skill.id || `hc-${idx}`} className="rounded-none bg-card shadow-card p-4 flex items-start gap-3">
            <span className="text-2xl shrink-0">{skill.emoji}</span>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-foreground">{skill.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={v => !v && setModalOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Expertise toevoegen</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input placeholder="Emoji (bijv. 🎯)" value={emoji} onChange={e => setEmoji(e.target.value)} className={inputClass} />
            <input placeholder="Titel *" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
            <textarea placeholder="Omschrijving" value={description} onChange={e => setDescription(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
            <button onClick={handleSave} disabled={!title.trim() || saving}
              className="w-full py-2 bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50"
              style={{ transition: 'opacity 0.2s' }}>
              {saving ? 'Opslaan...' : 'Opslaan'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecialisatiesPanel;
