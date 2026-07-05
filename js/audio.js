/**
 * @file audio.js
 * @description Gestión de audio y sonidos del juego
 * Maneja la música ambiental, efectos de sonido y control de volumen
 */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.masterVolume = 0.3;
        this.sfxVolume = 0.5;
        this.musicVolume = 0.3;
        this.isMuted = false;
        this.isInitialized = false;
    }

    /**
     * Inicializa el sistema de audio
     * Crea audio context y prepara soundscapes
     */
    init() {
        if (this.isInitialized) return;
        
        this.createAmbientSounds();
        this.isInitialized = true;
    }

    /**
     * Crea sonidos ambientales usando Web Audio API
     */
    createAmbientSounds() {
        // Sonido del viento suave
        this.createWindSound();
        
        // Sonido del agua fluyendo
        this.createWaterSound();
        
        // Cantos de pájaros
        this.createBirdSound();
    }

    /**
     * Crea sonido de viento suave usando osciladores
     */
    createWindSound() {
        const audioContext = this.getAudioContext();
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(40, audioContext.currentTime);
        oscillator.frequency.setTargetAtTime(60, audioContext.currentTime, 3);
        
        gain.gain.setValueAtTime(0.05, audioContext.currentTime);
        gain.gain.setTargetAtTime(0.08, audioContext.currentTime, 4);
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.start();
        this.sounds['wind'] = { oscillator, gain, startTime: Date.now() };
    }

    /**
     * Crea sonido de agua fluyendo
     */
    createWaterSound() {
        const audioContext = this.getAudioContext();
        if (!audioContext) return;

        // Crear un sonido de agua más realista con ruido blanco filtrado
        const bufferSize = audioContext.sampleRate * 2;
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, audioContext.currentTime);
        
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0.1 * this.masterVolume, audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        
        source.start();
        this.sounds['water'] = { source, gain, startTime: Date.now() };
    }

    /**
     * Crea sonido de cantos de pájaros
     */
    createBirdSound() {
        const audioContext = this.getAudioContext();
        if (!audioContext) return;

        const playBirdSound = () => {
            if (!this.isInitialized) return;

            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            const now = audioContext.currentTime;
            const duration = Math.random() * 0.5 + 0.3;
            
            osc.frequency.setValueAtTime(Math.random() * 2000 + 1000, now);
            osc.frequency.setTargetAtTime(Math.random() * 1500 + 500, now, duration * 0.3);
            
            gain.gain.setValueAtTime(0.05 * this.masterVolume, now);
            gain.gain.setTargetAtTime(0, now + duration, duration * 0.2);
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.start(now);
            osc.stop(now + duration);
            
            setTimeout(playBirdSound, Math.random() * 5000 + 3000);
        };

        playBirdSound();
    }

    /**
     * Obtiene el audio context global
     */
    getAudioContext() {
        if (!window.audioContext) {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return window.audioContext;
    }

    /**
     * Reproduce un efecto de sonido (recoger agua)
     */
    playCollectSound() {
        const audioContext = this.getAudioContext();
        if (!audioContext || this.isMuted) return;

        const now = audioContext.currentTime;
        
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc1.frequency.setValueAtTime(800, now);
        osc1.frequency.setTargetAtTime(1200, now, 0.1);
        
        osc2.frequency.setValueAtTime(1200, now);
        osc2.frequency.setTargetAtTime(1600, now, 0.1);
        
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
        gain.gain.setTargetAtTime(0, now + 0.2, 0.1);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioContext.destination);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.2);
        osc2.stop(now + 0.2);
    }

    /**
     * Reproduce sonido de limpieza (basura)
     */
    playCleanSound() {
        const audioContext = this.getAudioContext();
        if (!audioContext || this.isMuted) return;

        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setTargetAtTime(600, now, 0.15);
        osc.frequency.setTargetAtTime(300, now + 0.15, 0.1);
        
        gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
        gain.gain.setTargetAtTime(0, now + 0.25, 0.1);
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.25);
    }

    /**
     * Reproduce sonido de éxito (completar objetivo)
     */
    playSuccessSound() {
        const audioContext = this.getAudioContext();
        if (!audioContext || this.isMuted) return;

        const now = audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99]; // Do, Mi, Sol
        
        notes.forEach((freq, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + index * 0.1);
            gain.gain.setTargetAtTime(0, now + index * 0.1 + 0.3, 0.1);
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.start(now + index * 0.1);
            osc.stop(now + index * 0.1 + 0.3);
        });
    }

    /**
     * Silencia o activa todo el audio
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    /**
     * Establece el volumen maestro
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Detiene todos los sonidos
     */
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound.oscillator) sound.oscillator.stop();
            if (sound.source) sound.source.stop();
        });
        this.sounds = {};
    }
}

// Crear instancia global de AudioManager
const audioManager = new AudioManager();
