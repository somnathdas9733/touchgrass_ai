import React, { useEffect, useState } from 'react';
import { Sprout, CheckCircle2, RotateCcw, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  planTitle: string;
  totalMinutes: number;
  onReset: () => void;
}

const REFLECTION_PROMPTS = [
  "What is one tiny natural detail you saw that you would have missed on your phone?",
  "How does your mind feel compared to when you started?",
  "Notice your breathing right now—does it feel deeper and calmer?",
  "What was the most grounding sound you heard while outside?",
];

export const CompletionScreen: React.FC<Props> = ({ planTitle, totalMinutes, onReset }) => {
  const [reflection] = useState(() => {
    return REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
  });

  useEffect(() => {
    // Fire celebratory nature-toned confetti!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#22c55e', '#a3e635', '#fef08a', '#34d399'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
      <div className="celebrate-badge">
        <Sprout size={48} />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.85rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.25)', borderRadius: '999px', fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginBottom: '0.75rem' }}>
        <CheckCircle2 size={14} />
        <span>You Touched Grass!</span>
      </div>

      <h2 className="font-serif text-gradient" style={{ fontSize: '2.3rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
        Mission Accomplished
      </h2>

      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
        You spent <strong>{totalMinutes} phone-free minutes</strong> grounded in the physical world during <em>"{planTitle}"</em>.
      </p>

      {/* Mindful Reflection Card */}
      <div style={{ background: 'rgba(16, 36, 26, 0.8)', border: '1px solid rgba(74, 222, 128, 0.2)', padding: '1.5rem', borderRadius: '16px', maxWidth: '520px', margin: '0 auto 2.25rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a7f3d0', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
          <Feather size={15} style={{ color: 'var(--accent-green)' }} />
          <span>Moment of Reflection</span>
        </div>
        <p style={{ color: '#f0fdf4', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.5 }}>
          "{reflection}"
        </p>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onReset}
          className="btn-primary"
          style={{ padding: '0.95rem 2rem', fontSize: '1.02rem' }}
        >
          <RotateCcw size={17} />
          <span>Plan Another Offline Ritual</span>
        </button>
      </div>
    </div>
  );
};
