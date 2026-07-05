/**
 * @file game.js
 * @description Módulo principal del juego - Orquestación y loop de juego
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configurar canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Componentes del juego
        this.world = null;
        this.player = null;
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.lastFrameTime = 0;
        
        // Control de eventos
        this.eventShownAt = {};
        this.gameStartTime = 0;
        
        this.init();
    }

    /**
     * Redimensiona el canvas para que se ajuste a la ventana
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        if (this.world) {
            this.world.width = this.canvas.width;
            this.world.height = this.canvas.height;
        }
    }

    /**
     * Inicializa el juego
     */
    init() {
        // Crear mundo
        this.world = new World(this.canvas);
        
        // Crear jugador en el centro
        this.player = new Player(
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.world
        );
        
        // Inicializar audio
        audioManager.init();
        
        // Hacer referencia global para que UI pueda iniciar el juego
        window.gameInstance = this;
    }

    /**
     * Inicia una partida
     */
    startGame() {
        this.isRunning = true;
        this.isPaused = false;
        this.gameTime = 0;
        this.gameStartTime = Date.now();
        this.eventShownAt = {};
        
        // Reiniciar mundo y jugador
        this.world.reset();
        this.player.reset(this.canvas.width / 2, this.canvas.height / 2);
        
        // Resetear flags de eventos en UI
        uiManager.resetEventFlags();
        
        // Ocultar todas las pantallas
        uiManager.hideAllScreens();
        
        // Iniciar el loop del juego
        this.gameLoop();
    }

    /**
     * Loop principal del juego
     */
    gameLoop = () => {
        if (!this.isRunning) return;

        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        this.gameTime += deltaTime;

        // Actualizar lógica del juego
        this.update();
        
        // Renderizar
        this.render();
        
        // Verificar si el juego está completo
        if (this.world.isGameComplete()) {
            this.endGame();
            return;
        }
        
        // Siguiente frame
        requestAnimationFrame(this.gameLoop);
    }

    /**
     * Actualiza la lógica del juego
     */
    update() {
        if (this.isPaused) return;

        // Actualizar jugador
        this.player.update();
        
        // Actualizar mundo
        this.world.updateWorldState();
        
        // Actualizar UI
        uiManager.updateStats(this.world.stats, this.world.getProgress());
        
        // Verificar y mostrar eventos
        this.checkGameEvents();
    }

    /**
     * Verifica eventos del juego según el progreso
     */
    checkGameEvents() {
        const stats = this.world.stats;
        const progress = this.world.getProgress();

        // Evento: Primera gota de agua recogida
        if (stats.water === 1 && !this.eventShownAt.firstWater) {
            uiManager.showEvent(
                '💧 El Agua Regresa',
                'Los Yaquis han defendido durante décadas el derecho al agua.'
            );
            this.eventShownAt.firstWater = true;
            audioManager.playSuccessSound();
        }

        // Evento: Mitad del agua recogida
        if (stats.water === Math.ceil(this.world.targetWater / 2) && !this.eventShownAt.halfWater) {
            uiManager.showEvent(
                '🌊 La Crecida Comienza',
                'El agua fluye de nuevo, la vida regresa al río.'
            );
            this.eventShownAt.halfWater = true;
            audioManager.playSuccessSound();
        }

        // Evento: Primer árbol plantado
        if (stats.trees === 1 && !this.eventShownAt.firstTree) {
            uiManager.showEvent(
                '🌱 Bosque en Crecimiento',
                'Los árboles protegen el suelo y purifican el agua.'
            );
            this.eventShownAt.firstTree = true;
            audioManager.playSuccessSound();
        }

        // Evento: Primera basura limpiada
        if (stats.trash === 1 && !this.eventShownAt.firstTrash) {
            uiManager.showEvent(
                '✨ Comenzó la Limpieza',
                'Sin contaminación, el río puede recuperar su vida.'
            );
            this.eventShownAt.firstTrash = true;
            audioManager.playSuccessSound();
        }

        // Evento: 50% de progreso
        if (progress >= 50 && !this.eventShownAt.halfway) {
            uiManager.showEvent(
                '⚡ Punto Medio',
                '¡Vas a la mitad! La restauración es posible.'
            );
            this.eventShownAt.halfway = true;
            audioManager.playSuccessSound();
        }

        // Evento: Mitad de la basura limpiada
        if (stats.trash >= Math.ceil(this.world.targetTrash / 2) && !this.eventShownAt.halfTrash) {
            uiManager.showEvent(
                '🗑 Río más Limpio',
                'La contaminación disminuye, la naturaleza se recupera.'
            );
            this.eventShownAt.halfTrash = true;
        }

        // Evento: 75% de progreso
        if (progress >= 75 && !this.eventShownAt.almostDone) {
            uiManager.showEvent(
                '🎯 Casi Completo',
                'El río Yaqui está casi restaurado. ¡Termina la misión!'
            );
            this.eventShownAt.almostDone = true;
            audioManager.playSuccessSound();
        }
    }

    /**
     * Renderiza el juego
     */
    render() {
        // Renderizar mundo
        this.world.render();
        
        // Renderizar jugador
        this.player.render(this.ctx);
        
        // Renderizar indicadores visuales del progreso
        this.renderProgressIndicators();
    }

    /**
     * Dibuja indicadores visuales del progreso
     */
    renderProgressIndicators() {
        // Mostrar partículas de agua si hay agua recogida
        if (this.world.waterLevel > 10) {
            this.drawWaterParticles();
        }

        // Mostrar indicador de vida animal
        if (this.world.waterLevel > 30) {
            this.drawLifeIndicator();
        }
    }

    /**
     * Dibuja partículas de agua animadas
     */
    drawWaterParticles() {
        const particleCount = Math.floor(this.world.waterLevel / 20);
        const time = this.gameTime * 2;

        for (let i = 0; i < particleCount; i++) {
            const angle = (time + i * Math.PI * 2 / particleCount);
            const x = this.canvas.width * 0.5 + Math.cos(angle) * 80;
            const y = this.canvas.height * 0.4 + Math.sin(angle) * 60;

            this.ctx.fillStyle = `rgba(33, 150, 243, ${0.3 + Math.sin(time + i) * 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Dibuja indicador de vida (animales)
     */
    drawLifeIndicator() {
        const indicatorX = 50;
        const indicatorY = this.canvas.height - 50;
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.fillRect(indicatorX - 25, indicatorY - 20, 50, 40);
        
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🐟 Vida', indicatorX, indicatorY);
    }

    /**
     * Finaliza el juego
     */
    endGame() {
        this.isRunning = false;
        
        // Reproducir sonido de victoria
        audioManager.playSuccessSound();
        setTimeout(() => audioManager.playSuccessSound(), 200);
        setTimeout(() => audioManager.playSuccessSound(), 400);
        
        // Mostrar pantalla final
        setTimeout(() => {
            uiManager.showEndScreen();
        }, 1000);
    }

    /**
     * Pausa el juego
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Reanuda el juego
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Obtiene el estado actual del juego
     */
    getState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            progress: this.world.getProgress(),
            stats: this.world.stats,
            gameTime: this.gameTime
        };
    }
}

/**
 * Inicializar el juego cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

/**
 * Manejar visibilidad de la página (pausa automática)
 */
document.addEventListener('visibilitychange', () => {
    if (window.game?.isRunning) {
        if (document.hidden) {
            window.game.pause();
        } else {
            window.game.resume();
        }
    }
});

/**
 * Permitir cierre seguro en móvil
 */
window.addEventListener('beforeunload', () => {
    if (window.game?.isRunning) {
        audioManager.stopAll();
    }
});
