/**
 * @file ui.js
 * @description Gestión de la interfaz de usuario, pantallas y eventos
 */

class UIManager {
    constructor() {
        this.currentScreen = 'start';
        this.screens = {};
        this.events = [];
        this.setupScreens();
        this.setupEventListeners();
    }

    /**
     * Configura todas las pantallas del juego
     */
    setupScreens() {
        this.screens = {
            start: document.getElementById('startScreen'),
            controls: document.getElementById('controlsScreen'),
            credits: document.getElementById('creditsScreen'),
            end: document.getElementById('endScreen'),
            event: document.getElementById('eventModal')
        };
    }

    /**
     * Configura los event listeners de botones
     */
    setupEventListeners() {
        // Pantalla de inicio
        document.getElementById('startBtn').addEventListener('click', () => {
            this.hideAllScreens();
            this.startGame();
        });

        document.getElementById('controlsBtn').addEventListener('click', () => {
            this.showScreen('controls');
        });

        document.getElementById('creditsBtn').addEventListener('click', () => {
            this.showScreen('credits');
        });

        // Botones de atrás
        document.getElementById('backFromControls').addEventListener('click', () => {
            this.showScreen('start');
        });

        document.getElementById('backFromCredits').addEventListener('click', () => {
            this.showScreen('start');
        });

        // Pantalla final
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.hideAllScreens();
            this.startGame();
        });

        // Modal de evento
        document.getElementById('eventBtn').addEventListener('click', () => {
            this.hideEvent();
        });
    }

    /**
     * Muestra una pantalla específica
     */
    showScreen(screenName) {
        this.hideAllScreens();
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('screen-active');
            this.currentScreen = screenName;
        }
    }

    /**
     * Oculta todas las pantallas
     */
    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('screen-active');
        });
    }

    /**
     * Inicia el juego
     */
    startGame() {
        this.hideAllScreens();
        window.gameInstance?.startGame?.();
    }

    /**
     * Muestra un evento educativo
     */
    showEvent(title, text) {
        const modal = this.screens.event;
        if (!modal) return;

        document.getElementById('eventTitle').textContent = title;
        document.getElementById('eventText').textContent = text;
        modal.classList.add('modal-active');
    }

    /**
     * Oculta el modal de evento
     */
    hideEvent() {
        const modal = this.screens.event;
        if (modal) modal.classList.remove('modal-active');
    }

    /**
     * Muestra la pantalla final
     */
    showEndScreen() {
        this.hideAllScreens();
        if (this.screens.end) {
            this.screens.end.classList.add('screen-active');
        }
    }

    /**
     * Actualiza la barra de estadísticas
     */
    updateStats(stats, progress) {
        document.getElementById('waterCount').textContent = stats.water;
        document.getElementById('treesCount').textContent = stats.trees;
        document.getElementById('trashCount').textContent = stats.trash;
        document.getElementById('progressBar').style.width = `${progress}%`;
    }

    /**
     * Define los eventos del juego
     */
    defineGameEvents() {
        this.events = [
            {
                trigger: 'waterReached',
                title: '💧 El Agua Regresa',
                text: 'Los Yaquis han defendido durante décadas el derecho al agua.'
            },
            {
                trigger: 'treesReached',
                title: '🌱 Bosque Restaurado',
                text: 'La vegetación protege el suelo y el agua del río Yaqui.'
            },
            {
                trigger: 'trashReached',
                title: '🗑 Limpieza Completa',
                text: 'Sin contaminación, el río puede recuperar su vida.'
            },
            {
                trigger: 'halfway',
                title: '⚡ Buen Progreso',
                text: 'Cada acción cuenta para restaurar el Río Yaqui.'
            },
            {
                trigger: 'waterHalf',
                title: '💧 La Crecida Comienza',
                text: 'El agua fluye de nuevo, la vida regresa.'
            }
        ];
    }

    /**
     * Verifica y muestra eventos según el progreso
     */
    checkAndShowEvents(stats, progress) {
        if (!this.events.length) this.defineGameEvents();

        // Eventos basados en estadísticas
        if (stats.water === 5 && !this.shownWaterHalf) {
            this.showEvent('💧 La Crecida Comienza', 'El agua fluye de nuevo, la vida regresa.');
            this.shownWaterHalf = true;
        }

        if (stats.trees === 4 && !this.shownTreesHalf) {
            this.showEvent('🌱 Bosque en Crecimiento', 'Los árboles dan sombra y protegen el agua.');
            this.shownTreesHalf = true;
        }

        if (progress === 50 && !this.shownHalfway) {
            this.showEvent('⚡ Punto Medio', 'Ya has recuperado la mitad del río. ¡Sigue adelante!');
            this.shownHalfway = true;
        }
    }

    /**
     * Reinicia los flags de eventos
     */
    resetEventFlags() {
        this.shownWaterHalf = false;
        this.shownTreesHalf = false;
        this.shownHalfway = false;
    }
}

// Crear instancia global
const uiManager = new UIManager();
