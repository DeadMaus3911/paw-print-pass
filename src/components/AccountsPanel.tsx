import React, { useState } from 'react';

const CORRECT_PIN = '1963';

interface VaultEntry {
  icon: string;
  service: string;
  username: string;
  password: string;
  notes: string;
}

const VAULT: VaultEntry[] = [
  {
    icon: '📱',
    service: 'Sprout Social',
    username: 'prins.team@prinspetfoods.nl',
    password: 'S3cur3Pass!',
    notes: 'Gedeeld team-account. MFA via Maurice\'s telefoon — moet worden overgedragen.',
  },
  {
    icon: '🎨',
    service: 'Canva',
    username: 'maurice@prinspetfoods.nl',
    password: 'CanvaPass!',
    notes: 'Account gekoppeld aan Maurice. Toegang overdragen aan nieuw teamlid.',
  },
  {
    icon: '🖨️',
    service: 'HelloPrint',
    username: 'Bedrijfsaccount Prins Petfoods',
    password: '—',
    notes: 'Inloggegevens al bekend bij collega\'s.',
  },
];

const AccountsPanel: React.FC = () => {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleDigit = (d: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + d;
    setPin(newPin);
    setError(false);
    if (newPin.length === 4) {
      if (newPin === CORRECT_PIN) {
        setUnlocked(true);
      } else {
        setError(true);
        setTimeout(() => { setPin(''); setError(false); }, 800);
      }
    }
  };

  const handleDelete = () => setPin(p => p.slice(0, -1));

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="text-4xl">🔒</div>
        <h3 className="font-bold text-foreground text-lg">Voer PIN in</h3>
        <div className="flex gap-3">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-colors ${
                i < pin.length
                  ? error ? 'bg-destructive' : 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 w-56">
          {['1','2','3','4','5','6','7','8','9','',0,'⌫'].map((d, i) => (
            <button
              key={i}
              onClick={() => {
                if (d === '⌫') handleDelete();
                else if (d !== '') handleDigit(String(d));
              }}
              disabled={d === ''}
              className={`h-14 rounded-none text-lg font-bold transition-colors ${
                d === ''
                  ? 'invisible'
                  : 'bg-card shadow-card text-foreground hover:bg-muted active:bg-secondary'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    );
  }

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
            <div><span className="font-medium text-foreground">Wachtwoord:</span> <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{entry.password}</code></div>
            <div><span className="font-medium text-foreground">Notitie:</span> {entry.notes}</div>
          </div>
        </div>
      ))}

      <button
        onClick={() => { setUnlocked(false); setPin(''); }}
        className="px-4 py-2 rounded-none bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        🔒 Vergrendelen
      </button>
    </div>
  );
};

export default AccountsPanel;
