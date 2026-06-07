'use client';
import { useState } from 'react';

const S = {
  wrap: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #050d0a 0%, #0a1a14 50%, #050d0a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'DM Sans', 'Inter', sans-serif",
  },
  card: {
    background: '#111816',
    border: '1px solid rgba(16,185,129,0.15)',
    borderRadius: '20px',
    padding: '48px 40px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
  },
  logo: {
    fontSize: '36px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  appName: {
    textAlign: 'center',
    fontSize: '22px',
    fontWeight: 700,
    color: '#10b981',
    letterSpacing: '-0.02em',
    marginBottom: '4px',
  },
  tagline: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#4b6a5e',
    marginBottom: '40px',
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#eeeef2',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  stepDesc: {
    fontSize: '14px',
    color: '#6b8f7e',
    marginBottom: '32px',
    lineHeight: 1.6,
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b8f7e',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#0d1e18',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '10px',
    color: '#eeeef2',
    fontSize: '15px',
    outline: 'none',
    marginBottom: '20px',
    transition: 'border-color 0.2s',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: '#10b981',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background 0.2s',
    letterSpacing: '-0.01em',
  },
  btnSecondary: {
    width: '100%',
    padding: '13px',
    background: 'transparent',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '10px',
    color: '#6b8f7e',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s',
  },
  progress: {
    display: 'flex',
    gap: '6px',
    marginBottom: '36px',
  },
  dot: (active, done) => ({
    flex: 1,
    height: '3px',
    borderRadius: '2px',
    background: done ? '#10b981' : active ? '#10b981' : 'rgba(16,185,129,0.15)',
    opacity: done ? 1 : active ? 0.8 : 1,
    transition: 'all 0.3s',
  }),
  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: '#0d1e18',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '10px',
    color: '#eeeef2',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '20px',
    resize: 'vertical',
    minHeight: '100px',
    lineHeight: 1.6,
    fontFamily: 'inherit',
  },
  hint: {
    fontSize: '12px',
    color: '#3d6055',
    marginTop: '-14px',
    marginBottom: '20px',
  },
  motivationChip: (selected) => ({
    padding: '8px 14px',
    borderRadius: '20px',
    border: `1px solid ${selected ? '#10b981' : 'rgba(16,185,129,0.15)'}`,
    background: selected ? 'rgba(16,185,129,0.12)' : 'transparent',
    color: selected ? '#10b981' : '#6b8f7e',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    margin: '4px',
  }),
};

const MOTIVATION_PRESETS = [
  'Ma santé', 'Mes enfants', 'Économiser', 'Ma liberté',
  'Le sport', 'Mon partenaire', 'Ma longévité', 'Ma fierté',
];

