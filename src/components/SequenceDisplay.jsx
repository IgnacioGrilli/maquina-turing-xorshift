import { SequenceItem } from "./SequenceItem";

export const SequenceDisplay = ({ values, cycleDetected }) => {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-3">Secuencia generada:</h3>
      <div className="bg-white rounded-lg p-6 max-h-96 overflow-y-auto shadow-sm border border-gray-100">
        <div className="space-y-2">
          {values.map((value, index) => (
            <SequenceItem
              key={index}
              value={value}
              index={index}
              isLast={index === values.length - 1}
              isCycle={index === values.length - 1 && cycleDetected}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
