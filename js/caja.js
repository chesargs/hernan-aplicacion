document.addEventListener('DOMContentLoaded', () => {
    const operatorsUrl = 'data/operadores.json'; // Asegúrate de que la ruta sea correcta
    const newTransactionForm = document.getElementById('new-transaction-form');
    const operatorSelect = document.getElementById('operator');

    // Cargar y mostrar las transacciones de caja por operador
    const loadOperators = async () => {
        const operators = await fetchData(operatorsUrl);
        populateCashTransactions(operators);
        populateOperatorSelect(operators);
    };

    // Fetch JSON data
    const fetchData = async (url) => {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    // Mostrar las transacciones de caja por operador
    const populateCashTransactions = (operators) => {
        const operatorsContainer = document.getElementById('operators-cash-transactions');
        operatorsContainer.innerHTML = '';

        operators.forEach(operator => {
            const operatorSection = document.createElement('section');
            operatorSection.innerHTML = `
                <h2>${operator.nombre} (${operator.rol})</h2>
                <table class="operator-table">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${operator.salidas_caja.map(salida => `
                            <tr>
                                <td>Salida de Caja</td>
                                <td>${salida.monto.toLocaleString()}</td>
                                <td>${salida.fecha}</td>
                                <td>${salida.descripcion || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            operatorsContainer.appendChild(operatorSection);
        });
    };

    // Llenar el select con los nombres de los operadores
    const populateOperatorSelect = (operators) => {
        operatorSelect.innerHTML = '';
        operators.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.id_operador;
            option.text = operator.nombre;
            operatorSelect.appendChild(option);
        });
    };

    // Manejar el formulario de nueva salida de caja
    newTransactionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const selectedOperatorId = parseInt(document.getElementById('operator').value);
        const newTransaction = {
            id_salida: Date.now(),
            monto: parseFloat(document.getElementById('monto').value),
            fecha: document.getElementById('fecha').value,
            descripcion: document.getElementById('descripcion').value
        };

        addNewTransaction(selectedOperatorId, newTransaction);
    });

    // Agregar la nueva transacción al operador correcto
    const addNewTransaction = async (operatorId, newTransaction) => {
        const operators = await fetchData(operatorsUrl);
        const operator = operators.find(op => op.id_operador === operatorId);

        if (operator) {
            operator.salidas_caja.push(newTransaction);
            populateCashTransactions(operators);
        }
    };

    loadOperators();
});