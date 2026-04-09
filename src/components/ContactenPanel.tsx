import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AddContactModal from './AddContactModal';

interface Contact {
  id?: string;
  name: string;
  org: string;
  tag: string;
  initials: string;
  email?: string;
  phone?: string;
  note?: string;
  fromDb?: boolean;
}

const HARDCODED_CONTACTS: Contact[] = [
  { name: 'Gerard van de Bovenkamp', org: 'Axent Reclame', tag: 'Leverancier signing en maatwerk', initials: 'GB', email: 'gerard@axentreclame.nl', phone: '0318 555 322', note: 'Leverancier voor canvasdoeken Avonturia en magneetplaten Gezondheidsplein. Niet de algemene drukwerkleverancier.' },
  { name: 'Manouk Verheij', org: 'Avonturia', tag: 'Klant retail', initials: 'MV', email: 'manouk@avonturia.nl', note: 'Contactpersoon bij Avonturia. Loopt intern via Louisa en Kathy.' },
  { name: 'Roger Grinwis', org: 'ISDisplay / De Haan Group', tag: 'Leverancier displays', initials: 'RG', email: 'rogergrinwis@dehaangroup.nl', note: 'Verantwoordelijk voor palletdisplay, Highlighter en vriezerombouw.' },
  { name: 'Maurice van Gool', org: 'CartoFactory', tag: 'Leverancier displays', initials: 'MG', email: 'maurice@cartofactory.com', note: 'Offerte aangevraagd voor 25 export displays.' },
  { name: 'Patryk Krawiec', org: 'Eldrut POS', tag: 'Leverancier displays', initials: 'PK', email: 'p.krawiec@eldrut-pos.com', note: 'Offerte aangevraagd voor aluminium origami display.' },
  { name: 'HolBox', org: 'HolBox', tag: 'Leverancier displays', initials: 'HB', email: 'info@holbox.nl', note: 'Offerte aangevraagd voor 25 export displays.' },
  { name: 'Maxine Bongaerts', org: 'Holbox Shop Direct', tag: 'Leverancier displays', initials: 'MB', email: 'shopdirect@holbox.nl', phone: '+31 (0) 475 56 95 99', note: 'Morgenstraat 1, 6045 KB Roermond. Website: shopdirect.holbox.nl' },
  { name: 'Danique Nebbeling', org: 'Maxilia', tag: 'Accountmanager', initials: 'DN', email: 'reseller@maxilia.nl', phone: '0318 743 605' },
  { name: 'Joost Spek', org: 'Novad', tag: '3D packshots verpakkingen', initials: 'JS', phone: '(0343) 449 407', note: 'Creative director. Website: www.novad.nl' },
];

const ContactenPanel: React.FC = () => {
  const [dbContacts, setDbContacts] = useState<Contact[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadDbContacts = useCallback(async () => {
    const { data } = await supabase.from('overdracht_contacten').select('*');
    if (data) {
      setDbContacts(data.map((c: any) => ({
        id: c.id,
        name: c.name,
        org: c.org || '',
        tag: c.tag || '',
        initials: c.initials || c.name.slice(0, 2).toUpperCase(),
        email: c.email || undefined,
        phone: c.phone || undefined,
        note: c.note || undefined,
        fromDb: true,
      })));
    }
  }, []);

  useEffect(() => { loadDbContacts(); }, [loadDbContacts]);

  const allContacts = [...HARDCODED_CONTACTS, ...dbContacts];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-accent text-accent-foreground text-sm font-medium hover:opacity-90"
          style={{ transition: 'opacity 0.2s' }}
        >
          + Contact toevoegen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allContacts.map((contact, idx) => (
          <div key={contact.id || `hc-${idx}`} className="rounded-none bg-card shadow-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {contact.initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-foreground truncate">{contact.name}</div>
                <div className="text-xs text-muted-foreground truncate">{contact.org}</div>
              </div>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-none bg-secondary text-secondary-foreground text-xs font-medium">
              {contact.tag}
            </span>
            <div className="space-y-1 text-xs text-muted-foreground">
              {contact.email && <div>📧 <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></div>}
              {contact.phone && <div>📞 {contact.phone}</div>}
              {contact.note && <div>📝 {contact.note}</div>}
            </div>
          </div>
        ))}
      </div>

      <AddContactModal open={modalOpen} onClose={() => setModalOpen(false)} onAdded={loadDbContacts} />
    </div>
  );
};

export default ContactenPanel;
