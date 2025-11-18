export const TapeDisplay = ({ tapeState, generatedValues }) => {
  if (!tapeState) return null;

  const { tape, head, operation, stepName } = tapeState;
  
  // Mostrar ambas visualizaciones cuando hay valores generados
  const shouldShowSequence = generatedValues && generatedValues.length > 0;

  return (
    <div className="mt-6 space-y-4">
      {/* Secuencia horizontal - siempre visible cuando hay valores */}
      {shouldShowSequence && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Secuencia Generada
          </h3>
          
          <div className="overflow-x-auto pb-4">
            {/* Fila de punteros */}
            <div className="flex items-center justify-start mb-1 font-mono text-2xl">
              {generatedValues.map((value, index) => (
                <span 
                  key={`pointer-${index}`}
                  className={`${index === generatedValues.length - 1 ? 'text-red-600 animate-bounce' : 'text-transparent'}`}
                  style={{ width: `${value.length * 14 + 16}px`, textAlign: 'center' }}
                >
                  ▼
                </span>
              ))}
            </div>
            
            {/* Fila de números con separadores */}
            <div className="flex items-center justify-start font-mono text-xl font-bold">
              {generatedValues.map((value, index) => (
                <span key={index}>
                  <span className="text-purple-600 mx-1">▲</span>
                  <span className={index === generatedValues.length - 1 ? 'text-red-600' : 'text-blue-800'}>
                    {value}
                  </span>
                </span>
              ))}
              <span className="text-purple-600 mx-1">▲</span>
            </div>

            {/* Información adicional */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Valores generados: <span className="font-bold text-purple-700">{generatedValues.length}</span>
                {" | "}
                Último valor: <span className="font-bold text-purple-700">{generatedValues[generatedValues.length - 1]}</span>
                {" | "}
                Decimal: <span className="font-bold text-purple-700">{parseInt(generatedValues[generatedValues.length - 1], 2)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cinta de procesamiento bit a bit - siempre visible cuando hay operación */}
      {stepName && (
        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Procesamiento Actual
          </h3>
          
          <div className="mb-4 p-3 bg-white rounded-lg border border-indigo-300">
            <p className="text-sm font-semibold text-indigo-700">
              Operación: <span className="text-indigo-900">{stepName}</span>
            </p>
            {operation && (
              <p className="text-xs text-gray-600 mt-1">{operation}</p>
            )}
          </div>

          {/* Visualización de SHIFT */}
          {tapeState.showShift && tapeState.shiftedTape && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
              <div className="text-center mb-3">
                <p className="text-sm font-bold text-yellow-800">
                  {tapeState.shiftDirection === 'left' ? '← SHIFT LEFT' : 'SHIFT RIGHT →'} 
                  {' '}({tapeState.shiftAmount} posiciones)
                </p>
              </div>
              
              {/* Cinta Original */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 text-center mb-1">Original:</p>
                <div className="flex justify-center">
                  <div className="flex items-center gap-1">
                    {tape.split("").map((bit, index) => (
                      <div
                        key={`orig-${index}`}
                        className="w-10 h-10 flex items-center justify-center border-2 border-gray-400 bg-white font-mono text-lg font-bold"
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Flecha indicando dirección */}
              <div className="flex justify-center my-2">
                <div className="text-3xl text-yellow-600 animate-pulse">
                  {tapeState.shiftDirection === 'left' ? '↓ ←' : '↓ →'}
                </div>
              </div>

              {/* Cinta Desplazada */}
              <div>
                <p className="text-xs text-gray-600 text-center mb-1">Resultado del shift:</p>
                <div className="flex justify-center">
                  <div className="flex items-center gap-1">
                    {tapeState.shiftedTape.split("").map((bit, index) => (
                      <div
                        key={`shift-${index}`}
                        className={`
                          w-10 h-10 flex items-center justify-center border-2 font-mono text-lg font-bold
                          ${bit === tape[index] 
                            ? 'border-gray-400 bg-gray-100 text-gray-600' 
                            : 'border-yellow-500 bg-yellow-100 text-yellow-800'}
                        `}
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cabezal de lectura - solo si no estamos mostrando shift */}
          {!tapeState.showShift && (
            <>
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
                  Posición del cabezal: <span className="font-bold text-indigo-700">{head}</span>
                  {" | "}
                  Valor actual: <span className="font-bold text-indigo-700">{tape[head]}</span>
                  {" | "}
                  Longitud: <span className="font-bold text-indigo-700">{tape.length} bits</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};