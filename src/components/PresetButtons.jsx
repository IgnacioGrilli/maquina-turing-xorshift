export const PresetButtons = ({ configs, onSelect, disabled }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Configuraciones recomendadas (período máximo 63 para 6 bits)
      </label>
      <div className="flex flex-wrap gap-2">
        {configs.map((config) => (
          <button
            key={config.name}
            onClick={() => onSelect(config)}
            disabled={disabled}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm disabled:opacity-50"
          >
            {config.name}
          </button>
        ))}
      </div>
    </div>
  );
};
