/**
 * Máquina de Turing - Generador XOR-Shift
 * Implementación correcta que simula una MT real
 * Basada en el código de Brandon Amarillo
 */

// Estados de la máquina
export const State = {
  INIT: 'INIT',
  COPY_READ: 'COPY_READ',
  COPY_WRITE: 'COPY_WRITE',
  PRE_SHIFT_COPY_MARK: 'PRE_SHIFT_COPY_MARK',
  PRE_SHIFT_COPY_FIND_TARGET: 'PRE_SHIFT_COPY_FIND_TARGET',
  PRE_SHIFT_COPY_WRITE_BIT: 'PRE_SHIFT_COPY_WRITE_BIT',
  PRE_SHIFT_COPY_RETURN: 'PRE_SHIFT_COPY_RETURN',
  PRE_SHIFT_COPY_RESTORE: 'PRE_SHIFT_COPY_RESTORE',
  SHIFT_POSITION: 'SHIFT_POSITION',
  SHIFT_START: 'SHIFT_START',
  SHIFT_READ: 'SHIFT_READ',
  SHIFT_WRITE: 'SHIFT_WRITE',
  SHIFT_FILL_ZERO: 'SHIFT_FILL_ZERO',
  XOR_MARK: 'XOR_MARK',
  XOR_FIND_BLANK: 'XOR_FIND_BLANK',
  XOR_FIND_COMPARE: 'XOR_FIND_COMPARE',
  XOR_COMPARE_BIT: 'XOR_COMPARE_BIT',
  XOR_RETURN: 'XOR_RETURN',
  COMPARE_INIT: 'COMPARE_INIT',
  COMPARE_CHECK: 'COMPARE_CHECK',
  CYCLE_DETECTED: 'CYCLE_DETECTED',
  HALT: 'HALT'
};

export class TuringMachine {
  constructor(seed, a, b, c) {
    // Cinta infinita
    this.tape = this.initializeTape(seed);
    this.headPosition = 1; // Empezar en la semilla
    
    // Parámetros del XOR-Shift
    this.a = a;
    this.b = b;
    this.c = c;
    this.bitLength = seed.length;
    
    // Control de estados
    this.state = State.INIT;
    this.currentStateDescription = `Inicializado con semilla: ${seed}`;
    
    // Variables de trabajo
    this.generatedValues = [seed];
    this.executionLog = [`x₀ = ${seed}`, `Parámetros: a=${a}, b=${b}, c=${c}`];
    this.cycleDetected = false;
    this.stepCount = 0;
    this.transitions = 0;
    
    // Variables para operaciones
    this.tempChar = null;
    this.counter = 0;
    this.readPos1 = 0;
    this.readPos2 = 0;
    this.currentIteration = 0;
    this.currentOp = '';
    
    // Control de flujo de operaciones
    this.phaseStep = 0;
    this.shiftCounter = 0;
    this.shiftAmount = 0;
    this.isShiftLeft = false;
    this.xorBitPos = 0;
    this.markedBit = null;
    this.xorStartPos = 0;
    this.xorComparePos = 0;
    this.copySourcePos = 0;
    this.copyTargetPos = 0;
    this.blanksSeen = 0;
  }

  // Inicializar cinta con símbolo blanco y semilla
  initializeTape(seed) {
    const BLANK = '▲';
    const tape = [BLANK];
    
    // Agregar semilla
    for (let char of seed) {
      tape.push(char);
    }
    
    // Agregar blancos al final
    for (let i = 0; i < 200; i++) {
      tape.push(BLANK);
    }
    
    return tape;
  }

  // Leer símbolo en la posición del cabezal
  read() {
    return this.tape[this.headPosition];
  }

  // Escribir símbolo en la posición del cabezal
  write(symbol) {
    this.tape[this.headPosition] = symbol;
  }

