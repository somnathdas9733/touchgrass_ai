import React from 'react';
import { Play, RotateCcw, Clock, ShieldAlert, Sparkles, Eye, Footprints } from 'lucide-react';
import type { PlanResponse } from '../types';

interface Props {
  plan: PlanResponse;
  onStartPlan: () => void;
  onBack: () => void;
}

export const PlanView: React.FC<Props> = ({ plan, onStartPlan, onBack }) => {
  return (
    <div className="glass-card">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.85rem',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderRadius: '999px',
            fontSize: '0.8rem',
            color: '#34d399',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={14} />
          <span>{plan.modelUsed}</span>
        </div>

        <h2 className="font-serif text-gradient" style={{ fontSize: '2.1rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          {plan.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontStyle: 'italic', maxWidth: '560px', margin: '0 auto' }}>
          "{plan.tagline}"
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.85rem', color: '#a7f3d0' }}>
          <Clock size={14} style={{ color: '#34d399' }} />
          <span>Total offline duration: <strong>{plan.totalMinutes} minutes</strong></span>
        </div>
      </div>

      {/* Step Breakdown Cards */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Footprints size={15} style={{ color: 'var(--accent-green)' }} />
          <span>Duration Breakdown & Steps</span>
        </h3>

        <div className="steps-container" style={{ margin: 0 }}>
          {plan.steps.map((step) => (
            <div key={step.step} className="step-card">
              <div className="step-number">{step.step}</div>
              <div className="step-content">
                <div className="step-header">
                  <h4 className="step-title">{step.title}</h4>
                  <span className="step-duration">{step.durationMinutes} min</span>
                </div>
                <p className="step-desc">{step.description}</p>
                {step.sensoryFocus && (
                  <div className="step-sensory">
                    <Eye size={13} style={{ flexShrink: 0, color: 'var(--accent-green)' }} />
                    <span><strong>Sensory cue:</strong> {step.sensoryFocus}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen-Free Pledge Banner */}
      <div className="pledge-banner">
        <ShieldAlert size={22} className="pledge-icon" />
        <div className="pledge-text">
          <strong>Phone-Free Commitment:</strong> {plan.screenFreePledge}
          <div style={{ marginTop: '0.3rem', color: 'rgba(254, 240, 138, 0.85)', fontSize: '0.82rem' }}>
            💡 {plan.groundingAdvice}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.25rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
          style={{ flex: 1, minWidth: '150px' }}
        >
          <RotateCcw size={16} />
          <span>Adjust Options</span>
        </button>

        <button
          type="button"
          onClick={onStartPlan}
          className="btn-primary"
          style={{ flex: 2, minWidth: '220px', padding: '0.95rem 1.5rem', fontSize: '1.05rem' }}
        >
          <Play size={18} fill="currentColor" />
          <span>Start Plan & Timer</span>
        </button>
      </div>
    </div>
  );
};