export default function Onboarding({ onSetup }) {
  const [step, setStep] = useState(0);
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [data, setData] = useState({
    name: '',
    quitDate: todayStr,
    quitTime: timeStr,
    cigarettesPerDay: '10',
    pricePerPack: '11.50',
    cigarettesPerPack: '20',
    motivation: '',
    motivationChips: [],
  });

  const set = (key, val) => setData(d => ({ ...d, [key]: val }));

  const toggleChip = (chip) => {
    set('motivationChips', data.motivationChips.includes(chip)
      ? data.motivationChips.filter(c => c !== chip)
      : [...data.motivationChips, chip]
    );
  };

  const handleSubmit = () => {
    const quitAt = new Date(`${data.quitDate}T${data.quitTime}`).getTime();
    const motivation = [
      ...data.motivationChips,
      ...(data.motivation.trim() ? [data.motivation.trim()] : [])
    ].join(', ');
    onSetup({
      name: data.name.trim() || 'Toi',
      quitAt,
      cigarettesPerDay: parseFloat(data.cigarettesPerDay) || 10,
      pricePerPack: parseFloat(data.pricePerPack) || 11.5,
      cigarettesPerPack: parseFloat(data.cigarettesPerPack) || 20,
      motivation: motivation || 'Ma santé',
      cravings: [],
    });
  };

  const steps = [
    {
      title: 'Bonjour, brave personne !',
      desc: 'On va créer ensemble ton parcours personnalisé pour arrêter de fumer. Ça prend 2 minutes.',
      content: (
        <>
          <label style={S.label}>Ton prénom</label>
          <input
            style={S.input}
            placeholder="Ex : Emma"
            value={data.name}
            onChange={e => set('name', e.target.value)}
            autoFocus
          />
        </>
      ),
      canNext: true,
    },
    {
      title: 'Quand as-tu arrêté ?',
      desc: 'Si tu n\'as pas encore arrêté, choisis maintenant — c\'est le moment !',
      content: (
        <>
          <label style={S.label}>Date de la dernière cigarette</label>
          <input
            type="date"
            style={S.input}
            value={data.quitDate}
            max={todayStr}
            onChange={e => set('quitDate', e.target.value)}
          />
          <label style={S.label}>Heure</label>
          <input
            type="time"
            style={S.input}
            value={data.quitTime}
            onChange={e => set('quitTime', e.target.value)}
          />
        </>
      ),
      canNext: !!data.quitDate && !!data.quitTime,
    },
    {
      title: 'Ton profil de fumeur',
      desc: 'Ces données servent à calculer tes économies et les cigarettes que tu n\'as pas fumées.',
      content: (
        <>
          <div style={S.row}>
            <div>
              <label style={S.label}>Cig. par jour</label>
              <input
                type="number"
                style={S.input}
                min="1"
                max="100"
                value={data.cigarettesPerDay}
                onChange={e => set('cigarettesPerDay', e.target.value)}
              />
            </div>
            <div>
              <label style={S.label}>Cig. par paquet</label>
              <input
                type="number"
                style={S.input}
                min="1"
                max="30"
                value={data.cigarettesPerPack}
                onChange={e => set('cigarettesPerPack', e.target.value)}
              />
            </div>
          </div>
          <label style={S.label}>Prix d'un paquet (€)</label>
          <input
            type="number"
            style={S.input}
            min="1"
            step="0.5"
            value={data.pricePerPack}
            onChange={e => set('pricePerPack', e.target.value)}
          />
          <p style={S.hint}>Prix moyen en France : 11,50 €</p>
        </>
      ),
      canNext: data.cigarettesPerDay > 0 && data.pricePerPack > 0,
    },
    {
      title: 'Ta motivation',
      desc: 'Pourquoi veux-tu arrêter ? Cette raison t\'aidera dans les moments difficiles.',
      content: (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px' }}>
            {MOTIVATION_PRESETS.map(chip => (
              <button
                key={chip}
                style={S.motivationChip(data.motivationChips.includes(chip))}
                onClick={() => toggleChip(chip)}
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
          <label style={S.label}>Ajoute ta propre raison (optionnel)</label>
          <textarea
            style={S.textarea}
            placeholder="Ex : Je veux voir mes petits-enfants grandir..."
            value={data.motivation}
            onChange={e => set('motivation', e.target.value)}
          />
        </>
      ),
      canNext: data.motivationChips.length > 0 || data.motivation.trim().length > 0,
    },
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.logo}>🚭</div>
        <div style={S.appName}>SansCigarette</div>
        <div style={S.tagline}>Gratuit. Pour toujours. Pour toi.</div>

        <div style={S.progress}>
          {steps.map((_, i) => (
            <div key={i} style={S.dot(i === step, i < step)} />
          ))}
        </div>

        <div style={S.stepTitle}>{currentStep.title}</div>
        <div style={S.stepDesc}>{currentStep.desc}</div>

        {currentStep.content}

        {isLast ? (
          <button
            style={{ ...S.btnPrimary, background: data.motivationChips.length > 0 || data.motivation.trim() ? '#10b981' : '#1a3d30' }}
            onClick={handleSubmit}
          >
            🚀 Commencer mon parcours
          </button>
        ) : (
          <button
            style={{ ...S.btnPrimary, background: currentStep.canNext ? '#10b981' : '#1a3d30' }}
            onClick={handleNext}
            disabled={!currentStep.canNext}
          >
            Continuer →
          </button>
        )}

        {step > 0 && (
          <button style={S.btnSecondary} onClick={() => setStep(s => s - 1)}>
            ← Retour
          </button>
        )}
      </div>
    </div>
  );

  function handleNext() {
    if (currentStep.canNext) setStep(s => s + 1);
  }
}
