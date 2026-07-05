/**
 * @file player.js
 * @description Gestión del jugador, movimiento, colisiones y control
 */

class Player {
    constructor(x, y, world) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.world = world;
        this.speed = 5;
        this.maxSpeed = 5;
        
        // Variables de movimiento
        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = 0.4;
        this.friction = 0.92;
        
        // Control
        this.keys = {};
        this.joystickInput = { x: 0, y: 0 };
        this.isMobile = this.detectMobile();
        
        // Interacción
        this.interactionRadius = 50;
        this.lastInteractionTime = 0;
        this.interactionCooldown = 300; // ms
        
        this.setupControls();
    }

    /**
     * Detecta si es dispositivo móvil
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Configura los controles del teclado y móvil
     */
    setupControls() {
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Prevenir scroll con flechas
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Joystick virtual para móvil
        if (this.isMobile) {
            this.setupJoystick();
        }
    }

    /**
     * Configura el joystick virtual
     */
    setupJoystick() {
        const container = document.getElementById('joystickContainer');
        const base = document.getElementById('joystickBase');
        const stick = document.getElementById('joystickStick');

        if (!container || !base || !stick) return;

        container.classList.add('visible');

        let isActive = false;
        let baseRect = base.getBoundingClientRect();
        const baseRadius = baseRect.width / 2;
        const stickRadius = stick.getBoundingClientRect().width / 2;

        const handleStart = (e) => {
            isActive = true;
            baseRect = base.getBoundingClientRect();
        };

        const handleMove = (e) => {
            if (!isActive) return;

            const touch = e.touches ? e.touches[0] : e;
            const centerX = baseRect.left + baseRect.width / 2;
            const centerY = baseRect.top + baseRect.height / 2;

            let deltaX = touch.clientX - centerX;
            let deltaY = touch.clientY - centerY;

            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = baseRadius - stickRadius;

            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                deltaX = Math.cos(angle) * maxDistance;
                deltaY = Math.sin(angle) * maxDistance;
            }

            // Normalizar entrada
            this.joystickInput.x = deltaX / maxDistance;
            this.joystickInput.y = deltaY / maxDistance;

            // Actualizar posición visual del stick
            stick.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        };

        const handleEnd = () => {
            isActive = false;
            this.joystickInput = { x: 0, y: 0 };
            stick.style.transform = 'translate(0, 0)';
        };

        base.addEventListener('touchstart', handleStart);
        base.addEventListener('touchmove', handleMove);
        base.addEventListener('touchend', handleEnd);
        base.addEventListener('touchcancel', handleEnd);

        // Soporte para mouse (desarrollo)
        base.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }

    /**
     * Actualiza la posición del jugador
     */
    update() {
        this.handleInput();
        this.updatePhysics();
        this.checkCollisions();
        this.handleInteractions();
    }

    /**
     * Procesa la entrada del jugador
     */
    handleInput() {
        const keys = this.keys;
        let inputX = 0;
        let inputY = 0;

        // Entrada de teclado
        if (keys['w'] || keys['arrowup']) inputY = -1;
        if (keys['s'] || keys['arrowdown']) inputY = 1;
        if (keys['a'] || keys['arrowleft']) inputX = -1;
        if (keys['d'] || keys['arrowright']) inputX = 1;

        // Entrada de joystick (móvil)
        if (Math.abs(this.joystickInput.x) > 0.1) inputX = this.joystickInput.x;
        if (Math.abs(this.joystickInput.y) > 0.1) inputY = this.joystickInput.y;

        // Normalizar entrada diagonal
        if (inputX !== 0 && inputY !== 0) {
            const length = Math.sqrt(inputX * inputX + inputY * inputY);
            inputX /= length;
            inputY /= length;
        }

        // Aplicar aceleración
        if (inputX !== 0) {
            this.velocityX += inputX * this.acceleration;
        }
        if (inputY !== 0) {
            this.velocityY += inputY * this.acceleration;
        }
    }

    /**
     * Actualiza la física del movimiento
     */
    updatePhysics() {
        // Limitar velocidad
        const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
        if (speed > this.maxSpeed) {
            const ratio = this.maxSpeed / speed;
            this.velocityX *= ratio;
            this.velocityY *= ratio;
        }

        // Aplicar fricción
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;

        // Detener movimiento si es muy pequeño
        if (Math.abs(this.velocityX) < 0.1) this.velocityX = 0;
        if (Math.abs(this.velocityY) < 0.1) this.velocityY = 0;

        // Actualizar posición
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Mantener dentro de los límites del canvas
        const padding = this.radius + 10;
        if (this.x < padding) this.x = padding;
        if (this.x > this.world.width - padding) this.x = this.world.width - padding;
        if (this.y < padding) this.y = padding;
        if (this.y > this.world.height - padding) this.y = this.world.height - padding;
    }

    /**
     * Verifica colisiones con obstáculos
     */
    checkCollisions() {
        this.world.obstacles.forEach(obstacle => {
            if (this.world.checkCollision(this, obstacle)) {
                this.resolveCollision(obstacle);
            }
        });
    }

    /**
     * Resuelve la colisión con un obstáculo
     */
    resolveCollision(obstacle) {
        const dx = this.x - obstacle.x;
        const dy = this.y - obstacle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) return;

        const minDistance = this.radius + (obstacle.radius || Math.max(obstacle.width || 0, obstacle.height || 0) / 2);
        const overlap = minDistance - distance;

        // Empujar jugador fuera del obstáculo
        const pushX = (dx / distance) * overlap;
        const pushY = (dy / distance) * overlap;

        this.x += pushX;
        this.y += pushY;

        // Reducir velocidad
        this.velocityX *= 0.7;
        this.velocityY *= 0.7;
    }

    /**
     * Maneja interacciones con elementos recolectables
     */
    handleInteractions() {
        const now = Date.now();
        if (now - this.lastInteractionTime < this.interactionCooldown) return;

        // Verificar elementos recolectables
        this.world.collectibles.forEach(item => {
            if (item.collected) return;

            if (this.isNear(item)) {
                this.interactWithItem(item);
                this.lastInteractionTime = now;
            }
        });
    }

    /**
     * Verifica si el jugador está cerca de un elemento
     */
    isNear(item) {
        const dx = this.x - item.x;
        const dy = this.y - item.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.interactionRadius;
    }

    /**
     * Interactúa con un elemento
     */
    interactWithItem(item) {
        if (item.type === 'water') {
            item.collected = true;
            this.world.stats.water++;
            audioManager.playCollectSound();
        } else if (item.type === 'tree') {
            item.collected = true;
            this.world.stats.trees++;
            audioManager.playSuccessSound();
        } else if (item.type === 'trash') {
            item.collected = true;
            this.world.stats.trash++;
            audioManager.playCleanSound();
        }

        // Actualizar estado del mundo
        this.world.updateWorldState();
    }

    /**
     * Dibuja el jugador
     */
    render(ctx) {
        // Dibujar personaje
        ctx.fillStyle = '#4a90e2';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Dibujar emoji del personaje
        ctx.font = `${this.radius * 1.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👤', this.x, this.y);

        // Dibujar radio de interacción (debug)
        // ctx.strokeStyle = 'rgba(74, 144, 226, 0.2)';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.interactionRadius, 0, Math.PI * 2);
        // ctx.stroke();
    }

    /**
     * Reinicia la posición del jugador
     */
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.joystickInput = { x: 0, y: 0 };
    }
}
