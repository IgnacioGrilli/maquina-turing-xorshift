import { Play, RotateCcw, Pause } from "lucide-react";

export const ControlButtons = ({
  onStart,
  onReset,
  onPause,
  isRunning,
  isPaused,
}) => {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={onStart}
        disabled={isRunning}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Play className="w-5 h-5" />
        Iniciar
      </button>
      {isRunning && (
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-5 py-3 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Pause className="w-4 h-4" />
          {isPaused ? "Continuar" : "Pausar"}
        </button>
      )}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <RotateCcw className="w-5 h-5" />
        Reiniciar
      </button>
    </div>
  );
};
