import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Info } from 'lucide-react';

const XORShiftTuringMachine = () => {
  const [seed, setSeed] = useState('110010');
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [c, setC] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState('IDLE');
  const [tape, setTape] = useState([]);
  const [headPosition, setHeadPosition] = useState(0);
  const [generatedValues, setGeneratedValues] = useState([]);
  const [cycleDetected, setCycleDetected] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [showSettings, setShowSettings] = useState(false);

  // Máquina de Turing - Operaciones básicas
  class TuringMachine {
    constructor(initialValue, a, b, c) {
      this.tape = initialValue.split('');
      this.head = 0;
      this.state = 'INIT';
      this.a = a;
      this.b = b;
      this.c = c;
      this.workingArea = [];
      this.generatedSequence = [initialValue];
    }

    // Desplazamiento a la izquierda (<<)
    shiftLeft(value, positions) {
      const bits = value.split('');
      const shifted = [...bits.slice(positions), ...Array(positions).fill('0')];
      return shifted.join('').slice(0, bits.length);
    }

    // Desplazamiento a la derecha (>>)
    shiftRight(value, positions) {
      const bits = value.split('');
      const shifted = [...Array(positions).fill('0'), ...bits.slice(0, -positions)];
      return shifted.join('');
    }

    // Operación XOR bit a bit
    xorOperation(val1, val2) {
      const result = [];
      for (let i = 0; i < val1.length; i++) {
        result.push(val1[i] === val2[i] ? '0' : '1');
      }
      return result.join('');
    }

    // Ejecutar una iteración completa del XOR-Shift
    executeIteration(currentValue) {
      // x = x XOR (x << a)
      let shifted = this.shiftLeft(currentValue, this.a);
      let step1 = this.xorOperation(currentValue, shifted);

      // x = x XOR (x >> b)
      shifted = this.shiftRight(step1, this.b);
      let step2 = this.xorOperation(step1, shifted);

      // x = x XOR (x << c)
      shifted = this.shiftLeft(step2, this.c);
      let step3 = this.xorOperation(step2, shifted);

      return step3;
    }

    // Verificar si hay repetición
    checkRepetition(value) {
      return this.generatedSequence.includes(value);
    }

    // Ejecutar hasta encontrar ciclo
    runUntilCycle() {
      let current = this.generatedSequence[0];
      let iterations = 0;
      const maxIterations = 100; // Seguridad

      while (iterations < maxIterations) {
        const next = this.executeIteration(current);
        
        if (this.checkRepetition(next)) {
          return {
            sequence: this.generatedSequence,
            cycleLength: this.generatedSequence.length,
            repeatedValue: next,
            cycleDetected: true
          };
        }

        this.generatedSequence.push(next);
        current = next;
        iterations++;
      }

      return {
        sequence: this.generatedSequence,
        cycleLength: this.generatedSequence.length,
        repeatedValue: null,
        cycleDetected: false
      };
    }
  }

  const runMachine = () => {
    if (!seed.match(/^[01]+$/)) {
      alert('La semilla debe contener solo 0s y 1s');
      return;
    }

    setIsRunning(true);
    setCycleDetected(false);
    setGeneratedValues([seed]);
    setCurrentIteration(0);
    setCurrentState('RUNNING');

    const machine = new TuringMachine(seed, a, b, c);
    let current = seed;
    let iteration = 0;

    const interval = setInterval(() => {
      const next = machine.executeIteration(current);
      
      if (machine.checkRepetition(next)) {
        setGeneratedValues(prev => [...prev, next]);
        setCycleDetected(true);
        setCurrentState('CYCLE_DETECTED');
        setIsRunning(false);
        clearInterval(interval);
        return;
      }

      machine.generatedSequence.push(next);
      setGeneratedValues(prev => [...prev, next]);
      setCurrentIteration(prev => prev + 1);
      current = next;
      iteration++;

      if (iteration >= 100) {
        setCurrentState('MAX_ITERATIONS');
        setIsRunning(false);
        clearInterval(interval);
      }
    }, speed);
  };

  const reset = () => {
    setIsRunning(false);
    setCurrentState('IDLE');
    setGeneratedValues([]);
    setCycleDetected(false);
    setCurrentIteration(0);
  };

  const presetConfigs = [
    { name: '(1,3,2)', a: 1, b: 3, c: 2 },
    { name: '(1,3,3)', a: 1, b: 3, c: 3 },
    { name: '(1,3,4)', a: 1, b: 3, c: 4 },
    { name: '(2,3,1)', a: 2, b: 3, c: 1 },
    { name: '(3,3,1)', a: 3, b: 3, c: 1 },
    { name: '(4,3,1)', a: 4, b: 3, c: 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Máquina de Turing - Generador XOR-Shift</h1>
              <p className="text-gray-600 mt-2">Simulación de generador pseudoaleatorio</p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              <Settings className="w-6 h-6 text-blue-600" />
            </button>
          </div>

          {/* Configuración */}
          {showSettings && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold text-gray-700 mb-3">Configuración de Parámetros</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semilla binaria (6 bits recomendado)
                  </label>
                  <input
                    type="text"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    disabled={isRunning}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
                    placeholder="110010"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Velocidad (ms)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-600">{speed}ms</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parámetro a (shift left)
                  </label>
                  <input
                    type="number"
                    value={a}
                    onChange={(e) => setA(Number(e.target.value))}
                    disabled={isRunning}
                    min="1"
                    max="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parámetro b (shift right)
                  </label>
                  <input
                    type="number"
                    value={b}
                    onChange={(e) => setB(Number(e.target.value))}
                    disabled={isRunning}
                    min="1"
                    max="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parámetro c (shift left)
                  </label>
                  <input
                    type="number"
                    value={c}
                    onChange={(e) => setC(Number(e.target.value))}
                    disabled={isRunning}
                    min="1"
                    max="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Configuraciones recomendadas (período máximo 63 para 6 bits)
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetConfigs.map((config) => (
                    <button
                      key={config.name}
                      onClick={() => {
                        setA(config.a);
                        setB(config.b);
                        setC(config.c);
                      }}
                      disabled={isRunning}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm disabled:opacity-50"
                    >
                      {config.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Controles */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={runMachine}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Play className="w-5 h-5" />
              Iniciar
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reiniciar
            </button>
          </div>

          {/* Estado actual */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="text-lg font-semibold text-gray-800">{currentState}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Iteración</p>
                <p className="text-lg font-semibold text-gray-800">{currentIteration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valores generados</p>
                <p className="text-lg font-semibold text-gray-800">{generatedValues.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Parámetros</p>
                <p className="text-lg font-semibold text-gray-800">({a}, {b}, {c})</p>
              </div>
            </div>
          </div>

          {/* Ciclo detectado */}
          {cycleDetected && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-center">
                <Info className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-yellow-800">¡Ciclo detectado!</h3>
                  <p className="text-yellow-700 text-sm">
                    La secuencia se repitió después de {generatedValues.length - 1} iteraciones.
                    Longitud del ciclo: {generatedValues.length - 1}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Secuencia generada */}
          {generatedValues.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Secuencia generada:</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {generatedValues.map((value, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded ${
                        index === generatedValues.length - 1 && cycleDetected
                          ? 'bg-red-100 border border-red-300'
                          : index === generatedValues.length - 1
                          ? 'bg-blue-100'
                          : 'bg-white'
                      }`}
                    >
                      <span className="text-sm text-gray-600 font-medium w-16">
                        x₍{index}₎ =
                      </span>
                      <span className="font-mono text-lg font-semibold">
                        {value}
                      </span>
                      <span className="text-sm text-gray-500">
                        (decimal: {parseInt(value, 2)})
                      </span>
                      {index === generatedValues.length - 1 && cycleDetected && (
                        <span className="ml-auto text-red-600 font-semibold text-sm">
                          ← REPETICIÓN
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Información */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Acerca del algoritmo</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Esta Máquina de Turing simula un generador XOR-Shift que aplica tres operaciones:
              <br />1. x = x XOR (x &lt;&lt; a)
              <br />2. x = x XOR (x &gt;&gt; b)
              <br />3. x = x XOR (x &lt;&lt; c)
              <br /><br />
              El generador es determinista pero produce secuencias que parecen aleatorias. 
              Con los parámetros correctos para 6 bits, puede alcanzar un período de 63 (máximo posible excluyendo el 0).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XORShiftTuringMachine;