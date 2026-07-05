# 🌊 Río Yaqui - Videojuego Educativo Interactivo

**Restaura el agua, protege la vida del Pueblo Yaqui**

---

## 📋 Descripción

Río Yaqui es un videojuego educativo desarrollado en **HTML5, CSS3 y JavaScript puro** (sin frameworks ni dependencias externas) que sensibiliza sobre la importancia del agua y la lucha histórica del Pueblo Yaqui de Sonora por su defensa.

El jugador debe restaurar el Río Yaqui a través de acciones simples e intuitivas: recoger agua, plantar árboles y limpiar contaminación. Mientras mejor juegues, más verde y lleno de vida se vuelve el paisaje.

**Ideal para:**
- Proyectos educativos escolares
- Sensibilización ambiental
- Enseñanza interactiva
- PC y dispositivos móviles

---

## 🎮 Características

✅ **Gameplay Casual** - Se completa en 2-3 minutos  
✅ **Controles Intuitivos** - WASD/Flechas en PC, Joystick virtual en móvil  
✅ **Colisiones Perfectas** - Sistema de física sin bugs  
✅ **Diseño Responsivo** - Funciona en cualquier dispositivo  
✅ **Audio Inmersivo** - Sonidos ambientales con Web Audio API  
✅ **Eventos Educativos** - Mensajes informativos durante el juego  
✅ **Progresión Visual** - El mundo cambia según tus acciones  
✅ **Sin Dependencias Externas** - Solo HTML5, CSS3, JavaScript vanilla  

---

## 📱 Controles

### 🖥️ Computadora
- **WASD** o **Flechas** - Movimiento
- Acércate a elementos para recogerlos automáticamente

### 📱 Móvil
- **Joystick Virtual** - Toca y arrastra para moverte
- Acércate a elementos para recogerlos automáticamente

---

## 🎯 Objetivos del Juego

| Objetivo | Meta | Icono |
|----------|------|-------|
| Recoger Agua | 15 gotas | 💧 |
| Plantar Árboles | 8 árboles | 🌱 |
| Limpiar Basura | 12 basuras | 🗑 |

Completa los tres objetivos para restaurar el Río Yaqui y ver la animación final.

---

## 📁 Estructura del Proyecto

```
yaqui-river-game/
├── index.html          # Estructura HTML principal
├── style.css           # Estilos CSS minimalista y responsivo
├── js/
│   ├── audio.js       # Sistema de audio (Web Audio API)
│   ├── world.js       # Gestión del mundo y elementos
│   ├── player.js      # Control del jugador y movimiento
│   ├── ui.js          # Interfaz de usuario y pantallas
│   └── game.js        # Loop principal y orquestación
└── README.md          # Este archivo
```

---

## 🚀 Instalación y Uso

### Opción 1: Clonar el Repositorio
```bash
git clone https://github.com/Lalofdz/yaqui-river-game.git
cd yaqui-river-game
```

### Opción 2: Descargar ZIP
Descarga el proyecto como ZIP desde GitHub y extrae los archivos.

### ▶️ Ejecutar el Juego
Simplemente abre `index.html` en tu navegador:
```bash
# En Linux/Mac
open index.html

# En Windows
start index.html

# O haz doble clic en index.html
```

**Listo.** El juego se abrirá en tu navegador. ¡No requiere servidor!

---

## 🏗️ Arquitectura del Código

### **audio.js**
- Gestión de sonidos con Web Audio API
- Sonidos ambientales (viento, agua, pájaros)
- Efectos de sonido para interacciones
- Control de volumen

### **world.js**
- Creación y gestión del mundo
- Colisiones entre objetos
- Renderizado con Canvas
- Sistema de objetivos y progreso
- Estados visuales dinámicos

### **player.js**
- Control del personaje (movimiento fluido)
- Entrada de teclado y joystick
- Sistema de colisiones robusto
- Interacciones con elementos del mundo
- Física realista (aceleración, fricción)

### **ui.js**
- Gestión de pantallas (inicio, controles, créditos, fin)
- Eventos educativos
- Actualización de estadísticas en tiempo real
- Modales interactivos

### **game.js**
- Loop principal (requestAnimationFrame)
- Orquestación de componentes
- Lógica de eventos del juego
- Manejo de fin de partida
- Pausa automática cuando la pestaña pierde enfoque

---

## 🎨 Diseño Visual

- **Minimalista y Moderno** - Sin pixel art retro
- **Colores Suaves** - Paleta amigable y educativa
- **Animaciones Fluidas** - Transiciones suaves en CSS
- **Emojis Intuitivos** - Iconografía clara y universal
- **Responsivo** - Adaptable a cualquier pantalla

