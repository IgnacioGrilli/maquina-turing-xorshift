export const StatusDisplay = ({
  currentState,
  currentIteration,
  valuesCount,
  a,
  b,
  c,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Estado</p>
          <p className="text-lg font-semibold text-gray-800">{currentState}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Iteración</p>
          <p className="text-lg font-semibold text-gray-800">
            {currentIteration}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Valores generados</p>
          <p className="text-lg font-semibold text-gray-800">{valuesCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Parámetros</p>
          <p className="text-lg font-semibold text-gray-800">
            ({a}, {b}, {c})
          </p>
        </div>
      </div>
    </div>
  );
};
