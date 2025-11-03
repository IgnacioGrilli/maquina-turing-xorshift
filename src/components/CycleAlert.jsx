import { InformationCircleIcon } from "@heroicons/react/24/solid";

export const CycleAlert = ({ cycleLength }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center">
        <InformationCircleIcon className="w-5 h-5 text-yellow-600 mr-3" />
        <div>
          <h3 className="font-semibold text-yellow-800">¡Ciclo detectado!</h3>
          <p className="text-yellow-700 text-sm">
            La secuencia se repitió después de {cycleLength} iteraciones.
            Longitud del ciclo: {cycleLength}
          </p>
        </div>
      </div>
    </div>
  );
};
