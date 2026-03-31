import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TakenPanel from '@/components/TakenPanel';
import ContactenPanel from '@/components/ContactenPanel';
import SpecialisatiesPanel from '@/components/SpecialisatiesPanel';
import AccountsPanel from '@/components/AccountsPanel';
import { useOverdracht } from '@/hooks/useOverdracht';

const TABS = [
  { id: 'taken', label: 'Taken & projecten' },
  { id: 'contacten', label: 'Contacten' },
  { id: 'specialisaties', label: 'Specialisaties' },
  { id: 'accounts', label: 'Accounts & toegang' },
] as const;

type TabId = typeof TABS[number]['id'];

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('taken');
  const overdracht = useOverdracht();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header xp={overdracht.xp} progress={overdracht.progress} levelLabel={overdracht.level.label} />

      <main className="max-w-[860px] mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-none text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-card'
                  : 'bg-card text-muted-foreground hover:bg-muted shadow-card'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        {activeTab === 'taken' && (
          <TakenPanel
            items={overdracht.items}
            toggleItem={overdracht.toggleItem}
            userName={overdracht.userName}
            setUserName={overdracht.setUserName}
            doneCount={overdracht.doneCount}
            streak={overdracht.streak}
            xp={overdracht.xp}
            totalItems={overdracht.totalItems}
          />
        )}
        {activeTab === 'contacten' && <ContactenPanel />}
        {activeTab === 'specialisaties' && <SpecialisatiesPanel />}
        {activeTab === 'accounts' && <AccountsPanel />}
      </main>

      <Footer
        levelLabel={overdracht.level.label}
        doneCount={overdracht.doneCount}
        onReset={overdracht.reset}
      />
    </div>
  );
};

export default Index;
