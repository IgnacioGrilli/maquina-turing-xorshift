export const TapeDisplay = ({ tape, headPosition, currentState }) => {
  if (!tape) return null;

  // Encontrar el rango completo de contenido (desde el primer símbolo hasta el último relevante)
  let firstContent = 0;
  let lastContent = tape.length - 1;

  // Buscar el primer símbolo que no sea blanco
  for (let i = 0; i < tape.length; i++) {
    if (tape[i] !== "▲") {
      firstContent = i;
      break;
    }
  }

  // Buscar el último símbolo relevante (incluyendo el cabezal y margen adelante)
  const searchEnd = Math.min(tape.length, headPosition + 100);
  for (let i = searchEnd; i >= firstContent; i--) {
    if (tape[i] !== "▲" || i === headPosition) {
      lastContent = i;
      break;
    }
  }

  // Agregar margen
  const margin = 3;
  const start = Math.max(0, firstContent - margin);
  const end = Math.min(tape.length, lastContent + margin + 10);
  const visibleTape = tape.slice(start, end);

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Cinta de Turing</h3>

      {/* Estado actual */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-indigo-300">
        <p className="text-sm font-semibold text-indigo-700">
          Estado: <span className="text-indigo-900">{currentState}</span>
        </p>
      </div>

      {/* Cinta con indicador de cabezal alineado */}
      <div className="flex justify-start overflow-x-auto pb-4">
        <div className="flex flex-col items-start px-4">
          {/* Fila del indicador del cabezal */}
          <div className="flex items-end gap-1 mb-1 h-6">
            {visibleTape.map((_, index) => {
              const actualIndex = start + index;
              return (
                <div
                  key={`head-${actualIndex}`}
                  className="w-8 h-6 flex items-end justify-center"
                >
                  {actualIndex === headPosition && (
                    <div className="text-xl text-red-600 animate-bounce leading-none">
                      ▼
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fila de la cinta con valores */}
          <div className="flex items-center gap-1">
            {visibleTape.map((symbol, index) => {
              const actualIndex = start + index;
              const isHead = actualIndex === headPosition;
              const isBlank = symbol === "▲";
              const isMarker = symbol === "#";

              return (
                <div
                  key={`tape-${actualIndex}`}
                  className={`
                    w-8 h-8 flex items-center justify-center
                    border font-mono text-sm font-bold
                    transition-all duration-200
                    ${
                      isHead
                        ? "border-red-500 bg-red-100 text-red-800 scale-110 shadow-lg"
                        : isMarker
                        ? "border-yellow-500 bg-yellow-100 text-yellow-800"
                        : isBlank
                        ? "border-gray-300 bg-gray-50 text-gray-400"
                        : symbol === "1"
                        ? "border-blue-400 bg-blue-50 text-blue-800"
                        : "border-green-400 bg-green-50 text-green-800"
                    }
                  `}
                >
                  {symbol}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Información de posición */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Posición del cabezal:{" "}
          <span className="font-bold text-indigo-700">{headPosition}</span>
          {" | "}
          Símbolo actual:{" "}
          <span className="font-bold text-indigo-700">
            {tape[headPosition]}
          </span>
          {" | "}
          Rango visible:{" "}
          <span className="font-bold text-indigo-700">
            {start} - {end}
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Celdas totales: {tape.length} | Mostrando {visibleTape.length} celdas
        </p>
      </div>
    </div>
  );
};
