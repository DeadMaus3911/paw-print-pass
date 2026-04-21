import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError('Onjuiste e-mail of wachtwoord');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground shadow-card">
        <div className="max-w-[860px] mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label="paw">🐾</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">Overdracht Maurice Laval</h1>
            <p className="text-sm opacity-80">Prins Petfoods</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-card shadow-card p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="text-5xl">🐾</div>
            <h2 className="text-xl font-bold text-foreground">Inloggen</h2>
            <p className="text-sm text-muted-foreground">Prins Petfoods Overdracht</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-foreground">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-3 py-2 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Wachtwoord</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-3 py-2 bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Bezig…' : 'Inloggen'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
