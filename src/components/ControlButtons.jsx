import { Play, RotateCcw, Pause, StepForward, FastForward } from "lucide-react";

export const ControlButtons = ({
  onStep,
  onRun,
  onRunToCompletion,
  onReset,
  isRunning,
  isPaused,
  hasMachine,
}) => {
  return (
    <div className="flex gap-3 mb-6 flex-wrap">
      <button
        onClick={onStep}
        disabled={!hasMachine || isRunning}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
        title="Ejecutar un solo paso de la Máquina de Turing"
      >
        <StepForward className="w-5 h-5" />
        Paso (Step)
      </button>

      <button
        onClick={onRun}
        disabled={!hasMachine}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
        title="Ejecutar automáticamente paso a paso"
      >
        {isRunning ? (
          <>
            <Pause className="w-5 h-5" />
            {isPaused ? "Continuar" : "Pausar"}
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Ejecutar Automático
          </>
        )}
      </button>

      <button
        onClick={onRunToCompletion}
        disabled={!hasMachine || isRunning}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
        title="Ejecutar hasta completar el ciclo (sin animación)"
      >
        <FastForward className="w-5 h-5" />
        Ejecutar Completo
      </button>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md"
        title="Reiniciar la máquina"
      >
        <RotateCcw className="w-5 h-5" />
        Reiniciar
      </button>
    </div>
  );
};
