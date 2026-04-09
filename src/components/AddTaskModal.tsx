import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CATEGORIES = [
  'Projecten en opdrachten',
  'Veterinair materiaal',
  'Displays en offertes',
  'Systemen en bestanden',
];

const PRIORITIES = ['Hoog', 'Gemiddeld', 'Laag'];

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: {
    id: string;
    title: string;
    description: string;
    category: string;
    deadline?: string;
    priority?: string;
    involved?: string;
  }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Gemiddeld');
  const [involved, setInvolved] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      deadline: deadline || undefined,
      priority,
      involved: involved.trim() || undefined,
    });
    setTitle(''); setDescription(''); setCategory(CATEGORIES[0]); setDeadline(''); setPriority('Gemiddeld'); setInvolved('');
    onClose();
  };

  const inputClass = "w-full bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border";

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Taak toevoegen</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input placeholder="Titel *" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
          <textarea placeholder="Omschrijving" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
          <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputClass} />
          <select value={priority} onChange={e => setPriority(e.target.value)} className={inputClass}>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input placeholder="Betrokkenen" value={involved} onChange={e => setInvolved(e.target.value)} className={inputClass} />
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full py-2 bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50"
            style={{ transition: 'opacity 0.2s' }}
          >
            Toevoegen
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
