import React from 'react';

interface VaultEntry {
  icon: string;
  service: string;
  username: string;
  password: string;
  notes: string;
}

const VAULT: VaultEntry[] = [
  { icon: '🎨', service: 'Canva', username: 'maurice@prinspetfoods.nl', password: 'CCT-Bedankt2026', notes: 'Account gekoppeld aan Maurice. Toegang overdragen aan nieuw teamlid.' },
  { icon: '🖨️', service: 'HelloPrint', username: 'vormgeving@prinspetfoods.nl', password: 'Only4Prins!', notes: 'Bedrijfsaccount voor regulier drukwerk.' },
  { icon: '🎓', service: 'EduPet Academy', username: 'maurice@prinspetfoods.nl', password: 'H5YTzdUISNbM', notes: 'https://edupetacademy.nl/' },
  { icon: '🔊', service: 'ElevenLabs', username: 'maurice@prinspetfoods.nl', password: 'CCT-Bedankt2026', notes: 'https://elevenlabs.io/' },
  { icon: '🖨️', service: 'Drukwerkdeal', username: 'maurice@prinspetfoods.nl', password: 'Only4Prins!', notes: 'drukwerkdeal.nl' },
  { icon: '📰', service: 'Emerce', username: 'maurice@prinspetfoods.nl', password: 'Pr1ns2024!', notes: 'https://www.emerce.nl/' },
  { icon: '✏️', service: 'Figma', username: 'maurice@prinspetfoods.nl', password: 'Pantone28!', notes: 'Design tool.' },
  { icon: '🖼️', service: 'Freepik', username: 'vormgeving@prinspetfoods.nl', password: 'Only4Prins!', notes: 'freepik.com' },
  { icon: '🎞️', service: 'Giphy', username: 'maurice@prinspetfoods.nl', password: 'VU#x&n4rAe$RP%K', notes: 'GIF platform.' },
  { icon: '🖨️', service: 'Peterprint', username: 'vormgeving@edupet.nl', password: 'Edupet2022!', notes: 'peterprint.nl' },
  { icon: '🖨️', service: 'TTRepro', username: 'maurice@prinspetfoods.nl', password: '08163578', notes: 'Drukwerk/repro.' },
  { icon: '📦', service: 'Verzendverpakkingenshop', username: 'maurice@prinspetfoods.nl', password: 'CCT-Bedankt2026', notes: 'verzendverpakkingenshop.nl' },
];

const AccountsPanel: React.FC = () => {
  const [revealed, setRevealed] = React.useState<Set<string>>(new Set());

  const toggle = (service: string) => {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(service)) next.delete(service);
      else next.add(service);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-none bg-destructive/10 border border-destructive/30 p-3 flex items-center gap-2">
        <span className="text-destructive text-lg">⚠️</span>
        <span className="text-sm font-medium text-destructive">
          Vertrouwelijk — deel deze pagina niet via schermopnames
        </span>
      </div>

      {VAULT.map(entry => (
        <div key={entry.service} className="rounded-none bg-card shadow-card p-4 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{entry.icon}</span>
            <h3 className="font-bold text-foreground">{entry.service}</h3>
          </div>
          <div className="text-sm space-y-1 text-muted-foreground">
            <div><span className="font-medium text-foreground">Gebruiker:</span> {entry.username}</div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Wachtwoord:</span>
              {revealed.has(entry.service) ? (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{entry.password}</code>
              ) : (
                <span className="text-xs">••••••••</span>
              )}
              <button
                onClick={() => toggle(entry.service)}
                className="text-xs text-primary hover:underline ml-1"
              >
                {revealed.has(entry.service) ? '🙈 Verberg' : '👁️ Toon'}
              </button>
            </div>
            <div><span className="font-medium text-foreground">Notitie:</span> {entry.notes}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountsPanel;
