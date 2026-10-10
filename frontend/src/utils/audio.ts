// Local offline Web Audio API sound generator for TouchGrass AI

class NatureSoundSystem {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private isPlayingNature: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a gentle meditation chime when a step changes or finishes
  playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Warm soothing bell fundamental (528 Hz - classic Solfeggio "transformation" tone)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(523, this.ctx.currentTime + 2.5);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.1);
    } catch (e) {
      console.warn("Audio chime failed", e);
    }
  }

  // Toggle ambient gentle breeze & forest white noise
  toggleAmbientWind(): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;

      if (this.isPlayingNature) {
        this.stopAmbientWind();
        return false;
      }

      // Generate brown/pink noise buffer for wind/rustle
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Gain compensation
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Low pass filter to simulate gentle wind and distant leaves
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      this.noiseNode = noise;
      this.isPlayingNature = true;
      return true;
    } catch (e) {
      console.warn("Audio ambient failed", e);
      return false;
    }
  }

  stopAmbientWind() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
      } catch {
        // already stopped
      }
      this.noiseNode = null;
    }
    this.isPlayingNature = false;
  }

  isAmbientPlaying(): boolean {
    return this.isPlayingNature;
  }
}

export const natureAudio = new NatureSoundSystem();
