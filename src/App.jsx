import { useState, useRef, useEffect } from "react";
import { TuringMachine } from "./core/TuringMachine";
import { Header } from "./components/Header";
import { SettingsPanel } from "./components/SettingsPanel";
import { ControlButtons } from "./components/ControlButtons";
import { StatusDisplay } from "./components/StatusDisplay";
import { TapeDisplay } from "./components/TapeDisplay";
import { ExecutionLog } from "./components/ExecutionLog";
import { SequenceDisplay } from "./components/SequenceDisplay";
import { CycleAlert } from "./components/CycleAlert";

function App() {
  // Configuración
  const [seed, setSeed] = useState("110010");
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [c, setC] = useState(2);
  const [speed, setSpeed] = useState(100); // ms entre pasos
  const [showSettings, setShowSettings] = useState(false);

  // Estado de la máquina
  const [machine, setMachine] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tapeState, setTapeState] = useState(null);
  const [generatedValues, setGeneratedValues] = useState([]);
  const [executionLog, setExecutionLog] = useState([]);
  const [cycleDetected, setCycleDetected] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [currentState, setCurrentState] = useState("No inicializado");

  const intervalRef = useRef(null);
  const isPausedRef = useRef(false);

  const presetConfigs = [
    { name: "(1,3,2)", a: 1, b: 3, c: 2 },
    { name: "(1,3,3)", a: 1, b: 3, c: 3 },
    { name: "(1,3,4)", a: 1, b: 3, c: 4 },
    { name: "(2,3,1)", a: 2, b: 3, c: 1 },
    { name: "(3,3,1)", a: 3, b: 3, c: 1 },
    { name: "(4,3,1)", a: 4, b: 3, c: 1 },
  ];

  // Sincronizar isPaused con ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Limpiar interval al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const initializeMachine = () => {
    if (!seed.match(/^[01]+$/)) {
      alert("La semilla debe contener solo 0s y 1s");
      return;
    }

    if (a <= 0 || b <= 0 || c <= 0) {
      alert("Los parámetros a, b, c deben ser mayores a 0");
      return;
    }

    if (a > 6 || b > 6 || c > 6) {
      alert("Los parámetros a, b, c deben estar entre 1 y 6");
      return;
    }

    // Crear nueva máquina
    const newMachine = new TuringMachine(seed, a, b, c);
    setMachine(newMachine);

    // Actualizar estado inicial
    updateDisplay(newMachine);

    alert(
      "Máquina inicializada correctamente. Presiona 'Ejecutar' para comenzar."
    );
  };

  const updateDisplay = (m) => {
    if (!m) return;

    const state = m.getTapeState();
    setTapeState(state);
    setGeneratedValues(m.getGeneratedValues());
    setExecutionLog(m.getExecutionLog());
    setCycleDetected(m.isCycleDetected());
    setStepCount(m.getStepCount());
    setCurrentState(m.getCurrentState());
  };

  const runToCompletion = () => {
    if (!machine) {
      alert("Primero debes inicializar la máquina");
      return;
    }

    setIsRunning(true);
    setCurrentState("Ejecutando hasta completar...");

    // Ejecutar en el siguiente tick para que se actualice la UI
    setTimeout(() => {
      let continued = true;
      let steps = 0;
      const maxSteps = 100000; // Límite de seguridad

      while (continued && steps < maxSteps) {
        continued = machine.step();
        steps++;

        // Actualizar display cada 1000 pasos para feedback
        if (steps % 1000 === 0) {
          updateDisplay(machine);
        }

        if (machine.isCycleDetected()) {
          break;
        }
      }

      // Actualización final
      updateDisplay(machine);
      setIsRunning(false);

      if (machine.isCycleDetected()) {
        alert(
          `¡Ciclo detectado!\nPeríodo: ${machine.getCycleLength()} valores\n` +
            `Transiciones: ${machine.getTransitions()}\n` +
            `Pasos: ${machine.getStepCount()}`
        );
      } else if (steps >= maxSteps) {
        alert(`Alcanzado límite de ${maxSteps} pasos sin detectar ciclo`);
      }
    }, 100);
  };

  const executeStep = () => {
    if (!machine) return false;

    const continued = machine.step();
    updateDisplay(machine);

    if (machine.isCycleDetected()) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      alert(
        `¡Ciclo detectado!\nPeríodo: ${machine.getCycleLength()} valores\n` +
          `Transiciones: ${machine.getTransitions()}\n` +
          `Pasos: ${machine.getStepCount()}`
      );
      return false;
    }

    return continued;
  };

  const runAutomatic = () => {
    if (!machine) {
      alert("Primero debes inicializar la máquina");
      return;
    }

    if (isRunning) {
      // Pausar/Continuar
      setIsPaused(!isPaused);
      return;
    }

    // Iniciar ejecución automática
    setIsRunning(true);
    setIsPaused(false);

    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      const continued = executeStep();

      if (!continued) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
      }
    }, speed);

    intervalRef.current = interval;
  };

  const stopExecution = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
  };

  const reset = () => {
    stopExecution();
    setMachine(null);
    setTapeState(null);
    setGeneratedValues([]);
    setExecutionLog([]);
    setCycleDetected(false);
    setStepCount(0);
    setCurrentState("No inicializado");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Header onToggleSettings={() => setShowSettings(!showSettings)} />

          {showSettings && (
            <SettingsPanel
              seed={seed}
              setSeed={setSeed}
              speed={speed}
              setSpeed={setSpeed}
              a={a}
              setA={setA}
              b={b}
              setB={setB}
              c={c}
              setC={setC}
              isRunning={isRunning}
              presetConfigs={presetConfigs}
              onInitialize={initializeMachine}
            />
          )}

          <ControlButtons
            onStep={executeStep}
            onRun={runAutomatic}
            onRunToCompletion={runToCompletion}
            onReset={reset}
            isRunning={isRunning}
            isPaused={isPaused}
            hasMachine={machine !== null}
          />

          <StatusDisplay
            currentState={currentState}
            stepCount={stepCount}
            valuesCount={generatedValues.length}
            a={a}
            b={b}
            c={c}
          />

          {tapeState && (
            <TapeDisplay
              tape={tapeState.tape}
              headPosition={tapeState.headPosition}
              currentState={tapeState.currentStateDescription}
            />
          )}

          {cycleDetected && <CycleAlert cycleLength={generatedValues.length} />}

          {generatedValues.length > 0 && (
            <SequenceDisplay
              values={generatedValues}
              cycleDetected={cycleDetected}
            />
          )}

          {executionLog.length > 0 && <ExecutionLog log={executionLog} />}
        </div>
      </div>
    </div>
  );
}

export default App;
