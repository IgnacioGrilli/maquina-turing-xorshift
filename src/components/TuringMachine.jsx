export class TuringMachine {
  constructor(initialValue, a, b, c) {
    this.tape = initialValue.split("");
    this.head = 0;
    this.state = "INIT";
    this.a = a;
    this.b = b;
    this.c = c;
    this.workingArea = [];
    this.generatedSequence = [initialValue];
    this.intermediateStates = [];
  }

  shiftLeft(value, positions) {
    const bits = value.split("");
    const shifted = [...bits.slice(positions), ...Array(positions).fill("0")];
    return shifted.join("").slice(0, bits.length);
  }

  shiftRight(value, positions) {
    const bits = value.split("");
    const shifted = [
      ...Array(positions).fill("0"),
      ...bits.slice(0, -positions),
    ];
    return shifted.join("");
  }

  xorOperation(val1, val2) {
    const result = [];
    for (let i = 0; i < val1.length; i++) {
      result.push(val1[i] === val2[i] ? "0" : "1");
    }
    return result.join("");
  }

  executeIteration(currentValue) {
    this.intermediateStates = [];
    const len = currentValue.length;
    
    // Estado inicial - cabezal en posición 0
    this.intermediateStates.push({
      tape: currentValue,
      head: 0,
      stepName: "Estado Inicial",
      operation: `Valor actual: ${currentValue}`,
      showShift: false
    });

    // Paso 1: Mostrar Shift Left antes del XOR
    let shifted1 = this.shiftLeft(currentValue, this.a);
    this.intermediateStates.push({
      tape: currentValue,
      shiftedTape: shifted1,
      head: 0,
      stepName: `Paso 1: Shift Left (${this.a} posiciones)`,
      operation: `${currentValue} << ${this.a} = ${shifted1}`,
      showShift: true,
      shiftDirection: "left",
      shiftAmount: this.a
    });

    // Paso 1: XOR bit a bit
    let step1Array = currentValue.split("");
    for (let i = 0; i < len; i++) {
      step1Array[i] = currentValue[i] === shifted1[i] ? "0" : "1";
      
      this.intermediateStates.push({
        tape: step1Array.join(""),
        originalTape: currentValue,
        shiftedTape: shifted1,
        head: i,
        stepName: `Paso 1: XOR bit ${i}`,
        operation: `${currentValue[i]} ⊕ ${shifted1[i]} = ${step1Array[i]}`,
        showShift: false
      });
    }
    const step1 = step1Array.join("");

    // Paso 2: Mostrar Shift Right antes del XOR
    let shifted2 = this.shiftRight(step1, this.b);
    this.intermediateStates.push({
      tape: step1,
      shiftedTape: shifted2,
      head: 0,
      stepName: `Paso 2: Shift Right (${this.b} posiciones)`,
      operation: `${step1} >> ${this.b} = ${shifted2}`,
      showShift: true,
      shiftDirection: "right",
      shiftAmount: this.b
    });

    // Paso 2: XOR bit a bit
    let step2Array = step1.split("");
    for (let i = 0; i < len; i++) {
      step2Array[i] = step1[i] === shifted2[i] ? "0" : "1";
      
      this.intermediateStates.push({
        tape: step2Array.join(""),
        originalTape: step1,
        shiftedTape: shifted2,
        head: i,
        stepName: `Paso 2: XOR bit ${i}`,
        operation: `${step1[i]} ⊕ ${shifted2[i]} = ${step2Array[i]}`,
        showShift: false
      });
    }
    const step2 = step2Array.join("");

    // Paso 3: Mostrar Shift Left antes del XOR
    let shifted3 = this.shiftLeft(step2, this.c);
    this.intermediateStates.push({
      tape: step2,
      shiftedTape: shifted3,
      head: 0,
      stepName: `Paso 3: Shift Left (${this.c} posiciones)`,
      operation: `${step2} << ${this.c} = ${shifted3}`,
      showShift: true,
      shiftDirection: "left",
      shiftAmount: this.c
    });

    // Paso 3: XOR bit a bit
    let step3Array = step2.split("");
    for (let i = 0; i < len; i++) {
      step3Array[i] = step2[i] === shifted3[i] ? "0" : "1";
      
      this.intermediateStates.push({
        tape: step3Array.join(""),
        originalTape: step2,
        shiftedTape: shifted3,
        head: i,
        stepName: `Paso 3: XOR bit ${i}`,
        operation: `${step2[i]} ⊕ ${shifted3[i]} = ${step3Array[i]}`,
        showShift: false
      });
    }
    const step3 = step3Array.join("");

    // Estado final - cabezal retorna a posición 0
    this.intermediateStates.push({
      tape: step3,
      head: 0,
      stepName: "Completo",
      operation: `Resultado: ${step3}`,
      showShift: false
    });

    return step3;
  }

  getIntermediateStates() {
    return this.intermediateStates;
  }

  checkRepetition(value) {
    return this.generatedSequence.includes(value);
  }
}