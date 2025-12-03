export const StatusDisplay = ({
  currentState,
  stepCount,
  valuesCount,
  a,
  b,
  c,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Estado Actual</p>
          <p
            className="text-lg font-semibold text-gray-800 truncate"
            title={currentState}
          >
            {currentState}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Pasos Ejecutados</p>
          <p className="text-lg font-semibold text-gray-800">{stepCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Valores Generados</p>
          <p className="text-lg font-semibold text-gray-800">{valuesCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Parámetros</p>
          <p className="text-lg font-semibold text-gray-800">
            a={a}, b={b}, c={c}
          </p>
        </div>
      </div>
    </div>
  );
};
