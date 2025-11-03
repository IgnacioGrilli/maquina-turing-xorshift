import { useState, useRef, useEffect } from "react";
import { SettingsPanel } from "./components/SettingsPanel";
import { Header } from "./components/Header";
import { StatusDisplay } from "./components/StatusDisplay";
import { CycleAlert } from "./components/CycleAlert";
import { InfoPanel } from "./components/InfoPanel";
import { SequenceDisplay } from "./components/SequenceDisplay";
import { ControlButtons } from "./components/ControlButtons";
import { TuringMachine } from "./components/TuringMachine";

function App() {
  const [seed, setSeed] = useState("110010");
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);
  const [c, setC] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentState, setCurrentState] = useState("IDLE");
  const isPausedRef = useRef(false);
  const [generatedValues, setGeneratedValues] = useState([]);
  const [cycleDetected, setCycleDetected] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const presetConfigs = [
    { name: "(1,3,2)", a: 1, b: 3, c: 2 },
    { name: "(1,3,3)", a: 1, b: 3, c: 3 },
    { name: "(1,3,4)", a: 1, b: 3, c: 4 },
    { name: "(2,3,1)", a: 2, b: 3, c: 1 },
    { name: "(3,3,1)", a: 3, b: 3, c: 1 },
    { name: "(4,3,1)", a: 4, b: 3, c: 1 },
  ];

  const reset = () => {
    // stop any running interval to fully stop the machine
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setCurrentState("IDLE");
    setGeneratedValues([]);
    setCycleDetected(false);
    setCurrentIteration(0);
    setIsPaused(false);
  };

  const runMachine = () => {
    if (!seed.match(/^[01]+$/)) {
      alert("La semilla debe contener solo 0s y 1s");
      return;
    }

    setIsRunning(true);
    setCycleDetected(false);
    setGeneratedValues([seed]);
    setCurrentIteration(0);
    setCurrentState("RUNNING");

    const machine = new TuringMachine(seed, a, b, c);
    let current = seed;
    let iteration = 0;
    // ensure we don't leave a stale interval running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const interval = setInterval(() => {
      // if paused, skip this tick
      if (isPausedRef.current) return;

      const next = machine.executeIteration(current);

      if (machine.checkRepetition(next)) {
        setGeneratedValues((prev) => [...prev, next]);
        setCycleDetected(true);
        setCurrentState("CYCLE_DETECTED");
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      machine.generatedSequence.push(next);
      setGeneratedValues((prev) => [...prev, next]);
      setCurrentIteration((prev) => prev + 1);
      current = next;
      iteration++;

      if (iteration >= 100) {
        setCurrentState("MAX_ITERATIONS");
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, speed);

    intervalRef.current = interval;

    // sync will be handled by an effect (keeps ref up-to-date across renders)
  };

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full">
        <div className="bg-white rounded-none shadow-none p-6 mb-6 w-full">
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
            />
          )}

          <ControlButtons
            onStart={runMachine}
            onReset={reset}
            onPause={() => setIsPaused((s) => !s)}
            isRunning={isRunning}
            isPaused={isPaused}
          />

          <StatusDisplay
            currentState={currentState}
            currentIteration={currentIteration}
            valuesCount={generatedValues.length}
            a={a}
            b={b}
            c={c}
          />

          {cycleDetected && (
            <CycleAlert cycleLength={generatedValues.length - 1} />
          )}

          {generatedValues.length > 0 && (
            <SequenceDisplay
              values={generatedValues}
              cycleDetected={cycleDetected}
            />
          )}

          <InfoPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
