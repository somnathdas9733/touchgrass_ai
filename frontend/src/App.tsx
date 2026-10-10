import React, { useState, useEffect } from 'react';
import { Sprout } from 'lucide-react';
import { InputForm } from './components/InputForm';
import { PlanView } from './components/PlanView';
import { TimerScreen } from './components/TimerScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { OllamaStatusBadge } from './components/OllamaStatusBadge';
import type { PlanResponse, PlanFormInput, OllamaStatus } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'form' | 'plan' | 'timer' | 'completed'>('form');
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<OllamaStatus | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [completedMinutes, setCompletedMinutes] = useState(30);

  // Check Ollama / backend health
  const checkHealth = async () => {
    setCheckingStatus(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data: OllamaStatus = await res.json();
        setStatus(data);
      } else {
        setStatus({
          status: 'error',
          ollama_connected: false,
          available_models: [],
          active_model: 'gemma4:latest',
          has_gemma: false,
        });
      }
    } catch (e) {
      console.warn("Failed to check health", e);
      setStatus({
        status: 'error',
        ollama_connected: false,
        available_models: [],
        active_model: 'gemma4:latest',
        has_gemma: false,
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleGeneratePlan = async (input: PlanFormInput) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error('Failed to generate plan');
      }

      const planData: PlanResponse = await res.json();
      setPlan(planData);
      setCurrentView('plan');
    } catch (err) {
      console.error('Error generating plan:', err);
      // Local fallback
      setPlan({
        title: `${input.duration} Phone-Free Walk`,
        tagline: 'Leave the phone behind and notice the world around you.',
        totalMinutes: 30,
        steps: [
          {
            step: 1,
            title: 'Unplug & Step Outside',
            durationMinutes: 5,
            description: `Put your phone on silent and step into ${input.location}. Take a deep breath.`,
            sensoryFocus: 'Feel the fresh air and notice 3 natural sights.',
          },
          {
            step: 2,
            title: `Mindful ${input.preference}`,
            durationMinutes: 15,
            description: `Take a relaxed ${input.preference.toLowerCase()} without touching any device.`,
            sensoryFocus: 'Listen to the bird calls and rustling leaves.',
          },
          {
            step: 3,
            title: 'Quiet Observation',
            durationMinutes: 10,
            description: 'Sit peacefully somewhere quiet and observe your immediate surroundings.',
            sensoryFocus: 'Close your eyes and focus on the ambient warmth.',
          },
        ],
        screenFreePledge: 'Keep your phone tucked away for this entire session.',
        groundingAdvice: 'Whenever you want to check your screen, take three deep breaths instead.',
        modelUsed: 'Local Fallback',
      });
      setCurrentView('plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartPlan = () => {
    setCurrentView('timer');
  };

  const handleCompleteTimer = (stats: { totalMinutes: number; completedSteps: number }) => {
    setCompletedMinutes(stats.totalMinutes);
    setCurrentView('completed');
  };

  const handleResetToForm = () => {
    setCurrentView('form');
  };

  return (
    <>
      <div className="nature-bg-pattern" />

      <main className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="brand-wrapper" onClick={handleResetToForm}>
            <div className="brand-icon">
              <Sprout size={24} />
            </div>
            <div>
              <div className="brand-title">
                <span>TouchGrass</span>
                <span className="brand-badge">AI</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', letterSpacing: '0.02em' }}>
                Open-Weight Disconnect Assistant
              </div>
            </div>
          </div>

          <OllamaStatusBadge
            status={status}
            loading={checkingStatus}
            onRefresh={checkHealth}
          />
        </header>

        {/* Dynamic View State */}
        {currentView === 'form' && (
          <InputForm
            onSubmit={handleGeneratePlan}
            isLoading={isLoading}
          />
        )}

        {currentView === 'plan' && plan && (
          <PlanView
            plan={plan}
            onStartPlan={handleStartPlan}
            onBack={handleResetToForm}
          />
        )}

        {currentView === 'timer' && plan && (
          <TimerScreen
            plan={plan}
            onComplete={handleCompleteTimer}
            onExit={handleResetToForm}
          />
        )}

        {currentView === 'completed' && plan && (
          <CompletionScreen
            planTitle={plan.title}
            totalMinutes={completedMinutes}
            onReset={handleResetToForm}
          />
        )}

        {/* Footer */}
        <footer className="app-footer">
          <div>
            Built with <strong>React + TypeScript + Vite + Python FastAPI</strong>
          </div>
          <div>
            Powered locally by <strong>Gemma 4 via Ollama</strong> • 100% Localhost • No Cloud AI
          </div>
        </footer>
      </main>
    </>
  );
};

export default App;
