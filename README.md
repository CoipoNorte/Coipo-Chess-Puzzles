# ♞ [Coipo Chess — Puzzles](https://coiponorte.github.io/Coipo-Chess-Puzzles/)

Un generador de puzzles de ajedrez al estilo de Chess.com, diseñado como Progressive Web App mobile-first con arquitectura lista para migración a **React Native + Expo (NativeWind)**.

![Chess Puzzles](https://img.shields.io/badge/Chess-Puzzles-81b64c?style=for-the-badge)

## 🎯 Características

### Puzzles
- **40+ puzzles verificados** de la base de datos de Lichess + puzzles generados dinámicamente
- **Categorías claras**: Mate en 1/2, Sacrificio, Clavada, Horquilla, Captura, Desarrollo, Control del Centro, Finales
- **Multi-movimiento**: Puzzles de 1 a 4+ jugadas con respuesta automática del oponente
- **Rating Elo** por puzzle (300–1760+)

### Experiencia de Usuario
- **Objetivo claro**: Cada puzzle muestra qué tipo de jugada buscar (🎯 Mejor Jugada, ♚ Mate, 💥 Sacrificio, etc.)
- **Auto-reintentar**: Al fallar, el tablero tiembla, la pieza regresa animada, y puedes seguir intentando
- **Pista**: Resalta la casilla de origen de la jugada correcta
- **Resolver**: Auto-ejecuta la solución con animación
- **Explicación educativa**: Al completar cada puzzle, una explicación enseña el concepto táctico aplicado
- **Sonidos**: Efectos Web Audio API para mover, capturar, acierto, error y completar

### Estadísticas
- Puzzles resueltos / intentados
- Tasa de éxito
- Racha actual / mejor racha
- Rating estimado con sistema Elo simplificado
- Historial visual de últimos 24 puzzles
- Todo persistido en **localStorage**

## 🛠️ Stack Técnico

| Tecnología | Uso |
|---|---|
| **React 19** | UI components |
| **TypeScript** | Type safety |
| **Vite 7** | Build tool |
| **Tailwind CSS 4** | Utility classes (+ CSS custom classes) |
| **chess.js** | Validación de movimientos, FEN, reglas |
| **Zustand** | State management |
| **Web Audio API** | Sound effects |

## 📱 Diseño Mobile-First

- Layout scrollable (→ `ScrollView` en RN)
- Tablero responsive al ancho completo
- Todos los estilos son **inline `style={{}}`** (migración directa a React Native)
- Sin pseudo-elementos CSS (incompatibles con RN)
- Flexbox explícito con `flexDirection: 'row'`
- Touch targets ≥ 44px

## 🚀 Migración a React Native + Expo

Este proyecto está diseñado para migrar a Expo con mínimo esfuerzo:

### Paso 1: Nuevo proyecto
```bash
npx create-expo-app chess-puzzles --template tabs
cd chess-puzzles
npx expo install nativewind tailwindcss
```

### Paso 2: Dependencias equivalentes
| Web | React Native |
|---|---|
| `localStorage` | `@react-native-async-storage/async-storage` |
| `div` | `View` |
| `p` / `span` | `Text` |
| `button` | `TouchableOpacity` / `Pressable` |
| CSS animations | `react-native-reanimated` |
| `overflow: auto` | `ScrollView` |
| SVG inline | `react-native-svg` |

### Paso 3: Reemplazar
- `chess.js` → funciona igual ✅
- `zustand` → funciona igual ✅
- Inline `style={{}}` → funciona igual ✅
- Clases `.card`, `.btn-*` → componentes `<Card>`, `<Button>` propios

## 📂 Estructura

```
src/
├── App.tsx                 # Layout principal
├── index.css               # Estilos globales + clases reutilizables
├── store/
│   └── puzzleStore.ts      # Zustand: toda la lógica del puzzle
├── data/
│   └── puzzles.ts          # Base de datos de puzzles + explicaciones
├── engine/
│   └── puzzleGenerator.ts  # Validador + generador dinámico
├── components/
│   ├── ChessBoard.tsx      # Tablero interactivo (tap + drag)
│   ├── ChessPieces.tsx     # SVG de piezas estándar
│   ├── NavBar.tsx           
│   ├── PuzzleHeader.tsx    # Goal + rating + info
│   ├── PuzzleStatus.tsx    # Barra de estado (turno, correcto, error)
│   ├── ActionButtons.tsx   # Pista, Resolver, Siguiente
│   ├── Explanation.tsx     # Explicación educativa post-puzzle
│   ├── MoveHistory.tsx     # Historial de jugadas
│   ├── PlayerBar.tsx       # Barras de jugador
│   ├── StatsPanel.tsx      # Panel de estadísticas
│   └── SettingsPanel.tsx   # Configuración (sonido)
└── utils/
    ├── sounds.ts           # Web Audio API
    └── cn.ts               # Tailwind merge utility
```

## 🏃 Ejecutar

```bash
npm install
npm run dev      # Desarrollo
npm run build    # Producción → dist/index.html
```

## 📜 Licencia

MIT — Uso libre para aprendizaje y proyectos personales.
