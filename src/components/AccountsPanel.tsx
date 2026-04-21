import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VaultEntry {
  icon: string;
  service: string;
  username: string;
  password: string;
  notes: string;
}

const VAULT: VaultEntry[] = [
  {
    icon: '🎨',
    service: 'Canva',
    username: 'maurice@prinspetfoods.nl',
    password: 'CCT-Bedankt2026',
    notes: 'Account gekoppeld aan Maurice. Toegang overdragen aan nieuw teamlid.',
  },
  {
    icon: '🖨️',
    service: 'HelloPrint',
    username: 'vormgeving@prinspetfoods.nl',
    password: 'Only4Prins!',
    notes: 'Bedrijfsaccount voor regulier drukwerk.',
  },
  {
    icon: '🎓',
    service: 'EduPet Academy',
    username: 'maurice@prinspetfoods.nl',
    password: 'H5YTzdUISNbM',
    notes: 'https://edupetacademy.nl/',
  },
  {
    icon: '🔊',
    service: 'ElevenLabs',
    username: 'maurice@prinspetfoods.nl',
    password: 'CCT-Bedankt2026',
    notes: 'https://elevenlabs.io/',
  },
  {
    icon: '🖨️',
    service: 'Drukwerkdeal',
    username: 'maurice@prinspetfoods.nl',
    password: 'Only4Prins!',
    notes: 'drukwerkdeal.nl',
  },
  {
    icon: '📰',
    service: 'Emerce',
    username: 'maurice@prinspetfoods.nl',
    password: 'Pr1ns2024!',
    notes: 'https://www.emerce.nl/',
  },
  {
    icon: '✏️',
    service: 'Figma',
    username: 'maurice@prinspetfoods.nl',
    password: 'Pantone28!',
    notes: 'Design tool.',
  },
  {
    icon: '🖼️',
    service: 'Freepik',
    username: 'vormgeving@prinspetfoods.nl',
    password: 'Only4Prins!',
    notes: 'freepik.com',
  },
  {
    icon: '🎞️',
    service: 'Giphy',
    username: 'maurice@prinspetfoods.nl',
    password: 'VU#x&n4rAe$RP%K',
    notes: 'GIF platform.',
  },
  {
    icon: '🖨️',
    service: 'Peterprint',
    username: 'vormgeving@edupet.nl',
    password: 'Edupet2022!',
    notes: 'peterprint.nl',
  },
  {
    icon: '🖨️',
    service: 'TTRepro',
    username: 'maurice@prinspetfoods.nl',
    password: '08163578',
    notes: 'Drukwerk/repro.',
  },
  {
    icon: '📦',
    service: 'Verzendverpakkingenshop',
    username: 'maurice@prinspetfoods.nl',
    password: 'CCT-Bedankt2026',
    notes: 'verzendverpakkingenshop.nl',
  },
];

const PinPad: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleDigit = async (d: string) => {
    if (pin.length >= 4 || checking) return;
    const newPin = pin + d;
    setPin(newPin);
    setError(false);
    if (newPin.length === 4) {
      setChecking(true);
      try {
        const { data, error: dbError } = await supabase
          .from('overdracht_config')
          .select('value')
          .eq('key', 'vault_pin')
          .maybeSingle();
        if (dbError) throw dbError;
        if (data && newPin === data.value) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => { setPin(''); setError(false); }, 800);
        }
      } catch {
        setError(true);
        setTimeout(() => { setPin(''); setError(false); }, 800);
      } finally {
        setChecking(false);
      }
    }
  };

  const handleDelete = () => setPin(p => p.slice(0, -1));

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-5">
      <div className="text-3xl">🔒</div>
      <h3 className="font-bold text-foreground text-base">Voer PIN in</h3>
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
};

const AccountsPanel: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());
  const [pendingReveal, setPendingReveal] = useState<string | null>(null);

  const handleRevealPassword = (service: string) => {
    if (revealedPasswords.has(service)) {
      // Hide it again
      setRevealedPasswords(prev => {
        const next = new Set(prev);
        next.delete(service);
        return next;
      });
    } else {
      setPendingReveal(service);
    }
  };

  const handlePinSuccess = () => {
    if (pendingReveal) {
      setRevealedPasswords(prev => new Set(prev).add(pendingReveal));
      setPendingReveal(null);
    } else {
      setUnlocked(true);
    }
  };

  if (!unlocked) {
    return <PinPad onSuccess={handlePinSuccess} />;
  }

  if (pendingReveal) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setPendingReveal(null)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Terug
        </button>
        <p className="text-sm text-center text-muted-foreground">
          Voer PIN in om wachtwoord van <strong>{pendingReveal}</strong> te zien
        </p>
        <PinPad onSuccess={handlePinSuccess} />
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
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Wachtwoord:</span>
              {revealedPasswords.has(entry.service) ? (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{entry.password}</code>
              ) : (
                <span className="text-xs">••••••••</span>
              )}
              <button
                onClick={() => handleRevealPassword(entry.service)}
                className="text-xs text-primary hover:underline ml-1"
              >
                {revealedPasswords.has(entry.service) ? '🙈 Verberg' : '👁️ Toon'}
              </button>
            </div>
            <div><span className="font-medium text-foreground">Notitie:</span> {entry.notes}</div>
          </div>
        </div>
      ))}

      <button
        onClick={() => { setUnlocked(false); setRevealedPasswords(new Set()); }}
        className="px-4 py-2 rounded-none bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        🔒 Vergrendelen
      </button>
    </div>
  );
};

export default AccountsPanel;
