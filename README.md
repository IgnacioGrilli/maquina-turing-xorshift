# Máquina de Turing - Generador XOR-Shift

Simulador de una Máquina de Turing que implementa un generador de números pseudoaleatorios XOR-Shift.

**Autor:** Ignacio Grilli, Matias Casteglione
**Institución:** Universidad Nacional de la Patagonia San Juan Bosco  
**Curso:** Fundamentos Teoricos de la Informatica  
**Fecha:** Noviembre 2024

---

## 📋 Descripción del Proyecto

Este proyecto implementa una **Máquina de Turing** que simula el comportamiento de un generador de números pseudoaleatorios del tipo XOR-Shift. El objetivo es comprender cómo una máquina determinista puede generar secuencias que parecen aleatorias, y estudiar cómo el período (repetición hasta volver a encontrar el número inicial) depende de los parámetros y del tamaño de palabra binaria.

### Características principales:

- ✅ **Implementación fiel al modelo de Turing**: Cinta infinita, estados discretos, transiciones atómicas
- ✅ **22 estados diferentes**: Cada fase del algoritmo descompuesta en operaciones básicas
- ✅ **Operaciones paso a paso**: Cada llamada ejecuta UNA sola transición de estado
- ✅ **Visualización en tiempo real**: Cinta, cabezal, estados y log de ejecución
- ✅ **Tres modos de ejecución**: Manual, automático y rápido
- ✅ **Detección automática de ciclos**: Calcula el período de la secuencia generada

---

## 🎯 El Algoritmo XOR-Shift

El generador XOR-Shift aplica tres operaciones sobre un valor binario:

```
x = x XOR (x << a)  // Desplazamiento izquierda y XOR
x = x XOR (x >> b)  // Desplazamiento derecha y XOR  
x = x XOR (x << c)  // Desplazamiento izquierda y XOR
```

### Parámetros:
- **Semilla inicial**: Valor binario de n bits (recomendado: 6 bits)
- **a, b, c**: Parámetros de desplazamiento (entre 1 y 6)

### Período máximo:
Con los parámetros correctos y 6 bits, se puede alcanzar un período de **63 valores** (2⁶ - 1), que es el máximo posible excluyendo el cero.

---

## 🔧 Tecnologías Utilizadas

### Frontend:
- **React 19**: Framework de interfaz de usuario
- **Vite**: Build tool y dev server
- **Tailwind CSS 4**: Framework de estilos utility-first
- **Lucide React**: Biblioteca de iconos
- **Hero Icons**: Iconos adicionales

### Lenguaje:
- **JavaScript (ES6+)**: Implementación de la Máquina de Turing

---

## 📦 Instalación

### Prerrequisitos:
- Node.js 18 o superior
- npm 9 o superior

### Pasos:

```bash
# 1. Clonar el repositorio
git clone https://github.com/IgnacioGrilli/maquina-turing-xorshift.git
cd maquina-turing-xorshift

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

### Construcción para producción:

```bash
npm run build
npm run preview
```

---

## 🎮 Uso de la Aplicación

### 1. Configuración inicial

1. Haz click en el icono ⚙️ (Settings) para abrir el panel de configuración
2. Configura los parámetros:
   - **Semilla binaria**: Ejemplo: `110010` (6 bits)
   - **Parámetro a**: Shift left inicial (recomendado: 1)
   - **Parámetro b**: Shift right (recomendado: 3)
   - **Parámetro c**: Shift left final (recomendado: 2)
   - **Velocidad**: Milisegundos entre pasos (100-2000ms)

3. Haz click en **"Inicializar Máquina"**

### 2. Modos de ejecución

#### Modo Manual (Aprendizaje):
```
1. Click en "Paso (Step)"
2. Observa cada operación individual
3. Repite para seguir la ejecución
```
**Uso:** Entender cómo funciona la Máquina de Turing

#### Modo Automático (Visualización):
```
1. Click en "Ejecutar Automático"
2. Ajusta la velocidad con el slider
3. Observa la ejecución animada
4. Click en "Pausar" para detener
```
**Uso:** Ver el proceso completo con animación

#### Modo Rápido (Resultados):
```
1. Click en "⚡ Ejecutar Completo"
2. Espera 2-5 segundos
3. Ver resultado final
```
**Uso:** Obtener resultados inmediatos sin animación

### 3. Configuraciones recomendadas

Para obtener el **período máximo de 63** con 6 bits, usa uno de estos parámetros:

| Configuración | Período |
|--------------|---------|
| (1, 3, 2) | 63 |
| (1, 3, 3) | 63 |
| (1, 3, 4) | 63 |
| (2, 3, 1) | 63 |
| (3, 3, 1) | 63 |
| (4, 3, 1) | 63 |

---

## 🏗️ Arquitectura del Proyecto

```
maquina-turing-xorshift/
├── src/
│   ├── core/
│   │   └── TuringMachine.js          # Motor de la Máquina de Turing
│   ├── components/
│   │   ├── Header.jsx                # Encabezado de la aplicación
│   │   ├── SettingsPanel.jsx         # Panel de configuración
│   │   ├── ControlButtons.jsx        # Botones de control
│   │   ├── StatusDisplay.jsx         # Display de estado
│   │   ├── TapeDisplay.jsx           # Visualización de la cinta
│   │   ├── ExecutionLog.jsx          # Log de ejecución
│   │   ├── SequenceDisplay.jsx       # Secuencia generada
│   │   ├── SequenceItem.jsx          # Item individual
│   │   ├── CycleAlert.jsx            # Alerta de ciclo
│   │   ├── InfoPanel.jsx             # Panel informativo
│   │   └── PresetButtons.jsx         # Botones de presets
│   ├── App.jsx                       # Componente principal
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Estilos globales
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧩 Componentes Principales

