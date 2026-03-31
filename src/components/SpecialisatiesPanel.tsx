import React from 'react';

interface Specialty {
  icon: string;
  title: string;
  description: string;
  steps: string[];
  involved: string[];
}

const PLACEHOLDER_SPECIALTIES: Specialty[] = [
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
];

const SpecialisatiesPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      {PLACEHOLDER_SPECIALTIES.map(spec => (
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
  );
};

export default SpecialisatiesPanel;
