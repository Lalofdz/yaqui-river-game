/**
 * @file world.js
 * @description Gestión del mundo del juego, elementos, colisiones y renderizado
 */

class World {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Elementos del mundo
        this.elements = [];
        this.collectibles = [];
        this.obstacles = [];
        
        // Estado del río
        this.waterLevel = 0; // 0-100
        this.greenLevel = 0; // Vegetación
        this.pollutionLevel = 100;
        
        // Objetivos
        this.targetWater = 15;
        this.targetTrees = 8;
        this.targetTrash = 12;
        
        // Seguimiento de progreso
        this.stats = {
            water: 0,
            trees: 0,
            trash: 0
        };
        
        this.initializeWorld();
    }

    /**
     * Inicializa el mundo con elementos
     */
    initializeWorld() {
        // Crear río (base del mundo)
        this.createRiver();
        
        // Crear elementos recolectables
        this.createCollectibles();
        
        // Crear obstáculos y elementos interactivos
        this.createObstacles();
    }

    /**
     * Dibuja el río y el paisaje
     */
    createRiver() {
        // El río se dibujará dinámicamente en render()
        this.river = {
            x: this.width * 0.3,
            y: 0,
            width: this.width * 0.4,
            height: this.height,
            waterColor: '#87ceeb',
            sandColor: '#deb887'
        };
    }

    /**
     * Crea elementos recolectables (agua, árboles, etc.)
     */
    createCollectibles() {
        const collectibles = [];

        // Gotas de agua
        for (let i = 0; i < 15; i++) {
            collectibles.push({
                id: `water_${i}`,
                type: 'water',
                x: Math.random() * (this.width - 100) + 50,
                y: Math.random() * (this.height - 200) + 100,
                radius: 8,
                collected: false,
                emoji: '💧'
            });
        }

        // Árboles para plantar
        for (let i = 0; i < 10; i++) {
            collectibles.push({
                id: `tree_${i}`,
                type: 'tree',
                x: Math.random() * (this.width - 150) + 75,
                y: Math.random() * (this.height - 300) + 150,
                width: 40,
                height: 50,
                planted: false,
                emoji: '🌱'
            });
        }

        // Basura para limpiar
        for (let i = 0; i < 15; i++) {
            collectibles.push({
                id: `trash_${i}`,
                type: 'trash',
                x: Math.random() * (this.width - 80) + 40,
                y: Math.random() * (this.height - 200) + 100,
                width: 20,
                height: 20,
                cleaned: false,
                emoji: '🗑'
            });
        }

        this.collectibles = collectibles;
    }

    /**
     * Crea obstáculos y elementos del mundo
     */
    createObstacles() {
        const obstacles = [];

        // Rocas (obstáculos de colisión)
        for (let i = 0; i < 8; i++) {
            obstacles.push({
                id: `rock_${i}`,
                type: 'rock',
                x: Math.random() * (this.width - 60) + 30,
                y: Math.random() * (this.height - 150) + 75,
                radius: 25,
                emoji: '🪨'
            });
        }

        // Desvíos de agua (obstáculos)
        for (let i = 0; i < 3; i++) {
            obstacles.push({
                id: `redirect_${i}`,
                type: 'redirect',
                x: this.width * 0.35 + i * 100,
                y: this.height * 0.4 + Math.random() * 100,
                width: 50,
                height: 30,
                emoji: '🚧'
            });
        }

        // Contaminación industrial
        for (let i = 0; i < 4; i++) {
            obstacles.push({
                id: `pollution_${i}`,
                type: 'pollution',
                x: Math.random() * (this.width - 100) + 50,
                y: Math.random() * (this.height - 200) + 100,
                radius: 20,
                emoji: '🏭'
            });
        }

        // Cultivos (zonas interactivas)
        for (let i = 0; i < 3; i++) {
            obstacles.push({
                id: `crops_${i}`,
                type: 'crops',
                x: Math.random() * (this.width - 100) + 50,
                y: Math.random() * (this.height - 150) + 75,
                width: 60,
                height: 40,
                emoji: '🌽'
            });
        }

        // Peces (indicadores de vida)
        for (let i = 0; i < 5; i++) {
            obstacles.push({
                id: `fish_${i}`,
                type: 'fish',
                x: this.width * 0.35 + Math.random() * (this.width * 0.3),
                y: this.height * 0.5 + Math.random() * 100,
                radius: 15,
                emoji: '🐟',
                visible: false
            });
        }

        this.obstacles = obstacles;
    }

    /**
     * Detecta colisión entre dos objetos circulares
     */
    checkCollision(obj1, obj2) {
        const radius1 = obj1.radius || Math.max(obj1.width || 0, obj1.height || 0) / 2;
        const radius2 = obj2.radius || Math.max(obj2.width || 0, obj2.height || 0) / 2;

        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (radius1 + radius2);
    }

    /**
     * Actualiza el estado del mundo basado en progreso
     */
    updateWorldState() {
        const progress = this.getProgress();

        // Actualizar nivel de agua
        this.waterLevel = (this.stats.water / this.targetWater) * 100;

        // Actualizar nivel de vegetación
        this.greenLevel = (this.stats.trees / this.targetTrees) * 100;

        // Reducir contaminación
        this.pollutionLevel = 100 - (this.stats.trash / this.targetTrash) * 100;

        // Mostrar peces cuando hay suficiente agua
        if (this.waterLevel > 30) {
            this.obstacles.forEach(obs => {
                if (obs.type === 'fish') {
                    obs.visible = true;
                }
            });
        }
    }

    /**
     * Obtiene el porcentaje de progreso (0-100)
     */
    getProgress() {
        const waterProgress = Math.min(this.stats.water / this.targetWater, 1);
        const treeProgress = Math.min(this.stats.trees / this.targetTrees, 1);
        const trashProgress = Math.min(this.stats.trash / this.targetTrash, 1);

        return Math.round(((waterProgress + treeProgress + trashProgress) / 3) * 100);
    }

    /**
     * Verifica si el juego está completado
     */
    isGameComplete() {
        return this.stats.water >= this.targetWater &&
               this.stats.trees >= this.targetTrees &&
               this.stats.trash >= this.targetTrash;
    }

    /**
     * Renderiza el mundo en el canvas
     */
    render() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Dibujar fondo
        this.drawBackground();

        // Dibujar río
        this.drawRiver();

        // Dibujar obstáculos
        this.drawObstacles();

        // Dibujar elementos recolectables
        this.drawCollectibles();

        // Dibujar vegetación según progreso
        this.drawVegetation();
    }

    /**
     * Dibuja el fondo del juego
     */
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        
        // Gradiente basado en contaminación
        const skyColor = this.pollutionLevel > 70 ? '#7dd3c0' : '#87ceeb';
        const groundColor = this.greenLevel > 40 ? '#90ee90' : '#deb887';

        gradient.addColorStop(0, skyColor);
        gradient.addColorStop(1, groundColor);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Dibuja el río
     */
    drawRiver() {
        const riverY = this.height * 0.4;
        const riverWidth = this.width * 0.4;
        const riverX = this.width * 0.3;

        // Color del río basado en nivel de agua
        const waterAlpha = Math.min(this.waterLevel / 100, 0.8);
        this.ctx.fillStyle = `rgba(33, 150, 243, ${waterAlpha})`;

        // Dibujar río con forma ondulante
        this.ctx.beginPath();
        this.ctx.moveTo(riverX, 0);
        
        for (let i = 0; i <= this.height; i += 20) {
            const wave = Math.sin((i / 50 + Date.now() / 1000)) * 5;
            this.ctx.lineTo(riverX + riverWidth + wave, i);
        }
        
        this.ctx.lineTo(riverX, this.height);
        this.ctx.fill();

        // Dibujar orilla del río
        this.ctx.strokeStyle = '#1976d2';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    /**
     * Dibuja obstáculos
     */
    drawObstacles() {
        this.obstacles.forEach(obs => {
            if (obs.type === 'rock') {
                this.drawCircle(obs.x, obs.y, obs.radius, '#999999', obs.emoji);
            } else if (obs.type === 'redirect') {
                this.drawRect(obs.x, obs.y, obs.width, obs.height, '#ff9800', obs.emoji);
            } else if (obs.type === 'pollution') {
                this.drawCircle(obs.x, obs.y, obs.radius, '#8b4513', obs.emoji);
            } else if (obs.type === 'crops') {
                this.drawRect(obs.x, obs.y, obs.width, obs.height, '#8bc34a', obs.emoji);
            } else if (obs.type === 'fish' && obs.visible) {
                this.drawCircle(obs.x, obs.y, obs.radius, '#ff6b6b', obs.emoji);
            }
        });
    }

    /**
     * Dibuja elementos recolectables
     */
    drawCollectibles() {
        this.collectibles.forEach(item => {
            if (item.collected) return;

            if (item.type === 'water') {
                this.drawCircle(item.x, item.y, item.radius, '#2196f3', item.emoji);
            } else if (item.type === 'tree') {
                this.drawRect(item.x, item.y, item.width, item.height, '#7cb342', item.emoji);
            } else if (item.type === 'trash') {
                this.drawRect(item.x, item.y, item.width, item.height, '#999999', item.emoji);
            }
        });
    }

    /**
     * Dibuja vegetación según el progreso
     */
    drawVegetation() {
        if (this.greenLevel < 10) return;

        const treeCount = Math.floor((this.greenLevel / 100) * 20);

        for (let i = 0; i < treeCount; i++) {
            const x = 50 + (i % 5) * 100;
            const y = 100 + Math.floor(i / 5) * 80;
            
            this.ctx.fillStyle = '#7cb342';
            this.ctx.fillRect(x + 15, y + 30, 10, 20);
            
            this.ctx.fillStyle = '#9ccc65';
            this.ctx.beginPath();
            this.ctx.arc(x + 20, y + 20, 15, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Dibuja un círculo con emoji
     */
    drawCircle(x, y, radius, color, emoji) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Dibujar emoji
        this.ctx.font = `${radius * 1.8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(emoji, x, y);
    }

    /**
     * Dibuja un rectángulo con emoji
     */
    drawRect(x, y, width, height, color, emoji) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);

        // Dibujar emoji
        this.ctx.font = `${Math.min(width, height) * 0.8}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(emoji, x + width / 2, y + height / 2);
    }

    /**
     * Reinicia el mundo
     */
    reset() {
        this.stats = { water: 0, trees: 0, trash: 0 };
        this.waterLevel = 0;
        this.greenLevel = 0;
        this.pollutionLevel = 100;

        this.collectibles.forEach(item => item.collected = false);
        this.obstacles.forEach(obs => obs.visible = false);

        this.createCollectibles();
        this.createObstacles();
    }
}
