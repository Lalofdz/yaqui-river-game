/**
 * GUÍA TÉCNICA - RÍO YAQUI VIDEOJUEGO
 * 
 * Este archivo documenta detalles técnicos del desarrollo
 */

/* ============================================
   ARQUITECTURA DEL PROYECTO
   ============================================ */

ESTRUCTURA MODULAR:
├─ index.html (Punto de entrada)
├─ style.css (Estilos globales)
└─ js/
   ├─ audio.js → Sistema de audio
   ├─ world.js → Motor del mundo
   ├─ player.js → Lógica del jugador
   ├─ ui.js → Interfaz de usuario
   └─ game.js → Loop principal

FLUJO DE EJECUCIÓN:
1. Navegador carga index.html
2. Se cargan CSS y módulos JS
3. DOMContentLoaded dispara new Game()
4. Inicialización de componentes
5. Espera en pantalla de inicio
6. Usuario presiona "Comenzar"
7. Inicia gameLoop() con requestAnimationFrame

/* ============================================
   CANVAS Y RENDERIZADO
   ============================================ */

SISTEMA DE COORDENADAS:
- Origen (0,0) en esquina superior izquierda
- X crece hacia la derecha
- Y crece hacia abajo
- Canvas se redimensiona automáticamente

RENDERIZADO POR CAPAS:
1. Background (gradiente de cielo a tierra)
2. Río (forma ondulante con opacidad dinámica)
3. Obstáculos (rocas, contaminación, cultivos)
4. Elementos recolectables (agua, árboles, basura)
5. Vegetación (árboles animados)
6. Jugador (círculo azul con emoji)

FPS OBJETIVO: 60 FPS (16.67ms por frame)
OPTIMIZACIONES:
- requestAnimationFrame para sincronización
- clearRect antes de cada frame
- Caché de contexto del canvas
- No crear objetos innecesarios en loop

/* ============================================
   SISTEMA DE COLISIONES
   ============================================ */

DETECCIÓN:
Función checkCollision() calcula distancia entre centros:
distance = √((x1 - x2)² + (y1 - y2)²)
si distance < radius1 + radius2 → COLISIÓN

RESOLUCIÓN:
1. Calcular vector de empuje
2. Mover jugador fuera del obstáculo
3. Reducir velocidad (0.7x)
4. Continuar movimiento

CÁLCULO PRECISO:
- Jugador: radio = 15px
- Obstáculos: radio = 25px (rocas), 20px (otros)
- Elementos: radio = 8px (agua), 10px (otros)

/* ============================================
   SISTEMA DE MOVIMIENTO
   ============================================ */

FÍSICA APLICADA:
acceleration = 0.4
friction = 0.92
maxSpeed = 5 px/frame

CÁLCULO POR FRAME:
1. Leer entrada (teclado/joystick)
2. Aplicar aceleración: v += input * acceleration
3. Limitar velocidad máxima
4. Aplicar fricción: v *= friction
5. Actualizar posición: pos += v
6. Detener si |v| < 0.1
7. Mantener en límites del canvas

ENTRADA NORMALIZADA:
- Entrada diagonal: calcular magnitud y normalizar
- Joystick: convertir a rango [-1, 1]
- Teclado: convertir teclas a vector 2D

/* ============================================
   INTERACCIÓN CON ELEMENTOS
   ============================================ */

DETECCIÓN DE PROXIMIDAD:
- Rango de interacción: 50px
- Cooldown entre interacciones: 300ms
- Se calcula cada frame

RECOLECCIÓN:
Agua (💧): stats.water++, playCollectSound()
Árbol (🌱): stats.trees++, playSuccessSound()
Basura (🗑): stats.trash++, playCleanSound()

ACTUALIZACIÓN DE ESTADO:
1. Marcar elemento como collected
2. Incrementar estadística
3. Reproducir sonido
4. Llamar world.updateWorldState()
5. Verificar objetivos

/* ============================================
   SISTEMA DE OBJETIVOS
   ============================================ */

OBJETIVOS:
- Agua: 15 (targetWater)
- Árboles: 8 (targetTrees)
- Basura: 12 (targetTrash)

PROGRESO:
progress = (waterProgress + treeProgress + trashProgress) / 3 * 100

VERIFICACIÓN DE VICTORIA:
isGameComplete() retorna true cuando:
stats.water >= 15 AND
stats.trees >= 8 AND
stats.trash >= 12

/* ============================================
   SISTEMA DE AUDIO
   ============================================ */

WEB AUDIO API:
- AudioContext: contexto global del navegador
- Osciladores: generan tonos sintéticos
- Filtros: modifican frecuencias
- Gain: controlan volumen

SONIDOS CREADOS:
1. Viento (Oscilador sine, 40-60 Hz)
2. Agua (Ruido blanco filtrado, 1000 Hz)
3. Pájaros (Tonos aleatorios 1000-3000 Hz)
4. Recolectar (Sonido "ding" 800-1200 Hz)
5. Limpiar (Sonido "sweep" 400-300 Hz)
6. Éxito (Acordes Do-Mi-Sol)

VOLUMEN:
masterVolume = 0.3 (30%)
sfxVolume = 0.5 (50%)
musicVolume = 0.3 (30%)

/* ============================================
   SISTEMA DE EVENTOS EDUCATIVOS
   ============================================ */

EVENTOS DISPARADOS:
1. firstWater (stats.water === 1)
2. halfWater (stats.water === 7-8)
3. firstTree (stats.trees === 1)
4. firstTrash (stats.trash === 1)
5. halfway (progress === 50)
6. halfTrash (stats.trash >= 6)
7. almostDone (progress === 75)

SISTEMA DE FLAGS:
eventShownAt = {} para evitar duplicados
Cada evento marca su bandera al mostrarse

