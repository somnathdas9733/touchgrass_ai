import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, CheckCircle2, Volume2, VolumeX, Eye, Smartphone } from 'lucide-react';
import type { PlanResponse } from '../types';
import { natureAudio } from '../utils/audio';

interface Props {
  plan: PlanResponse;
  onComplete: (stats: { totalMinutes: number; completedSteps: number }) => void;
  onExit: () => void;
}

export const TimerScreen: React.FC<Props> = ({ plan, onComplete, onExit }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = plan.steps[currentStepIndex] || plan.steps[0];

  // Seconds remaining for current step
  const [stepSecondsLeft, setStepSecondsLeft] = useState(currentStep.durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [ambientActive, setAmbientActive] = useState(false);
  const [completedStepsCount, setCompletedStepsCount] = useState(0);

  // When step changes, reset seconds
  useEffect(() => {
    setStepSecondsLeft(currentStep.durationMinutes * 60);
  }, [currentStepIndex, currentStep.durationMinutes]);

  // Main countdown timer interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setStepSecondsLeft((prev) => {
        if (prev <= 1) {
          // Play chime for step transition
          natureAudio.playChime();
          setCompletedStepsCount((c) => c + 1);

          // If there is another step, advance
          if (currentStepIndex < plan.steps.length - 1) {
            setCurrentStepIndex((idx) => idx + 1);
            return 0;
          } else {
            // Plan completed!
            clearInterval(interval);
            onComplete({
              totalMinutes: plan.totalMinutes,
              completedSteps: plan.steps.length,
            });
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentStepIndex, plan.steps.length, plan.totalMinutes, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleNextStep = () => {
    natureAudio.playChime();
    setCompletedStepsCount((c) => c + 1);
    if (currentStepIndex < plan.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete({
        totalMinutes: plan.totalMinutes,
        completedSteps: plan.steps.length,
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const toggleAmbientSound = () => {
    const active = natureAudio.toggleAmbientWind();
    setAmbientActive(active);
  };

  // Cleanup ambient sound on unmount
  useEffect(() => {
    return () => {
      natureAudio.stopAmbientWind();
    };
  }, []);

  // Format MM:SS
  const minutes = Math.floor(stepSecondsLeft / 60);
  const seconds = stepSecondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Circular progress calculation
  const totalStepSeconds = currentStep.durationMinutes * 60;
  const progressRatio = totalStepSeconds > 0 ? (totalStepSeconds - stepSecondsLeft) / totalStepSeconds : 0;
  const strokeRadius = 105;
  const circumference = 2 * Math.PI * strokeRadius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="glass-card" style={{ padding: '2.5rem 1.75rem' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={onExit}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '0.88rem', cursor: 'pointer' }}
        >
          ← Exit Session
        </button>

        {/* Ambient wind synthesizer toggle */}
        <button
          type="button"
          onClick={toggleAmbientSound}
          className={`ambient-toggle ${ambientActive ? 'active' : ''}`}
          title="Toggle soothing ambient breeze generator"
        >
          {ambientActive ? <Volume2 size={14} /> : <VolumeX size={14} />}
          <span>{ambientActive ? 'Ambient Breeze On' : 'Forest Sound'}</span>
        </button>
      </div>

      {/* Screen-Free Reminder Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(52, 211, 153, 0.08)', padding: '0.5rem 1rem', borderRadius: '999px', margin: '0 auto 1.5rem', width: 'fit-content', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
        <Smartphone size={14} style={{ color: 'var(--accent-green)' }} />
        <span style={{ fontSize: '0.82rem', color: '#a7f3d0', fontWeight: 500 }}>
          Put phone facedown or in your pocket. Be present.
        </span>
      </div>

      {/* Progress Circles & Steps indicator */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
          Step {currentStepIndex + 1} of {plan.steps.length}
        </div>
        <h3 className="font-serif text-gradient" style={{ fontSize: '1.75rem', fontWeight: 600 }}>
          {currentStep.title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '480px', margin: '0.35rem auto 0' }}>
          {currentStep.description}
        </p>
      </div>

      {/* Circular Progress Ring */}
      <div className="circle-progress-wrapper">
        <div className="breathing-ring" />
        <svg className="circle-svg" viewBox="0 0 250 250">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <circle
            className="circle-bg"
            cx="125"
            cy="125"
            r={strokeRadius}
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            className="circle-bar"
            cx="125"
            cy="125"
            r={strokeRadius}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="timer-inside">
          <div className="timer-digits">{timeFormatted}</div>
          <div className="timer-label">{isRunning ? 'Remaining in Step' : 'Paused'}</div>
        </div>
      </div>

      {/* Sensory Focus Reminder */}
      {currentStep.sensoryFocus && (
        <div style={{ maxWidth: '460px', margin: '0 auto 1.75rem', background: 'rgba(20, 42, 31, 0.7)', border: '1px solid rgba(74, 222, 128, 0.2)', padding: '0.75rem 1.15rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Eye size={18} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.85rem', color: '#d1fae5' }}>
            <strong>Sensory focus:</strong> {currentStep.sensoryFocus}
          </span>
        </div>
      )}

      {/* Timer Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0}
          className="btn-secondary"
          style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%' }}
          title="Previous Step"
        >
          <SkipBack size={18} />
        </button>

        <button
          type="button"
          onClick={toggleTimer}
          className="btn-primary"
          style={{ width: '58px', height: '58px', padding: 0, borderRadius: '50%', boxShadow: '0 0 25px rgba(52, 211, 153, 0.3)' }}
          title={isRunning ? 'Pause' : 'Resume'}
        >
          {isRunning ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" style={{ marginLeft: '2px' }} />}
        </button>

        <button
          type="button"
          onClick={handleNextStep}
          className="btn-secondary"
          style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%' }}
          title="Next Step"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Step Checklist Preview */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)' }}>
            Plan Flow
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)' }}>
            {currentStepIndex + 1} of {plan.steps.length} active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${plan.steps.length}, 1fr)`, gap: '0.5rem' }}>
          {plan.steps.map((st, i) => (
            <div
              key={st.step}
              onClick={() => setCurrentStepIndex(i)}
              style={{
                cursor: 'pointer',
                padding: '0.6rem 0.5rem',
                borderRadius: '8px',
                textAlign: 'center',
                background: i === currentStepIndex ? 'rgba(52, 211, 153, 0.2)' : i < currentStepIndex ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: i === currentStepIndex ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: i <= currentStepIndex ? '#34d399' : 'var(--text-dim)' }}>
                {i < currentStepIndex ? '✓' : `${st.durationMinutes}m`}
              </div>
              <div style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: i === currentStepIndex ? '#ffffff' : 'var(--text-muted)' }}>
                {st.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => {
            natureAudio.playChime();
            onComplete({
              totalMinutes: plan.totalMinutes,
              completedSteps: completedStepsCount + 1,
            });
          }}
          className="btn-primary"
          style={{ width: '100%', padding: '0.95rem 1.5rem', fontSize: '1.02rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
        >
          <CheckCircle2 size={19} />
          <span>I Touched Grass (Mark Completed)</span>
        </button>
      </div>
    </div>
  );
};
