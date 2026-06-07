'use client';
import { useState, useEffect, useCallback } from 'react';
import { MILESTONES, TIPS, ACHIEVEMENTS } from './milestones';

/* ── helpers ── */
function elapsed(quitAt) {
  return Math.max(0, Date.now() - quitAt);
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return { d, h, m, s };
}

function formatMoney(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── styles ── */
const C = {
  emerald: '#10b981',
  emeraldDim: 'rgba(16,185,129,0.15)',
  emeraldBorder: 'rgba(16,185,129,0.25)',
  bg: '#070d0a',
  bgCard: '#0f1e18',
  bgCardHover: '#132318',
  border: 'rgba(16,185,129,0.1)',
  borderMid: 'rgba(16,185,129,0.18)',
  text: '#eeeef2',
  textSec: '#6b8f7e',
  textMut: '#3d6055',
};

const card = (extra = {}) => ({
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: '16px',
  padding: '24px',
  ...extra,
});

/* ── Craving modal ── */
function CravingModal({ onClose, onResisted }) {
  const [phase, setPhase] = useState('tips'); // 'tips' | 'breathe'
  const [breathStep, setBreathStep] = useState(0); // 0=inhale,1=hold,2=exhale
  const [breathSec, setBreathSec] = useState(4);
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [tip2Idx] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => {
    if (phase !== 'breathe') return;
    const sequence = [
      { label: 'Inspire', seconds: 4 },
      { label: 'Retiens', seconds: 7 },
      { label: 'Expire', seconds: 8 },
    ];
    let step = breathStep;
    let remaining = sequence[step].seconds;
    setBreathSec(remaining);

    const interval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        step = (step + 1) % 3;
        setBreathStep(step);
        remaining = sequence[step].seconds;
      }
      setBreathSec(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, breathStep]);

  const breathLabels = ['Inspire...', 'Retiens...', 'Expire lentement...'];
  const breathColors = ['#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px',
    }}>
      <div style={{
        background: '#0f1e18', border: `1px solid ${C.emeraldBorder}`,
        borderRadius: '20px', padding: '36px', maxWidth: '440px', width: '100%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
      }}>
        <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '8px' }}>💪</div>
        <h2 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '4px' }}>
          Tiens bon !
        </h2>
        <p style={{ textAlign: 'center', fontSize: '13px', color: C.textSec, marginBottom: '28px' }}>
          L'envie dure en moyenne <strong style={{ color: C.emerald }}>3 à 5 minutes</strong>. Tu peux le faire.
        </p>

        {phase === 'tips' && (
          <>
            <div style={{ background: C.emeraldDim, borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
              <p style={{ fontSize: '14px', color: C.text, lineHeight: 1.6 }}>💡 {TIPS[tipIdx]}</p>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: C.text, lineHeight: 1.6 }}>✨ {TIPS[tip2Idx]}</p>
            </div>
            <button
              onClick={() => setPhase('breathe')}
              style={{
                width: '100%', padding: '13px', background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)', borderRadius: '10px',
                color: '#93c5fd', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: '10px',
              }}
            >
              🧘 Exercice de respiration 4-7-8
            </button>
          </>
        )}

        {phase === 'breathe' && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 20px',
              border: `4px solid ${breathColors[breathStep]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', fontWeight: 700, color: breathColors[breathStep],
              transition: 'border-color 0.5s, color 0.5s',
              boxShadow: `0 0 30px ${breathColors[breathStep]}40`,
            }}>
              {breathSec}
            </div>
            <p style={{ fontSize: '18px', fontWeight: 600, color: breathColors[breathStep], transition: 'color 0.5s' }}>
              {breathLabels[breathStep]}
            </p>
            <p style={{ fontSize: '12px', color: C.textMut, marginTop: '8px' }}>
              Inspire 4s → Retiens 7s → Expire 8s
            </p>
            <button
              onClick={() => setPhase('tips')}
              style={{
                marginTop: '16px', padding: '8px 20px', background: 'transparent',
                border: `1px solid ${C.border}`, borderRadius: '8px',
                color: C.textSec, fontSize: '12px', cursor: 'pointer',
              }}
            >
              ← Retour aux conseils
            </button>
          </div>
        )}

        <button
          onClick={onResisted}
          style={{
            width: '100%', padding: '14px', background: C.emerald,
            border: 'none', borderRadius: '10px', color: 'white',
            fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px',
          }}
        >
          🎉 J'ai résisté !
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '11px', background: 'transparent',
            border: `1px solid ${C.border}`, borderRadius: '10px',
            color: C.textSec, fontSize: '13px', cursor: 'pointer',
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

/* ── Settings modal ── */
function SettingsModal({ profile, onSave, onClose, onReset }) {
  const [d, setD] = useState({
    name: profile.name,
    cigarettesPerDay: String(profile.cigarettesPerDay),
    pricePerPack: String(profile.pricePerPack),
    cigarettesPerPack: String(profile.cigarettesPerPack),
    motivation: profile.motivation,
  });
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    onSave({
      name: d.name || 'Toi',
      cigarettesPerDay: parseFloat(d.cigarettesPerDay) || profile.cigarettesPerDay,
      pricePerPack: parseFloat(d.pricePerPack) || profile.pricePerPack,
      cigarettesPerPack: parseFloat(d.cigarettesPerPack) || profile.cigarettesPerPack,
      motivation: d.motivation || profile.motivation,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px',
    }}>
      <div style={{
        background: '#0f1e18', border: `1px solid ${C.emeraldBorder}`,
        borderRadius: '20px', padding: '36px', maxWidth: '440px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '24px' }}>
          ⚙️ Paramètres
        </h2>

        {[
          { label: 'Ton prénom', key: 'name', type: 'text', placeholder: 'Emma' },
          { label: 'Cigarettes par jour', key: 'cigarettesPerDay', type: 'number' },
          { label: 'Prix du paquet (€)', key: 'pricePerPack', type: 'number', step: '0.5' },
          { label: 'Cigarettes par paquet', key: 'cigarettesPerPack', type: 'number' },
        ].map(({ label, key, type, placeholder, step }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: C.textMut, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              {label}
            </label>
            <input
              type={type}
              step={step}
              placeholder={placeholder}
              value={d[key]}
              onChange={e => set(key, e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', background: '#0a1810',
                border: `1px solid ${C.borderMid}`, borderRadius: '8px',
                color: C.text, fontSize: '14px', outline: 'none', marginBottom: '16px',
              }}
            />
          </div>
        ))}

        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: C.textMut, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
          Ta motivation
        </label>
        <textarea
          value={d.motivation}
          onChange={e => set('motivation', e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', background: '#0a1810',
            border: `1px solid ${C.borderMid}`, borderRadius: '8px',
            color: C.text, fontSize: '14px', outline: 'none', marginBottom: '24px',
            resize: 'vertical', minHeight: '80px', fontFamily: 'inherit',
          }}
        />

        <button onClick={handleSave} style={{
          width: '100%', padding: '13px', background: C.emerald,
          border: 'none', borderRadius: '10px', color: 'white',
          fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginBottom: '10px',
        }}>
          Enregistrer
        </button>
        <button onClick={onClose} style={{
          width: '100%', padding: '11px', background: 'transparent',
          border: `1px solid ${C.border}`, borderRadius: '10px',
          color: C.textSec, fontSize: '13px', cursor: 'pointer', marginBottom: '10px',
        }}>
          Annuler
        </button>
        <button onClick={onReset} style={{
          width: '100%', padding: '11px', background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px',
          color: '#f87171', fontSize: '13px', cursor: 'pointer',
        }}>
          🗑️ Réinitialiser l'application
        </button>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function Dashboard({ profile, onUpdate, onReset }) {
  const [now, setNow] = useState(Date.now());
  const [showCraving, setShowCraving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'milestones' | 'history'
  const [newAchievement, setNewAchievement] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const ms = elapsed(profile.quitAt);
  const totalMinutes = ms / 60000;
  const { d, h, m, s } = formatDuration(ms);

  const cigsNotSmoked = Math.floor((totalMinutes / 1440) * profile.cigarettesPerDay);
  const moneySaved = (cigsNotSmoked / profile.cigarettesPerPack) * profile.pricePerPack;
  const lifeGained = Math.floor(cigsNotSmoked * 11); // minutes (~11 min per cigarette)
  const lifeHours = Math.floor(lifeGained / 60);
  const lifeDays = Math.floor(lifeHours / 24);

  const unlockedMilestones = MILESTONES.filter(ml => totalMinutes >= ml.minutes);
  const nextMilestone = MILESTONES.find(ml => totalMinutes < ml.minutes);
  const nextProgress = nextMilestone
    ? Math.min(100, (totalMinutes / nextMilestone.minutes) * 100)
    : 100;

  const unlockedAchievements = ACHIEVEMENTS.filter(a => totalMinutes >= a.minutes);

  const handleResisted = useCallback(() => {
    const craving = { id: Date.now(), date: Date.now() };
    const cravings = [...(profile.cravings || []), craving];
    onUpdate({ cravings });
    setShowCraving(false);
  }, [profile.cravings, onUpdate]);

  const cravings = profile.cravings || [];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'DM Sans','Inter',sans-serif" }}>
      {/* Header */}
      <header style={{
        background: '#0a1810', borderBottom: `1px solid ${C.border}`,
        padding: '0 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '56px', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>🚭</span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: C.emerald, letterSpacing: '-0.02em' }}>
            SansCigarette
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: C.textSec }}>
            Bonjour, <strong style={{ color: C.text }}>{profile.name}</strong> 👋
          </span>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              background: 'transparent', border: `1px solid ${C.border}`,
              borderRadius: '8px', padding: '6px 10px', color: C.textSec,
              fontSize: '13px', cursor: 'pointer',
            }}
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <nav style={{
        background: '#0a1810', borderBottom: `1px solid ${C.border}`,
        display: 'flex', padding: '0 24px',
      }}>
        {[
          { key: 'dashboard', label: '🏠 Accueil' },
          { key: 'milestones', label: '🫁 Santé' },
          { key: 'history', label: `💪 Envies (${cravings.length})` },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '12px 16px', border: 'none', background: 'transparent',
              color: activeTab === key ? C.emerald : C.textSec,
              fontSize: '13px', fontWeight: activeTab === key ? 600 : 400,
              cursor: 'pointer', borderBottom: `2px solid ${activeTab === key ? C.emerald : 'transparent'}`,
              marginBottom: '-1px', transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && (
          <>
            {/* Hero timer */}
            <div style={{ ...card(), textAlign: 'center', marginBottom: '16px', background: 'linear-gradient(135deg, #0a1e18 0%, #0f2a1c 100%)', border: `1px solid ${C.emeraldBorder}` }}>
              <p style={{ fontSize: '13px', color: C.textSec, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Sans tabac depuis
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {[
                  { val: d, label: 'jours' },
                  { val: h, label: 'heures' },
                  { val: m, label: 'min' },
                  { val: s, label: 'sec' },
                ].map(({ val, label }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{
                      background: C.emeraldDim, border: `1px solid ${C.emeraldBorder}`,
                      borderRadius: '12px', padding: '12px 18px', minWidth: '70px',
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 800, color: C.emerald, lineHeight: 1, letterSpacing: '-0.03em' }}>
                        {String(val).padStart(2, '0')}
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: C.textMut, marginTop: '5px', fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>
              {nextMilestone && (
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: C.textSec }}>
                      Prochain : {nextMilestone.icon} {nextMilestone.title}
                    </span>
                    <span style={{ fontSize: '12px', color: C.emerald, fontWeight: 600 }}>
                      {Math.round(nextProgress)}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: C.emeraldDim, borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${nextProgress}%`,
                      background: `linear-gradient(90deg, #059669, ${C.emerald})`,
                      borderRadius: '3px', transition: 'width 1s',
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <StatCard
                icon="🚬" label="Cigarettes non fumées"
                value={cigsNotSmoked.toLocaleString('fr-FR')}
                sub="cigarettes évitées"
                color="#f43f5e"
              />
              <StatCard
                icon="💰" label="Argent économisé"
                value={`${formatMoney(moneySaved)} €`}
                sub={`soit ${Math.floor(moneySaved / profile.pricePerPack)} paquets`}
                color="#f59e0b"
              />
              <StatCard
                icon="⏳" label="Vie regagnée"
                value={lifeDays > 0 ? `${lifeDays}j ${lifeHours % 24}h` : `${lifeHours}h ${lifeGained % 60}min`}
                sub="de vie récupérée (~11 min/cig)"
                color="#3b82f6"
              />
            </div>

            {/* Achievements unlocked */}
            {unlockedAchievements.length > 0 && (
              <div style={{ ...card(), marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: C.text, marginBottom: '16px' }}>
                  🏅 Badges débloqués ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {ACHIEVEMENTS.map(a => {
                    const unlocked = totalMinutes >= a.minutes;
                    return (
                      <div key={a.id} title={a.desc} style={{
                        padding: '8px 14px', borderRadius: '20px',
                        background: unlocked ? C.emeraldDim : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${unlocked ? C.emeraldBorder : C.border}`,
                        display: 'flex', alignItems: 'center', gap: '6px',
                        opacity: unlocked ? 1 : 0.4,
                        transition: 'all 0.3s',
                      }}>
                        <span style={{ fontSize: '16px', filter: unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: unlocked ? C.emerald : C.textMut }}>
                          {a.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Motivation */}
            <div style={{ ...card(), marginBottom: '16px', borderColor: 'rgba(167,139,250,0.2)', background: 'rgba(88,28,135,0.08)' }}>
              <p style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ✨ Ta motivation
              </p>
              <p style={{ fontSize: '15px', color: C.text, lineHeight: 1.7, fontStyle: 'italic' }}>
                "{profile.motivation}"
              </p>
            </div>

            {/* Craving button */}
            <div style={{ ...card(), textAlign: 'center', borderColor: 'rgba(239,68,68,0.15)', background: 'rgba(127,29,29,0.08)' }}>
              <p style={{ fontSize: '14px', color: C.textSec, marginBottom: '16px' }}>
                Tu ressens une envie de fumer ?
              </p>
              <button
                onClick={() => setShowCraving(true)}
                style={{
                  padding: '14px 32px', background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px',
                  color: '#fca5a5', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                🆘 J'ai une envie — aide-moi !
              </button>
              {cravings.length > 0 && (
                <p style={{ fontSize: '12px', color: '#6b8f7e', marginTop: '12px' }}>
                  Tu as déjà résisté à <strong style={{ color: C.emerald }}>{cravings.length}</strong> envie{cravings.length > 1 ? 's' : ''} 💪
                </p>
              )}
            </div>
          </>
        )}

        {/* ── MILESTONES TAB ── */}
        {activeTab === 'milestones' && (
          <>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '6px' }}>
              🫁 Ton parcours santé
            </h2>
            <p style={{ fontSize: '14px', color: C.textSec, marginBottom: '24px' }}>
              {unlockedMilestones.length} étape{unlockedMilestones.length > 1 ? 's' : ''} franchie{unlockedMilestones.length > 1 ? 's' : ''} sur {MILESTONES.length}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MILESTONES.map((ml, i) => {
                const unlocked = totalMinutes >= ml.minutes;
                const isCurrent = !unlocked && (i === 0 || totalMinutes >= MILESTONES[i - 1].minutes);
                const progress = isCurrent ? Math.min(100, (totalMinutes / ml.minutes) * 100) : 0;

                return (
                  <div key={ml.id} style={{
                    ...card(),
                    borderColor: unlocked ? `${ml.color}30` : isCurrent ? `${ml.color}20` : C.border,
                    background: unlocked ? `${ml.color}08` : isCurrent ? `${ml.color}05` : C.bgCard,
                    opacity: unlocked || isCurrent ? 1 : 0.6,
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                    padding: '18px 20px',
                  }}>
                    <div style={{
                      fontSize: '28px', flexShrink: 0,
                      filter: unlocked ? 'none' : 'grayscale(0.7)',
                      opacity: unlocked ? 1 : 0.7,
                    }}>
                      {ml.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: unlocked ? C.text : C.textSec }}>
                          {ml.title}
                        </span>
                        {unlocked && (
                          <span style={{
                            fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                            background: `${ml.color}20`, color: ml.color, fontWeight: 600,
                          }}>
                            ✓ Atteint
                          </span>
                        )}
                        {isCurrent && (
                          <span style={{
                            fontSize: '11px', padding: '2px 8px', borderRadius: '10px',
                            background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 600,
                          }}>
                            En cours…
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: C.textSec, lineHeight: 1.5, marginBottom: isCurrent ? '10px' : 0 }}>
                        {ml.desc}
                      </p>
                      {isCurrent && (
                        <>
                          <div style={{ height: '4px', background: C.emeraldDim, borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
                            <div style={{
                              height: '100%', width: `${progress}%`,
                              background: `linear-gradient(90deg, #059669, ${C.emerald})`,
                              borderRadius: '2px',
                            }} />
                          </div>
                          <span style={{ fontSize: '11px', color: C.textMut }}>{Math.round(progress)}%</span>
                        </>
                      )}
                      <p style={{ fontSize: '11px', color: C.textMut, marginTop: '4px' }}>
                        {ml.minutes < 1440
                          ? `${ml.minutes} minutes`
                          : ml.minutes < 43200
                            ? `${Math.round(ml.minutes / 1440)} jours`
                            : ml.minutes < 525600
                              ? `${Math.round(ml.minutes / 43200)} mois`
                              : `${Math.round(ml.minutes / 525600)} an${Math.round(ml.minutes / 525600) > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: C.text, marginBottom: '4px' }}>
                  💪 Envies surmontées
                </h2>
                <p style={{ fontSize: '13px', color: C.textSec }}>
                  Chaque envie résistée est une victoire.
                </p>
              </div>
              <button
                onClick={() => setShowCraving(true)}
                style={{
                  padding: '10px 16px', background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px',
                  color: '#fca5a5', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                + Envie
              </button>
            </div>

            {cravings.length === 0 ? (
              <div style={{ ...card(), textAlign: 'center', padding: '48px 24px' }}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>🧘</p>
                <p style={{ fontSize: '16px', fontWeight: 600, color: C.text, marginBottom: '8px' }}>
                  Aucune envie enregistrée
                </p>
                <p style={{ fontSize: '13px', color: C.textSec }}>
                  Si une envie survient, clique sur "J'ai une envie" pour obtenir de l'aide.
                </p>
              </div>
            ) : (
              <>
                <div style={{ ...card(), marginBottom: '16px', display: 'flex', gap: '24px' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: C.emerald }}>{cravings.length}</div>
                    <div style={{ fontSize: '12px', color: C.textSec }}>envies résistées</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>100%</div>
                    <div style={{ fontSize: '12px', color: C.textSec }}>taux de résistance</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#a78bfa' }}>💪</div>
                    <div style={{ fontSize: '12px', color: C.textSec }}>tu es un warrior</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[...cravings].reverse().map((c, i) => {
                    const date = new Date(c.date);
                    return (
                      <div key={c.id} style={{
                        ...card(), padding: '14px 18px',
                        display: 'flex', alignItems: 'center', gap: '14px',
                      }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: C.emeraldDim, border: `1px solid ${C.emeraldBorder}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, fontSize: '16px',
                        }}>
                          💪
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: C.text }}>
                            Envie résistée n°{cravings.length - i}
                          </p>
                          <p style={{ fontSize: '12px', color: C.textSec }}>
                            {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            {' à '}
                            {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', background: C.emeraldDim, color: C.emerald, fontWeight: 600 }}>
                          ✓ Résisté
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showCraving && (
        <CravingModal
          onClose={() => setShowCraving(false)}
          onResisted={handleResisted}
        />
      )}
      {showSettings && (
        <SettingsModal
          profile={profile}
          onSave={(updates) => onUpdate(updates)}
          onClose={() => setShowSettings(false)}
          onReset={onReset}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: '16px', padding: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{ fontSize: '12px', color: C.textSec, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: '26px', fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '6px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: C.textMut }}>{sub}</div>
    </div>
  );
}
