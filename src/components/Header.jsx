import { Settings } from "lucide-react";

export const Header = ({ onToggleSettings }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Máquina de Turing - Generador XOR-Shift
        </h1>
        <p className="text-gray-600 mt-2">
          Simulación de generador pseudoaleatorio
        </p>
      </div>
      <button
        onClick={onToggleSettings}
        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
      >
        <Settings className="w-6 h-6 text-blue-600" />
      </button>
    </div>
  );
};
