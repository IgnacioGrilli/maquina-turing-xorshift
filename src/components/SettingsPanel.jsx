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
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3">
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

      <PresetButtons
        configs={presetConfigs}
        onSelect={(config) => {
          setA(config.a);
          setB(config.b);
          setC(config.c);
        }}
        disabled={isRunning}
      />
    </div>
  );
};
