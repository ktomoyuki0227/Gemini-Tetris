
type SoundType = 'move' | 'rotate' | 'drop' | 'clear' | 'gameover' | 'levelUp' | 'hold';

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = false;
  private nextNoteTime: number = 0;
  private isPlayingBgm: boolean = false;
  private timerID: number | undefined;

  // Simple pentatonic scale frequencies for generative music
  private scale = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25  // C5
  ];

  constructor() {
    // Lazy init
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.3; // Default volume
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.3, 
        this.ctx!.currentTime, 
        0.1
      );
    }
    return this.isMuted;
  }

  public getMuteState() {
    return this.isMuted;
  }

  public playSound(type: SoundType) {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    switch (type) {
      case 'move':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'rotate':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.linearRampToValueAtTime(600, t + 0.05);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'drop':
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.15);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
        break;
      
      case 'hold':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.linearRampToValueAtTime(800, t + 0.05);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'clear':
        // Sparkle effect
        [0, 0.1, 0.2].forEach((delay, i) => {
            const o = this.ctx!.createOscillator();
            const g = this.ctx!.createGain();
            o.connect(g);
            g.connect(this.masterGain!);
            o.type = 'sine';
            o.frequency.setValueAtTime(523.25 * (i + 1), t + delay);
            g.gain.setValueAtTime(0.1, t + delay);
            g.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.3);
            o.start(t + delay);
            o.stop(t + delay + 0.3);
        });
        break;

      case 'gameover':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(10, t + 1.0);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 1.0);
        osc.start(t);
        osc.stop(t + 1.0);
        break;
    }
  }

  // Generative Ambient BGM
  private scheduleNote() {
    if (!this.isPlayingBgm || !this.ctx || !this.masterGain) return;

    const secondsPerBeat = 0.5;
    const t = this.ctx.currentTime;
    
    // Schedule ahead
    while (this.nextNoteTime < t + 0.1) {
        this.nextNoteTime += secondsPerBeat;
        
        // Random note from scale
        const note = this.scale[Math.floor(Math.random() * this.scale.length)];
        // Sometimes play a lower octave bass note
        const isBass = Math.random() < 0.2;
        const freq = isBass ? note / 2 : note;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = isBass ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        // Envelope
        const attack = 0.02;
        const release = isBass ? 1.5 : 0.8;
        
        gain.gain.setValueAtTime(0, this.nextNoteTime);
        gain.gain.linearRampToValueAtTime(isBass ? 0.05 : 0.02, this.nextNoteTime + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, this.nextNoteTime + release);
        
        osc.start(this.nextNoteTime);
        osc.stop(this.nextNoteTime + release);
    }
    
    this.timerID = window.setTimeout(this.scheduleNote.bind(this), 250);
  }

  public startMusic() {
    this.init();
    if (this.isPlayingBgm) return;
    this.isPlayingBgm = true;
    this.nextNoteTime = this.ctx!.currentTime + 0.1;
    this.scheduleNote();
  }

  public stopMusic() {
    this.isPlayingBgm = false;
    if (this.timerID) clearTimeout(this.timerID);
  }
}

export const audioService = new AudioService();
