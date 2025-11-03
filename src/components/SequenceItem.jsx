export const SequenceItem = ({ value, index, isLast, isCycle }) => {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded ${
        isCycle
          ? "bg-red-100 border border-red-300"
          : isLast
          ? "bg-blue-100"
          : "bg-white"
      }`}
    >
      <span className="text-sm text-gray-600 font-medium w-16">
        x₍{index}₎ =
      </span>
      <span className="font-mono text-lg font-semibold">{value}</span>
      <span className="text-sm text-gray-500">
        (decimal: {parseInt(value, 2)})
      </span>
      {isCycle && (
        <span className="ml-auto text-red-600 font-semibold text-sm">
          ← REPETICIÓN
        </span>
      )}
    </div>
  );
};