### Paleta de Colores
- 🔵 Primario: `#4a90e2` (Azul)
- 🟢 Acento: `#7cb342` (Verde)
- 💧 Agua: `#2196f3` (Azul agua)
- ⚠️ Peligro: `#e74c3c` (Rojo)

---

## 📊 Progreso Visual

El juego muestra visualmente cómo cambia el mundo:

| Etapa | Río | Cielo | Terreno | Animales |
|-------|-----|-------|---------|----------|
| Inicio | 🏜️ Seco | Contaminado | Arena | ❌ Ocultos |
| 50% | 🌊 Parcial | Mejorando | Mixto | ⚠️ Aparecen |
| 100% | 💧 Lleno | Limpio | 🌳 Verde | ✅ Visibles |

---

## 🐛 Características Anti-Bug

✅ Sin duplicación de personaje  
✅ Sin atravesar objetos  
✅ Sin errores en consola  
✅ Código documentado  
✅ Colisiones suave y precisas  
✅ Responsive en todos los dispositivos  
✅ Pausa automática en segundo plano  
✅ Manejo seguro de memoria  

---

## 📱 Compatibilidad

| Navegador | PC | Móvil |
|-----------|----|----|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Edge | ✅ | ✅ |
| Opera | ✅ | ✅ |

**Requisitos Mínimos:**
- Navegador moderno (2020+)
- Soporte para Canvas y Web Audio API
- Sin requerimientos de instalación

---

## 🎓 Contenido Educativo

El juego integra mensajes sobre:

- 💧 **Defensa del Agua** - El derecho histórico de los Yaquis al agua
- 🌱 **Conservación Ambiental** - Importancia de la vegetación
- 🗑 **Contaminación** - Impacto de la contaminación industrial
- 🐟 **Biodiversidad** - La vida depende del agua
- 👥 **Cultura Yaqui** - Valoración de pueblos indígenas

Los eventos se muestran en momentos clave para maximizar el impacto educativo.

---

## 🔧 Personalización

### Cambiar Objetivos
En `js/world.js`, línea ~35:
```javascript
this.targetWater = 15;    // Gotas de agua
this.targetTrees = 8;     // Árboles
this.targetTrash = 12;    // Basura
```

### Cambiar Velocidad del Jugador
En `js/player.js`, línea ~17:
```javascript
this.speed = 5;           // Velocidad base
this.maxSpeed = 5;        // Velocidad máxima
```

### Ajustar Interacción
En `js/player.js`, línea ~36:
```javascript
this.interactionRadius = 50;  // Distancia para recoger items
```

### Modificar Eventos
En `js/game.js`, función `checkGameEvents()` (línea ~118+)

---

## 📈 Mejoras Futuras (Opcionales)

- 🎵 Música de fondo con osciladores
- 🏆 Sistema de puntuación avanzado
- 👥 Multijugador local
- 🌍 Localización a otros idiomas
- 💾 Guardado de progreso
- 🎯 Niveles de dificultad
- 🏅 Sistema de medallas/logros

---

## 📄 Licencia

Este proyecto es de **código abierto** para fines educativos.

---

## 👨‍💻 Desarrollo

**Tecnologías Utilizadas:**
- HTML5 Canvas
- CSS3 Flexbox & Grid
- JavaScript ES6+
- Web Audio API
- Vanilla JavaScript (sin frameworks)

**Principios de Diseño:**
- Separación de responsabilidades
- DRY (Don't Repeat Yourself)
- Código autodocumentado
- Arquitectura modular
- Optimizado para rendimiento

---

## 🙏 Créditos

**Desarrollado para:** Proyecto Educativo sobre el Pueblo Yaqui  
**Tema:** Defensa del Agua y Cultura Yaqui de Sonora  
**Tecnología:** HTML5, CSS3, JavaScript Vanilla  

> *"Cuidar el agua significa proteger la cultura, la naturaleza y el futuro."*

---

## 📞 Soporte

Si encuentras algún problema:

1. **Verifica tu navegador** - Usa un navegador moderno
2. **Limpia la caché** - Presiona Ctrl+F5 (o Cmd+Shift+R en Mac)
3. **Abre la consola** - F12 para ver si hay errores
4. **Revisa los requisitos** - Necesita Canvas y Web Audio API

---

## ✨ ¡A Jugar!

**¿Listo para restaurar el Río Yaqui?**

Abre `index.html` y comienza tu misión de restauración. Cada acción cuenta.

---

**Última actualización:** Julio 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Completamente Funcional