/* ============================================
   JOYSTICK VIRTUAL MÓVIL
   ============================================ */

DETECCIÓN MÓVIL:
Usa regex en navigator.userAgent para detectar:
/Android|webOS|iPhone|iPad|.../ 

IMPLEMENTACIÓN:
- Base circular de 100x100px
- Stick interior de 50x50px
- Cálculo de distancia desde centro
- Limitación a radio máximo
- Entrada normalizada [-1, 1]

EVENTOS:
touchstart → iniciar
touchmove → actualizar posición
touchend/touchcancel → resetear
También soporta mouse para debug

/* ============================================
   RESPONSIVIDAD Y ADAPTACIÓN
   ============================================ */

BREAKPOINTS CSS:
- Desktop: > 768px
- Tablet: 480px - 768px
- Mobile: < 480px

CANVAS RESIZABLE:
- Escucha evento 'resize'
- Recalcula dimensiones
- Mantiene aspect ratio
- Se redibuja automáticamente

AJUSTES POR DISPOSITIVO:
- PC: teclado visible
- Móvil: joystick visible, stats más pequeños
- Pantalla pequeña: fuentes reducidas

/* ============================================
   OPTIMIZACIÓN DE RENDIMIENTO
   ============================================ */

TÉCNICAS IMPLEMENTADAS:
1. requestAnimationFrame (sincronización)
2. Canvas en lugar de DOM
3. Caché de variables frecuentes
4. Evitar creación de objetos en loop
5. Usar funciones flecha en game loop
6. Detección móvil una sola vez
7. Event listeners delegados
8. clearRect vs fillRect (más eficiente)

PAUSA AUTOMÁTICA:
- Cuando pestaña pierde enfoque (document.hidden)
- Reanuda cuando vuelve al foco
- Ahorra batería en móvil

/* ============================================
   COMPATIBILIDAD DE NAVEGADORES
   ============================================ */

REQUISITOS:
- Canvas 2D (contexto '2d')
- Web Audio API (AudioContext)
- requestAnimationFrame
- ES6+ (const, let, arrow functions, classes)
- CSS3 (Flexbox, Grid, Gradients)

SOPORTE:
Chrome: ✅ (80+)
Firefox: ✅ (75+)
Safari: ✅ (13+)
Edge: ✅ (80+)
Opera: ✅ (67+)

/* ============================================
   VALIDACIÓN Y TESTING
   ============================================ */

PRUEBAS MANUALES:
✓ Movimiento en 8 direcciones
✓ Interacción con todos los elementos
✓ Colisiones sin atravesar muros
✓ Audio sin delay
✓ Responsivo en móvil
✓ Sin errores en consola
✓ Progreso guarda correctamente
✓ Victory condition dispara

CASOS EXTREMOS:
- Jugador en borde del canvas
- Múltiples colisiones simultáneas
- Baja conexión de red (carga lenta)
- Audio context no disponible
- Ventana muy pequeña

/* ============================================
   EXTENSIBILIDAD
   ============================================ */

CÓMO AGREGAR ELEMENTOS:
1. Crear objeto en createCollectibles()
2. Agregar caso en drawCollectibles()
3. Registrar en checkCollisions()
4. Agregar lógica en interactWithItem()

CÓMO AGREGAR EVENTOS:
1. Definir trigger en checkGameEvents()
2. Crear flag en eventShownAt
3. Llamar uiManager.showEvent()
4. Reproducir sonido apropiado

CÓMO PERSONALIZAR NIVELES:
1. Modificar targetWater, targetTrees, targetTrash
2. Cambiar cantidad de elementos en create*()
3. Ajustar velocidades en Player
4. Modificar colores en style.css

/* ============================================
   DEBUGGING
   ============================================ */

ÚTILES PARA DESARROLLO:
- Abrir DevTools: F12
- Console para logs
- Network para cargas
- Performance para FPS
- Uncomment líneas de debug en mundo (radio de colisión)

LOGS ÚTILES:
console.log(game.getState()) → ver estado del juego
console.log(world.stats) → ver objetivos
console.log(player.x, player.y) → posición
console.log(game.gameTime) → tiempo jugado

/* ============================================
   INFORMACIÓN DE COMPILACIÓN
   ============================================ */

SIN BUILD REQUERIDO:
- No necesita webpack, parcel, etc
- No necesita transpilación
- Funciona directamente con HTML5
- Ideal para distribución rápida

TAMAÑO TOTAL:
- index.html: ~5.8 KB
- style.css: ~11.1 KB
- js/audio.js: ~7.8 KB
- js/world.js: ~12.4 KB
- js/player.js: ~9.8 KB
- js/ui.js: ~5.9 KB
- js/game.js: ~9.6 KB
TOTAL: ~62.4 KB (sin minificar)

Minificado estimado: ~25 KB
Gzipped estimado: ~8 KB

/* ============================================
   CONSIDERACIONES DE SEGURIDAD
   ============================================ */

✓ No hace peticiones a servidores
✓ No almacena datos personales
✓ No ejecuta código externo
✓ No tiene dependencias con vulnerabilidades
✓ HTML5 sandbox nativo
✓ Sin acceso a cámara/micrófono
✓ Sin acceso a archivos del sistema

/* ============================================
   CONCLUSIÓN
   ============================================ */

Este proyecto demuestra:
- Arquitectura limpia y modular
- Uso eficiente de Canvas 2D
- Web Audio API moderno
- Código educativo y bien documentado
- Diseño responsivo completo
- Sin frameworks externos
- Optimizado para rendimiento
- Experiencia de usuario fluida

Perfecto para:
- Portfolio profesional
- Referencia educativa
- Base para proyectos mayores
- Demostración de skills JavaScript
