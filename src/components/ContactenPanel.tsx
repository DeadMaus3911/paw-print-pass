import React from 'react';

interface Contact {
  name: string;
  organisation: string;
  role: string;
  email: string;
  phone: string;
  notes: string;
}

const PLACEHOLDER_CONTACTS: Contact[] = [
  {
    name: 'Jan de Vries',
    organisation: 'Prins Petfoods',
    role: 'Marketing Manager',
    email: 'jan@prinspetfoods.nl',
    phone: '+31 6 12345678',
    notes: 'Eerste aanspreekpunt voor campagnes.',
  },
];

const ContactenPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PLACEHOLDER_CONTACTS.map(contact => {
        const initials = contact.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        return (
          <div key={contact.email} className="rounded-none bg-card shadow-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-foreground truncate">{contact.name}</div>
                <div className="text-xs text-muted-foreground truncate">{contact.organisation}</div>
              </div>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-none bg-secondary text-secondary-foreground text-xs font-medium">
              {contact.role}
            </span>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>📧 <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></div>
              <div>📞 {contact.phone}</div>
              <div>📝 {contact.notes}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactenPanel;
