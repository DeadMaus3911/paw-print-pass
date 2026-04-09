import React from 'react';

interface Specialty {
  icon: string;
  title: string;
  description: string;
  steps: string[];
  involved: string[];
}

const SPECIALTIES: Specialty[] = [
  {
    icon: '📊',
    title: 'Social Media Analytics',
    description: 'Maandelijkse rapportage en analyse van alle social media kanalen.',
    steps: [
      'Login op Sprout Social met het team-account',
      'Exporteer maandrapport onder "Reports > Custom"',
      'Deel het rapport via Teams met het marketing team',
    ],
    involved: ['Jan de Vries', 'Lisa Bakker'],
  },
  {
    icon: '🖨️',
    title: 'POS en drukwerk aanleveren',
    description: 'Regulier drukwerk gaat via HelloPrint.com. Axent Reclame is alleen voor maatwerk signing, canvassen en magneetplaten.',
    steps: [
      'Maak drukklare PDF aan volgens de specs van HelloPrint',
      'Bestel via HelloPrint.com met het bedrijfsaccount',
      'Voor maatwerk signing en canvassen: neem contact op met Gerard van Axent Reclame',
    ],
    involved: ['Mathieu', 'Gerard van de Bovenkamp'],
  },
];

interface SkillCard {
  emoji: string;
  title: string;
  description: string;
}

const SKILLS: SkillCard[] = [
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
  return (
    <div className="space-y-8">
      {/* Werkwijzen */}
      <div className="space-y-4">
        {SPECIALTIES.map(spec => (
          <div key={spec.title} className="rounded-none bg-card shadow-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{spec.icon}</span>
              <h3 className="font-bold text-foreground">{spec.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{spec.description}</p>
            <ul className="space-y-1.5">
              {spec.steps.map((step, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-accent mt-0.5">→</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground">Betrokken:</span>
              {spec.involved.map(name => (
                <span key={name} className="text-xs px-2 py-0.5 rounded-none bg-secondary text-secondary-foreground font-medium">
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Capaciteiten en expertise */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Mijn capaciteiten en expertise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SKILLS.map(skill => (
            <div key={skill.title} className="rounded-none bg-card shadow-card p-4 flex items-start gap-3">
              <span className="text-2xl shrink-0">{skill.emoji}</span>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm text-foreground">{skill.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{skill.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialisatiesPanel;
