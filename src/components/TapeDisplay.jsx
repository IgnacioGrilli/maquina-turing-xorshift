export const TapeDisplay = ({ tapeState }) => {
  if (!tapeState) return null;

  const { tape, head, operation, stepName } = tapeState;

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        Cinta de la Máquina de Turing
      </h3>
      
      {stepName && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-purple-300">
          <p className="text-sm font-semibold text-purple-700">
            Operación: <span className="text-purple-900">{stepName}</span>
          </p>
          {operation && (
            <p className="text-xs text-gray-600 mt-1">{operation}</p>
          )}
        </div>
      )}

      {/* Cabezal de lectura */}
      <div className="flex justify-center mb-2">
        <div className="flex items-center gap-1">
          {tape.split("").map((_, index) => (
            <div key={index} className="w-12 h-8">
              {index === head && (
                <div className="flex flex-col items-center">
                  <div className="text-2xl animate-bounce">▼</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cinta con valores */}
      <div className="flex justify-center overflow-x-auto">
        <div className="flex items-center gap-1 p-4">
          {tape.split("").map((bit, index) => (
            <div
              key={index}
              className={`
                w-12 h-12 flex items-center justify-center
                border-2 font-mono text-xl font-bold
                transition-all duration-300
                ${
                  index === head
                    ? "border-red-500 bg-red-100 text-red-800 scale-110 shadow-lg"
                    : bit === "1"
                    ? "border-blue-400 bg-blue-50 text-blue-800"
                    : "border-gray-300 bg-white text-gray-600"
                }
              `}
            >
              {bit}
            </div>
          ))}
        </div>
      </div>

      {/* Información de posición */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Posición del cabezal: <span className="font-bold text-purple-700">{head}</span>
          {" | "}
          Valor actual: <span className="font-bold text-purple-700">{tape[head]}</span>
          {" | "}
          Longitud: <span className="font-bold text-purple-700">{tape.length} bits</span>
        </p>
      </div>
    </div>
  );
};
