const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;
let bgmOscillators: OscillatorNode[] = [];
let isBgmPlaying = false;
let currentPhaseLevel = 1;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function updateAudioPhase(phase: number) {
  currentPhaseLevel = phase;
}

export function startBackgroundMusic() {
  initAudio();
  if (!audioCtx || isBgmPlaying) return;
  isBgmPlaying = true;
  
  const playRhythm = () => {
    if (!isBgmPlaying || !audioCtx) return;
    
    // Rítmica animada em escala pentatônica menor (Dó menor)
    const baseFreqs = [261.63, 311.13, 349.23, 392.00, 466.16];
    
    // Arpejo rápido e animado
    for(let i=0; i<4; i++) {
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = baseFreqs[Math.floor(Math.random() * baseFreqs.length)];
        
        const startTime = audioCtx!.currentTime + (i * 0.25);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
        
        osc.connect(gain);
        gain.connect(audioCtx!.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.25);
        bgmOscillators.push(osc);
    }
    
    // Camada Dinâmica (Bateria Sintética) para Fases >= 4
    if (currentPhaseLevel >= 4) {
        for(let i=0; i<2; i++) {
            const osc = audioCtx!.createOscillator();
            const gain = audioCtx!.createGain();
            osc.type = 'square';
            // Kick synth
            osc.frequency.setValueAtTime(120, audioCtx!.currentTime + (i * 0.5));
            osc.frequency.exponentialRampToValueAtTime(40, audioCtx!.currentTime + (i * 0.5) + 0.1);
            
            gain.gain.setValueAtTime(0.1, audioCtx!.currentTime + (i * 0.5));
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx!.currentTime + (i * 0.5) + 0.1);
            
            osc.connect(gain);
            gain.connect(audioCtx!.destination);
            
            osc.start(audioCtx!.currentTime + (i * 0.5));
            osc.stop(audioCtx!.currentTime + (i * 0.5) + 0.1);
        }
    }

    // Limpar
    bgmOscillators = bgmOscillators.filter(o => o.context.currentTime < 2);
    setTimeout(playRhythm, 1000); 
  };

  playRhythm();
}

export function playSuccessSound() {
  initAudio();
  if (!audioCtx) return;
  const playNote = (frequency: number, startTime: number, duration: number) => {
    const osc = audioCtx!.createOscillator();
    const gainNode = audioCtx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx!.currentTime + startTime);
    gainNode.gain.setValueAtTime(0, audioCtx!.currentTime + startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx!.currentTime + startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx!.currentTime + startTime + duration);
    osc.connect(gainNode);
    gainNode.connect(audioCtx!.destination);
    osc.start(audioCtx!.currentTime + startTime);
    osc.stop(audioCtx!.currentTime + startTime + duration);
  };
  playNote(523.25, 0, 0.4);   
  playNote(659.25, 0.1, 0.4); 
  playNote(783.99, 0.2, 0.6); 
  playNote(1046.50, 0.3, 1.0);
}

export function playErrorSound() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.3);
}

export function playDropSound() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.1);
}

export function playCauldronBubble() {
  initAudio();
  if (!audioCtx) return;
  for(let i=0; i<3; i++) {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    const startTime = audioCtx.currentTime + (i * 0.15);
    osc.frequency.setValueAtTime(150 + (Math.random()*100), startTime);
    osc.frequency.exponentialRampToValueAtTime(300, startTime + 0.1);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.1);
  }
}
