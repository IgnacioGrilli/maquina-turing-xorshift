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
      operation: `Iniciando en posición 0`
    });

    // Paso 1: Shift Left y XOR bit a bit
    let shifted1 = this.shiftLeft(currentValue, this.a);
    let step1Array = currentValue.split("");
    
    for (let i = 0; i < len; i++) {
      // Calcular XOR para este bit
      step1Array[i] = currentValue[i] === shifted1[i] ? "0" : "1";
      
      this.intermediateStates.push({
        tape: step1Array.join(""),
        head: i,
        stepName: `Paso 1: XOR bit ${i}`,
        operation: `${currentValue[i]} ⊕ ${shifted1[i]} = ${step1Array[i]}`
      });
    }
    const step1 = step1Array.join("");

    // Paso 2: Shift Right y XOR bit a bit
    let shifted2 = this.shiftRight(step1, this.b);
    let step2Array = step1.split("");
    
    for (let i = 0; i < len; i++) {
      // Calcular XOR para este bit
      step2Array[i] = step1[i] === shifted2[i] ? "0" : "1";
      
      this.intermediateStates.push({
        tape: step2Array.join(""),
        head: i,
        stepName: `Paso 2: XOR bit ${i}`,
        operation: `${step1[i]} ⊕ ${shifted2[i]} = ${step2Array[i]}`
      });
    }
    const step2 = step2Array.join("");

    // Paso 3: Shift Left y XOR bit a bit
    let shifted3 = this.shiftLeft(step2, this.c);
    let step3Array = step2.split("");
    
    for (let i = 0; i < len; i++) {
      // Calcular XOR para este bit
      step3Array[i] = step2[i] === shifted3[i] ? "0" : "1";
      
      this.intermediateStates.push({
        tape: step3Array.join(""),
        head: i,
        stepName: `Paso 3: XOR bit ${i}`,
        operation: `${step2[i]} ⊕ ${shifted3[i]} = ${step3Array[i]}`
      });
    }
    const step3 = step3Array.join("");

    // Estado final - cabezal retorna a posición 0
    this.intermediateStates.push({
      tape: step3,
      head: 0,
      stepName: "Completo",
      operation: `Resultado: ${step3}`
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