  // Mover cabezal a la derecha
  moveRight() {
    this.headPosition++;
    
    // Expandir cinta si es necesario
    if (this.headPosition >= this.tape.length - 10) {
      for (let i = 0; i < 50; i++) {
        this.tape.push('▲');
      }
    }
  }

  // Mover cabezal a la izquierda
  moveLeft() {
    if (this.headPosition > 0) {
      this.headPosition--;
    }
  }

  // Encontrar siguiente blanco desde una posición
  findNextBlank(startPos) {
    // Asegurar que hay suficiente espacio
    while (startPos >= this.tape.length - 10) {
      for (let i = 0; i < 50; i++) {
        this.tape.push('▲');
      }
    }
    
    for (let i = startPos; i < this.tape.length; i++) {
      if (this.tape[i] === '▲') {
        return i;
      }
    }
    
    return this.tape.length - 1;
  }

  // Leer sección de la cinta
  readSection(start, length) {
    let result = '';
    for (let i = start; i < start + length && i < this.tape.length; i++) {
      const c = this.tape[i];
      if (c !== '▲' && c !== '#') {
        result += c;
      }
    }
    return result;
  }

  // Ejecutar UN SOLO PASO de la máquina de Turing
  step() {
    if (this.state === State.HALT) {
      return false;
    }

    this.stepCount++;

    switch (this.state) {
      case State.INIT:
        this.currentStateDescription = `Iniciando iteración ${this.currentIteration + 1}`;
        this.executionLog.push(`--- Iteración ${this.currentIteration + 1} ---`);
        
        // Buscar última posición escrita
        if (this.currentIteration === 0) {
          this.readPos1 = 1; // Semilla inicial
        } else {
          this.readPos1 = 1;
          for (let i = 0; i < this.currentIteration; i++) {
            this.readPos1 = this.findNextBlank(this.readPos1) + 1;
          }
        }
        
        this.copySourcePos = this.readPos1;
        this.copyTargetPos = this.findNextBlank(this.readPos1 + this.bitLength) + 1;
        this.counter = 0;
        this.phaseStep = 0;
        this.transitions++;
        this.executionLog.push('Copia inicial con marcadores');
        this.state = State.PRE_SHIFT_COPY_MARK;
        return true;

      case State.PRE_SHIFT_COPY_MARK:
        if (this.counter < this.bitLength) {
          this.headPosition = this.copySourcePos + this.counter;
          this.markedBit = this.read();
          
          if (this.markedBit === '▲' || this.markedBit === '#') {
            this.counter = 0;
            this.headPosition = this.copySourcePos;
            this.transitions++;
            this.state = State.PRE_SHIFT_COPY_RESTORE;
            return true;
          }
          
          this.write('#');
          this.currentStateDescription = `Marcando bit ${this.counter} ('${this.markedBit}') con # en pos ${this.headPosition}`;
          this.blanksSeen = 0;
          this.transitions++;
          this.state = State.PRE_SHIFT_COPY_FIND_TARGET;
        } else {
          this.counter = 0;
          this.transitions++;
          this.headPosition = this.copySourcePos;
          this.state = State.PRE_SHIFT_COPY_RESTORE;
        }
        return true;

      case State.PRE_SHIFT_COPY_FIND_TARGET:
        this.moveRight();
        const currentPos = this.headPosition;
        const targetWritePos = this.copyTargetPos + this.counter;
        
        this.currentStateDescription = `Avanzando hacia pos ${targetWritePos}, actual: ${currentPos}`;
        
        if (currentPos >= targetWritePos) {
          this.headPosition = targetWritePos;
          this.currentStateDescription = `Llegamos a posición de escritura ${targetWritePos}`;
          this.transitions++;
          this.state = State.PRE_SHIFT_COPY_WRITE_BIT;
        }
        return true;

      case State.PRE_SHIFT_COPY_WRITE_BIT:
        if (this.read() === '▲') {
          this.write(this.markedBit);
          this.currentStateDescription = `Escribiendo '${this.markedBit}' en pos ${this.headPosition}`;
          this.transitions++;
          this.state = State.PRE_SHIFT_COPY_RETURN;
        } else {
          this.executionLog.push(`ERROR: No se encontró ▲ para escribir en pos ${this.headPosition}`);
          this.transitions++;
          this.state = State.PRE_SHIFT_COPY_RETURN;
        }
        return true;

      case State.PRE_SHIFT_COPY_RETURN:
        this.moveLeft();
        this.currentStateDescription = `Retrocediendo a # desde pos ${this.headPosition}`;
        
        if (this.read() === '#') {
          this.write(this.markedBit);
          this.currentStateDescription = `Restaurando '${this.markedBit}' en pos ${this.headPosition}`;
          this.counter++;
          this.transitions++;
          this.state = State.PRE_SHIFT_COPY_MARK;
        }
        return true;

      case State.PRE_SHIFT_COPY_RESTORE:
        if (this.counter < this.bitLength) {
          this.headPosition = this.copySourcePos + this.counter;
          
          if (this.read() === '#') {
            this.executionLog.push(`ERROR: Encontrado # en restauración en pos ${this.headPosition}`);
          }
          
          this.counter++;
          return true;
        } else {
          const copiedForShift = this.readSection(this.copyTargetPos, this.bitLength);
          
          if (this.phaseStep === 0) {
            // Copia inicial completa
            this.executionLog.push(`Copia inicial: ${copiedForShift}`);
            this.readPos1 = this.copyTargetPos;
            this.copySourcePos = this.copyTargetPos;
            this.copyTargetPos = this.findNextBlank(this.copyTargetPos + this.bitLength) + 1;
            this.counter = 0;
            this.phaseStep = 1;
            this.executionLog.push('Preparando copia para shift A');
            this.transitions++;
            this.state = State.PRE_SHIFT_COPY_MARK;
          } else if (this.phaseStep === 1) {
            // Copia para shift A completa
            this.executionLog.push(`Copia para shift A: ${copiedForShift}`);
            this.readPos2 = this.copyTargetPos;
            this.prepareShift(this.a, true, 'x << a');
            this.transitions++;
          } else if (this.phaseStep === 2) {
            // Copia para shift B completa
            this.executionLog.push(`Copia para shift B: ${copiedForShift}`);
            this.readPos2 = this.copyTargetPos;
            this.prepareShift(this.b, false, 'x >> b');
            this.transitions++;
          } else if (this.phaseStep === 3) {
            // Copia para shift C completa
            this.executionLog.push(`Copia para shift C: ${copiedForShift}`);
            this.readPos2 = this.copyTargetPos;
            this.prepareShift(this.c, true, 'x << c');
            this.transitions++;
          }
        }
        return true;

      case State.SHIFT_POSITION:
        // Posicionarse al inicio o final según tipo de shift
        if (this.isShiftLeft) {
          this.headPosition = this.readPos1;
          this.currentStateDescription = 'Posicionándose al inicio para shift left';
        } else {
          this.headPosition = this.readPos1 + this.bitLength - 1;
          this.currentStateDescription = 'Posicionándose al final para shift right';
        }
        this.transitions++;
        this.state = State.SHIFT_START;
        return true;

      case State.SHIFT_START:
        if (this.shiftCounter < this.shiftAmount) {
          this.currentStateDescription = `Shift (${this.shiftCounter + 1}/${this.shiftAmount}): Iniciando`;
          this.counter = this.isShiftLeft ? 0 : (this.bitLength - 1);
          this.headPosition = this.readPos1 + this.counter;
          this.transitions++;
          this.state = State.SHIFT_READ;
        } else {
          // Shift completo, iniciar XOR
          const shifted = this.readSection(this.readPos1, this.bitLength);
          this.executionLog.push(`${this.currentOp} = ${shifted}`);
          this.xorStartPos = this.readPos1;
          this.xorComparePos = this.readPos2;
          this.xorBitPos = 0;
          this.headPosition = this.xorStartPos;
          this.transitions++;
          this.state = State.XOR_MARK;
        }
        return true;

      case State.SHIFT_READ:
        const nextPos = this.isShiftLeft ? (this.counter + 1) : (this.counter - 1);
        const shouldFillZero = this.isShiftLeft ? (nextPos >= this.bitLength) : (nextPos < 0);
        
        if (!shouldFillZero) {
          this.headPosition = this.readPos1 + nextPos;
          this.tempChar = this.read();
          this.currentStateDescription = `Shift: Leyendo '${this.tempChar}' de pos ${this.readPos1 + nextPos}`;
          this.state = State.SHIFT_WRITE;
        } else {
          this.state = State.SHIFT_FILL_ZERO;
        }
        this.transitions++;
        return true;

      case State.SHIFT_WRITE:
        this.headPosition = this.readPos1 + this.counter;
        this.write(this.tempChar);
        this.currentStateDescription = `Shift: Pisando pos ${this.readPos1 + this.counter} con '${this.tempChar}'`;
        this.counter = this.isShiftLeft ? (this.counter + 1) : (this.counter - 1);
        this.transitions++;
        this.state = State.SHIFT_READ;
        return true;

      case State.SHIFT_FILL_ZERO:
        const zeroPos = this.isShiftLeft ? (this.readPos1 + this.bitLength - 1) : this.readPos1;
        this.headPosition = zeroPos;
        this.write('0');
        this.currentStateDescription = `Shift: Rellenando con 0 en pos ${zeroPos}`;
        this.shiftCounter++;
        this.transitions++;
        this.state = State.SHIFT_START;
        return true;

      case State.XOR_MARK:
        if (this.xorBitPos < this.bitLength) {
          this.headPosition = this.xorStartPos + this.xorBitPos;
          this.markedBit = this.read();
          
          if (this.markedBit === '▲' || this.markedBit === '#') {
            this.finishXOR();
            return true;
          }
          
          this.write('#');
          this.currentStateDescription = `XOR: Marcando bit ${this.xorBitPos} ('${this.markedBit}') con #`;
          this.transitions++;
          this.state = State.XOR_FIND_BLANK;
        } else {
          this.finishXOR();
        }
        return true;

      case State.XOR_FIND_BLANK:
        this.moveRight();
        this.currentStateDescription = `XOR: Buscando ▲ en pos ${this.headPosition}`;
        
        if (this.read() === '▲') {
          this.transitions++;
          this.state = State.XOR_FIND_COMPARE;
        }
        return true;

      case State.XOR_FIND_COMPARE:
        this.moveRight();
        const c = this.read();
        this.currentStateDescription = `XOR: Buscando bit de comparación en pos ${this.headPosition}`;
        
        if (c !== '▲') {
          this.tempChar = c;
          this.transitions++;
          this.state = State.XOR_COMPARE_BIT;
        }
        return true;

      case State.XOR_COMPARE_BIT:
        this.write('▲');
        this.currentStateDescription = `XOR: Reemplazando '${this.tempChar}' con ▲`;
        this.transitions++;
        this.state = State.XOR_RETURN;
        return true;

      case State.XOR_RETURN:
        this.moveLeft();
        this.currentStateDescription = `XOR: Retrocediendo a # desde pos ${this.headPosition}`;
        
        if (this.read() === '#') {
          const result = (this.markedBit === this.tempChar) ? '0' : '1';
          this.write(result);
          this.currentStateDescription = `XOR: ${this.markedBit} ⊕ ${this.tempChar} = ${result}`;
          this.xorBitPos++;
          this.transitions++;
          this.state = State.XOR_MARK;
        }
        return true;

      case State.COMPARE_INIT:
        if (this.counter < this.generatedValues.length) {
          const current = this.readSection(this.readPos1, this.bitLength);
          const previous = this.generatedValues[this.counter];
          
          this.currentStateDescription = `Comparando x${this.currentIteration} con x${this.counter}`;
          this.executionLog.push(`Comparando: ${current} vs ${previous}`);
          
          if (current === previous) {
            this.cycleDetected = true;
            this.state = State.CYCLE_DETECTED;
            this.executionLog.push('¡CICLO DETECTADO!');
            this.executionLog.push(`Período = ${this.generatedValues.length}`);
            this.executionLog.push(`Valor repetido: ${current} (x${this.counter})`);
            return true;
          }
          
          this.counter++;
        } else {
          const newValue = this.readSection(this.readPos1, this.bitLength);
          this.generatedValues.push(newValue);
          this.executionLog.push(`x${this.currentIteration} = ${newValue} (nuevo)`);
          this.executionLog.push('');
          
          // Copiar resultado final para siguiente iteración
          this.copySourcePos = this.readPos1;
          this.copyTargetPos = this.findNextBlank(this.readPos1 + this.bitLength) + 1;
          this.counter = 0;
          this.transitions++;
          this.state = State.PRE_SHIFT_COPY_MARK;
          this.phaseStep = 0;
          this.currentIteration++;
        }
        return true;

      case State.CYCLE_DETECTED:
        this.currentStateDescription = `¡CICLO DETECTADO! Período: ${this.generatedValues.length}`;
        this.state = State.HALT;
        return false;

      default:
        return false;
    }
  }

