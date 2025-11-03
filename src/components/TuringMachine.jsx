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
    let shifted = this.shiftLeft(currentValue, this.a);
    let step1 = this.xorOperation(currentValue, shifted);

    shifted = this.shiftRight(step1, this.b);
    let step2 = this.xorOperation(step1, shifted);

    shifted = this.shiftLeft(step2, this.c);
    let step3 = this.xorOperation(step2, shifted);

    return step3;
  }

  checkRepetition(value) {
    return this.generatedSequence.includes(value);
  }
}