### TuringMachine.js

Clase principal que implementa la Máquina de Turing:

```javascript
class TuringMachine {
  constructor(seed, a, b, c) {
    this.tape = [];           // Cinta infinita
    this.headPosition = 1;    // Posición del cabezal
    this.state = State.INIT;  // Estado actual
    this.a = a;               // Parámetros del XOR-Shift
    this.b = b;
    this.c = c;
  }
  
  step() {
    // Ejecuta UNA transición de estado
  }
}
```

**Estados implementados:**
- INIT, PRE_SHIFT_COPY_MARK, PRE_SHIFT_COPY_FIND_TARGET
- PRE_SHIFT_COPY_WRITE_BIT, PRE_SHIFT_COPY_RETURN, PRE_SHIFT_COPY_RESTORE
- SHIFT_POSITION, SHIFT_START, SHIFT_READ, SHIFT_WRITE, SHIFT_FILL_ZERO
- XOR_MARK, XOR_FIND_BLANK, XOR_FIND_COMPARE, XOR_COMPARE_BIT, XOR_RETURN
- COMPARE_INIT, CYCLE_DETECTED, HALT

### TapeDisplay.jsx

Visualiza la cinta de Turing:
- Muestra símbolos: `0`, `1`, `▲` (blanco), `#` (marcador)
- Indica posición del cabezal con `▼`
- Colores según tipo de símbolo
- Scroll horizontal para navegar

---

## 🎓 Conceptos de Teoría de la Computación

### ¿Qué es una Máquina de Turing?

Una Máquina de Turing es un modelo matemático de computación que consta de:

1. **Cinta infinita**: Array que puede crecer indefinidamente
2. **Cabezal de lectura/escritura**: Puede leer, escribir y moverse
3. **Estados finitos**: Conjunto discreto de estados posibles
4. **Función de transición**: δ(estado, símbolo) → (nuevo_estado, símbolo, dirección)

### Diferencias clave con programación convencional:

| Programación Normal | Máquina de Turing |
|---------------------|-------------------|
| `array.shift()` | ~100 pasos |
| `a XOR b` | ~20 pasos por bit |
| Operaciones de alto nivel | Operaciones atómicas |
| Resultado inmediato | Miles de transiciones |

---

## 📊 Complejidad y Rendimiento

### Métricas para generar 63 valores (período completo):

- **Pasos ejecutados**: ~50,000
- **Transiciones de estado**: ~10,000
- **Celdas de cinta utilizadas**: ~400
- **Tiempo (modo rápido)**: 2-5 segundos
- **Tiempo (modo animado 50ms)**: ~5 minutos

### Por iteración (generar un valor):

- **Pasos**: ~800
- **Operaciones de shift**: 3 shifts × (6 bits + relleno)
- **Operaciones XOR**: 3 XORs × 6 bits = 18 operaciones
- **Copias de valores**: 4 copias completas

---

## 🔬 Experimentación

### Pruebas sugeridas:

1. **Período vs Parámetros**:
   ```
   Prueba: (1,1,1), (1,2,3), (2,3,4), etc.
   Observa: ¿Cómo cambia el período?
   ```

2. **Tamaño de semilla**:
   ```
   Prueba: 4 bits, 6 bits, 8 bits
   Observa: ¿Cómo crece el período máximo?
   Nota: 2^n - 1 es el máximo teórico
   ```

3. **Valores que generan ciclos cortos**:
   ```
   Prueba: 000000, 111111
   Observa: ¿Qué pasa con valores extremos?
   ```

---
## 🐛 Problemas Conocidos

### Navegador se congela momentáneamente:
**Causa**: Modo "Ejecutar Completo" procesa ~50,000 pasos en un bucle.  
**Solución**: Esperar 2-5 segundos. Esto es normal y esperado.

### Cinta muy larga causa scroll:
**Causa**: La cinta crece para acomodar todas las operaciones.  
**Solución**: Usa el scroll horizontal para navegar. Todo el contenido está visible.


## 📄 Licencia

MIT License

Copyright (c) 2024 Ignacio Grilli, Matias Casteglione

Se permite el uso, copia, modificación y distribución de este software con fines educativos y académicos.

## 👨‍💻 Autor
**Ignacio Grilli, , Matias Casteglione**
- GitHub: [@IgnacioGrilli](https://github.com/IgnacioGrilli)
- Proyecto: [maquina-turing-xorshift](https://github.com/IgnacioGrilli/maquina-turing-xorshift)

---
## 📞 Soporte

Para preguntas o problemas:
1. Revisa la documentación en `/docs`
2. Abre un Issue en GitHub
3. Consulta los archivos `.md` en el proyecto

---

## 🎯 Objetivos Académicos Cumplidos

- ✅ Implementar una Máquina de Turing funcional
- ✅ Simular un algoritmo complejo (XOR-Shift)
- ✅ Demostrar comprensión de teoría de la computación
- ✅ Aplicar conceptos de estados, transiciones y cinta infinita
- ✅ Visualizar el funcionamiento interno de una MT
- ✅ Documentar completamente el proyecto

---
**Versión del Proyecto**: 1.0.0  
**Última actualización**: Noviembre 2024  
**Estado**: ✅ Completo y funcional

**¡Gracias por usar este simulador de Máquina de Turing!** 🎉


