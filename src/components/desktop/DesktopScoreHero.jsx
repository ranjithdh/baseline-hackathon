import React, { useEffect, useState } from 'react';
import healthData from '../../data.json';

// ── Arc SVG helpers ─────────────────────────────────────────────
// Circle radius 45, circumference ≈ 283.
// Visible arc = 226px (226 + 57 gap = 283). Arc rotated -220deg.
// dashOffset = 283 - (score/100) * 226
const ARC_CIRC   = 283;
const ARC_VISIBLE = 226;
const getArcOffset = (score) => ARC_CIRC - (score / 100) * ARC_VISIBLE;

// ── Summary card config ─────────────────────────────────────────
const SUMMARY_CARDS = [
  {
    id: 'positive',
    label: 'Working for you',
    pillLabel: '3 markers',
    pillType: 'good',
    markers: [
      { name: 'HbA1c',          value: '5.4%',        bar: 85,  color: 'green' },
      { name: 'Fasting Insulin', value: '7.6 µU/mL',  bar: 78,  color: 'green' },
      { name: 'VO2 Max',        value: '41 mL/kg/min', bar: 68, color: 'green' },
    ],
  },
  {
    id: 'negative',
    label: 'Needs attention',
    pillLabel: '2 markers',
    pillType: 'act',
    markers: [
      { name: 'Vitamin D',   value: '19.69 ng/mL', bar: 28, color: 'red' },
      { name: 'Body Fat %',  value: '33.7%',       bar: 32, color: 'red' },
    ],
  },
  {
    id: 'watch',
    label: 'Watch closely',
    pillLabel: '1 marker',
    pillType: 'watch',
    markers: [
      { name: 'TSH', value: '5 µIU/mL', bar: 58, color: 'amber' },
    ],
  },
];

const pillColors = {
  good:  { bg: 'rgba(var(--green-3), 1)',  color: 'rgb(var(--green-11))' },
  act:   { bg: 'rgba(var(--red-3), 1)',    color: 'rgb(var(--red-11))' },
  watch: { bg: 'rgba(var(--amber-3), 1)', color: 'rgb(var(--amber-11))' },
};

const barColors = {
  green: 'rgb(var(--green-9))',
  red:   'rgb(var(--red-9))',
  amber: 'rgb(var(--amber-9))',
};

const DesktopScoreHero = ({ onSimulate }) => {
  const [revealed, setRevealed] = useState(false);
  const { score_details } = healthData.data;
  const score = score_details.normalized_baseline_score; // 65

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  const arcOffset = revealed ? getArcOffset(score) : ARC_CIRC;
  const potentialScore = 80;
  const gap = potentialScore - score;

  return (
    <div style={{
      padding: '48px 48px 0',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '28px',
      alignItems: 'start',
    }}>

      {/* ── Left: Score Card ── */}
      <div style={{
        background: 'rgb(var(--zinc-950))',
        borderRadius: '24px',
        padding: '52px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 30% 0%, rgba(var(--red-9), 0.18) 0%, transparent 60%),
                       radial-gradient(ellipse at 80% 100%, rgba(var(--amber-9), 0.12) 0%, transparent 50%)`,
        }} />

        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(var(--zinc-200), 0.4)',
          marginBottom: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ width: '24px', height: '1px', background: 'rgb(var(--primary))', display: 'inline-block' }} />
          Your Baseline Score
        </div>

        {/* Arc + Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px', marginBottom: '36px' }}>
          {/* Arc SVG */}
          <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
            <svg
              width="140" height="140"
              viewBox="0 0 110 110"
              style={{ transform: 'rotate(-220deg)' }}
            >
              <defs>
                <linearGradient id="dtScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="rgb(var(--primary))" />
                  <stop offset="100%" stopColor="rgb(var(--amber-9))" />
                </linearGradient>
              </defs>
              {/* Background arc */}
              <circle
                cx="55" cy="55" r="45"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="226 57"
              />
              {/* Fill arc */}
              <circle
                cx="55" cy="55" r="45"
                fill="none"
                stroke="url(#dtScoreGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={String(ARC_CIRC)}
                strokeDashoffset={arcOffset}
                style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            {/* Center text */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '42px',
                fontWeight: 700,
                color: 'rgb(var(--zinc-100))',
                lineHeight: 1,
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(6px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.8s',
              }}>
                {score}
              </div>
              <div style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'rgba(var(--zinc-200), 0.35)',
                letterSpacing: '0.1em',
                marginTop: '2px',
              }}>
                / 100
              </div>
            </div>
          </div>

          {/* Score meta */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgb(var(--amber-9))',
              background: 'rgba(var(--amber-9), 0.12)',
              border: '1px solid rgba(var(--amber-9), 0.25)',
              padding: '5px 12px',
              borderRadius: '100px',
              marginBottom: '16px',
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.4s 2.4s',
            }}>
              ★ {score_details.inference}
            </div>

            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '26px',
              lineHeight: 1.25,
              color: 'rgb(var(--zinc-100))',
              marginBottom: '12px',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2.1s',
            }}>
              Good foundations.<br />Real room to grow.
            </h2>

            <p style={{
              fontSize: '13px',
              color: 'rgba(var(--zinc-200), 0.45)',
              lineHeight: 1.7,
              opacity: revealed ? 1 : 0,
              transition: 'opacity 0.6s 2.4s',
            }}>
              Solid markers across metabolics — with clear opportunities in Vitamin D, body composition, and thyroid balance.
            </p>
          </div>
        </div>

        {/* Gap highlight */}
        <div style={{
          background: 'rgba(var(--red-9), 0.12)',
          border: '1px solid rgba(var(--red-9), 0.2)',
          borderRadius: '14px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 2.7s',
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(var(--zinc-200), 0.5)' }}>Your potential score</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'rgb(var(--primary))', fontWeight: 700 }}>
              {potentialScore} <span style={{ fontSize: '13px', fontFamily: 'var(--font-main)', color: 'rgba(var(--zinc-200), 0.45)' }}>if you close the gap</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(var(--zinc-200), 0.5)' }}>Your gap</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'rgb(var(--primary))', fontWeight: 700 }}>
              {gap} <span style={{ fontSize: '13px', fontFamily: 'var(--font-main)', color: 'rgba(var(--zinc-200), 0.45)' }}>points</span>
            </div>
          </div>
          <div
            onClick={onSimulate}
            style={{
              fontSize: '12px',
              color: 'rgb(var(--primary))',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Simulate it →
          </div>
        </div>
      </div>

      {/* ── Right: Summary Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {SUMMARY_CARDS.map((card, idx) => (
          <div
            key={card.id}
            style={{
              background: 'var(--card-bg)',
              borderRadius: '18px',
              padding: '28px',
              border: '1px solid var(--border-color)',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(12px)',
              transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + idx * 0.2}s`,
            }}
          >
            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
              }}>
                {card.label}
              </div>
              <div style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '100px',
                letterSpacing: '0.05em',
                background: pillColors[card.pillType].bg,
                color: pillColors[card.pillType].color,
              }}>
                {card.pillLabel}
              </div>
            </div>

            {/* Marker rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {card.markers.map(m => (
                <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                  <div style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', width: '90px', textAlign: 'right' }}>
                    {m.value}
                  </div>
                  <div style={{ width: '80px', height: '4px', background: 'var(--border-color)', borderRadius: '2px' }}>
                    <div style={{
                      height: '4px',
                      borderRadius: '2px',
                      background: barColors[m.color],
                      width: revealed ? `${m.bar}%` : '0%',
                      transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1) 1s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DesktopScoreHero;
