export const ExecutionLog = ({ log }) => {
  return (
    <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-3 text-lg">
        Log de Ejecución
      </h3>
      <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto font-mono text-sm">
        {log.map((line, index) => (
          <div
            key={index}
            className={`py-1 ${
              line.includes("---") 
                ? "text-blue-700 font-bold" 
                : line.includes("ERROR")
                ? "text-red-600 font-bold"
                : line.includes("CICLO")
                ? "text-green-600 font-bold"
                : "text-gray-700"
            }`}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