  prepareShift(amount, isLeft, operation) {
    this.shiftCounter = 0;
    this.shiftAmount = amount;
    this.isShiftLeft = isLeft;
    this.currentOp = operation;
    this.state = State.SHIFT_POSITION;
  }

  finishXOR() {
    const xorResult = this.readSection(this.xorStartPos, this.bitLength);
    
    if (this.phaseStep === 1) {
      // Terminó x XOR (x << a)
      this.executionLog.push(`x XOR (x << a) = ${xorResult}`);
      
      this.copySourcePos = this.xorStartPos;
      this.copyTargetPos = this.findNextBlank(this.xorStartPos + this.bitLength) + 1;
      this.counter = 0;
      this.phaseStep = 2;
      this.state = State.PRE_SHIFT_COPY_MARK;
      
    } else if (this.phaseStep === 2) {
      // Terminó x XOR (x >> b)
      this.executionLog.push(`x XOR (x >> b) = ${xorResult}`);
      
      this.copySourcePos = this.xorStartPos;
      this.copyTargetPos = this.findNextBlank(this.xorStartPos + this.bitLength) + 1;
      this.counter = 0;
      this.phaseStep = 3;
      this.state = State.PRE_SHIFT_COPY_MARK;
      
    } else if (this.phaseStep === 3) {
      // Terminó x XOR (x << c) - RESULTADO FINAL
      this.executionLog.push(`x XOR (x << c) = ${xorResult} (RESULTADO FINAL)`);
      
      this.readPos1 = this.xorStartPos;
      this.counter = 0;
      this.currentIteration++;
      this.state = State.COMPARE_INIT;
    }
  }

  // Getters para el estado
  getTapeState() {
    return {
      tape: [...this.tape],
      headPosition: this.headPosition,
      state: this.state,
      currentStateDescription: this.currentStateDescription
    };
  }

  getGeneratedValues() {
    return [...this.generatedValues];
  }

  getExecutionLog() {
    return [...this.executionLog];
  }

  isCycleDetected() {
    return this.cycleDetected;
  }

  getCycleLength() {
    return this.generatedValues.length;
  }

  getStepCount() {
    return this.stepCount;
  }

  getTransitions() {
    return this.transitions;
  }

  getCurrentState() {
    return this.currentStateDescription;
  }

  isHalted() {
    return this.state === State.HALT;
  }
}