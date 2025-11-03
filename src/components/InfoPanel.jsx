export const InfoPanel = () => {
  return (
    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200 shadow-sm">
      <h3 className="font-semibold text-blue-900 mb-2">Acerca del algoritmo</h3>
      <p className="text-sm text-blue-800 leading-relaxed">
        Esta Máquina de Turing simula un generador XOR-Shift que aplica tres
        operaciones:
        <br />
        1. x = x XOR (x &lt;&lt; a)
        <br />
        2. x = x XOR (x &gt;&gt; b)
        <br />
        3. x = x XOR (x &lt;&lt; c)
        <br />
        <br />
        El generador es determinista pero produce secuencias que parecen
        aleatorias. Con los parámetros correctos para 6 bits, puede alcanzar un
        período de 63 (máximo posible excluyendo el 0).
      </p>
    </div>
  );
};
