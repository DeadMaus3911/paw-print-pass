import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ open, onClose, onAdded }) => {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [tag, setTag] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    await supabase.from('overdracht_contacten').insert({
      name: name.trim(),
      org: org.trim() || null,
      tag: tag.trim() || null,
      initials,
      email: email.trim() || null,
      phone: phone.trim() || null,
      note: note.trim() || null,
    });

    setSaving(false);
    setName(''); setOrg(''); setTag(''); setEmail(''); setPhone(''); setNote('');
    onAdded();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact toevoegen</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input placeholder="Naam *" value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border" />
          <input placeholder="Organisatie" value={org} onChange={e => setOrg(e.target.value)}
            className="w-full bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border" />
          <input placeholder="Rol / tag" value={tag} onChange={e => setTag(e.target.value)}
            className="w-full bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border" />
          <input placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border" />
          <input placeholder="Telefoon" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border" />
          <textarea placeholder="Notities" value={note} onChange={e => setNote(e.target.value)} rows={2}
            className="w-full bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border resize-none" />
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full py-2 bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 disabled:opacity-50"
            style={{ transition: 'opacity 0.2s' }}
          >
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactModal;
