import { PresetButtons } from "./PresetButtons";

export const SettingsPanel = ({
  seed,
  setSeed,
  speed,
  setSpeed,
  a,
  setA,
  b,
  setB,
  c,
  setC,
  isRunning,
  presetConfigs,
  onInitialize,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4 text-lg">
        Configuración de Parámetros
      </h3>

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
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="110010"
          />
          <p className="text-xs text-gray-500 mt-1">
            Decimal: {parseInt(seed || "0", 2)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Velocidad de ejecución: {speed}ms por paso
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Rápido</span>
            <span>Lento</span>
          </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <PresetButtons
        configs={presetConfigs}
        onSelect={(config) => {
          setA(config.a);
          setB(config.b);
          setC(config.c);
        }}
        disabled={isRunning}
      />

      <div className="mt-4">
        <button
          onClick={onInitialize}
          disabled={isRunning}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
        >
          Inicializar Máquina
        </button>
      </div>
    </div>
  );
};
