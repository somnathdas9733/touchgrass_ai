import React, { useState } from 'react';
import { Clock, MapPin, Smile, Compass, Sparkles, Sprout, ArrowRight } from 'lucide-react';
import type { PlanFormInput } from '../types';

interface Props {
  onSubmit: (data: PlanFormInput) => void;
  isLoading: boolean;
}

const DURATION_PRESETS = [
  '15 min',
  '30 min',
  '45 min',
  '1 hour',
  '90 min',
];

const LOCATION_SUGGESTIONS = [
  'Near my college',
  'City park / garden',
  'Neighborhood sidewalk',
  'Office terrace / lawn',
  'Apartment balcony',
  'Quiet outdoor bench',
];

const MOOD_OPTIONS = [
  { label: 'Relaxed', emoji: '🌿' },
  { label: 'Bored', emoji: '☁️' },
  { label: 'Energetic', emoji: '⚡' },
  { label: 'Tired / Drained', emoji: '🍂' },
  { label: 'Restless', emoji: '🌀' },
  { label: 'Curious', emoji: '🌱' },
];

const PREFERENCE_OPTIONS = [
  { label: 'Mindful Walk', icon: '🚶' },
  { label: 'Touch Nature', icon: '🍃' },
  { label: 'Light Exercise', icon: '🧘' },
  { label: 'Explore / Wander', icon: '🧭' },
  { label: 'People Watching', icon: '👥' },
  { label: 'Quiet Sitting', icon: '🪨' },
];

export const InputForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [duration, setDuration] = useState('30 min');
  const [customDuration, setCustomDuration] = useState('');
  const [location, setLocation] = useState('Near my college');
  const [mood, setMood] = useState('Relaxed');
  const [preference, setPreference] = useState('Mindful Walk');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveDuration = customDuration.trim() || duration;
    onSubmit({
      duration: effectiveDuration,
      location: location.trim() || 'Outdoor area',
      mood,
      preference,
    });
  };

  const handlePresetSelect = (preset: string) => {
    setDuration(preset);
    setCustomDuration('');
  };

  return (
    <div className="glass-card">
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.85rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.25)', borderRadius: '999px', fontSize: '0.8rem', color: '#34d399', fontWeight: 600, marginBottom: '0.9rem' }}>
          <Sprout size={14} />
          <span>Local Open-Weight Gemma 4 Powered</span>
        </div>
        <h2 className="font-serif text-gradient" style={{ fontSize: '2.1rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Leave the screen. Touch the grass.
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '520px', margin: '0 auto' }}>
          Tell Gemma 4 your free time and immediate surroundings. It will craft an intentional, 100% phone-free ritual.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 1. Free Time */}
        <div className="form-group">
          <label className="form-label">
            <Clock size={16} style={{ color: 'var(--accent-green)' }} />
            <span>How much free time do you have?</span>
          </label>
          <div className="pill-grid">
            {DURATION_PRESETS.map((p) => (
              <button
                type="button"
                key={p}
                className={`pill-option ${duration === p && !customDuration ? 'active' : ''}`}
                onClick={() => handlePresetSelect(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '0.65rem' }}>
            <input
              type="text"
              placeholder="Or enter custom time (e.g. 20 min, 2 hours)..."
              value={customDuration}
              onChange={(e) => {
                setCustomDuration(e.target.value);
                if (e.target.value) setDuration(e.target.value);
              }}
              className="text-input"
              style={{ fontSize: '0.9rem', padding: '0.65rem 1rem' }}
            />
          </div>
        </div>

        {/* 2. Location / Environment */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={16} style={{ color: 'var(--accent-green)' }} />
            <span>Where are you right now?</span>
          </label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g. Near my college, quiet park, office courtyard..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <div className="suggestion-pills">
            {LOCATION_SUGGESTIONS.map((sug) => (
              <button
                type="button"
                key={sug}
                className="suggestion-pill"
                onClick={() => setLocation(sug)}
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Mood */}
        <div className="form-group">
          <label className="form-label">
            <Smile size={16} style={{ color: 'var(--accent-green)' }} />
            <span>How are you feeling right now?</span>
          </label>
          <div className="pill-grid">
            {MOOD_OPTIONS.map((m) => (
              <button
                type="button"
                key={m.label}
                className={`pill-option ${mood === m.label ? 'active' : ''}`}
                onClick={() => setMood(m.label)}
              >
                <span style={{ marginRight: '0.35rem' }}>{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Preference */}
        <div className="form-group">
          <label className="form-label">
            <Compass size={16} style={{ color: 'var(--accent-green)' }} />
            <span>What kind of offline activity appeals to you?</span>
          </label>
          <div className="pill-grid">
            {PREFERENCE_OPTIONS.map((pref) => (
              <button
                type="button"
                key={pref.label}
                className={`pill-option ${preference === pref.label ? 'active' : ''}`}
                onClick={() => setPreference(pref.label)}
              >
                <span style={{ marginRight: '0.4rem' }}>{pref.icon}</span>
                {pref.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
          >
            {isLoading ? (
              <>
                <Sparkles size={18} className="spinning-sprout" style={{ margin: 0, width: 18, height: 18 }} />
                <span>Gemma 4 is crafting your offline ritual...</span>
              </>
            ) : (
              <>
                <span>Generate Phone-Free Plan</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
          <p style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            🔒 Runs 100% locally on your machine via Ollama. No accounts, zero cloud tracking.
          </p>
        </div>
      </form>
    </div>
  );
};
