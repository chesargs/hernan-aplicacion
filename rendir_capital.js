
document.addEventListener('DOMContentLoaded', async function() {
    const operatorSelect = document.getElementById('operator-select');
    const operatorInfo = document.getElementById('operator-info');
    const totalMoneyDisplay = document.getElementById('total-money-display');
    
    // Example operators data - replace with actual data retrieval
    const operadores = [
        {
            id_operador: 1,
            nombre: "Jose",
            email: "jose.hernan@example.com",
            estado: true,
            rol: "Admin",
            inversiones: [{ monto: 25000 }],
            prestamos_emitidos: [101, 102]
        },
        {
            id_operador: 2,
            nombre: "Ana",
            email: "ana.smith@example.com",
            estado: true,
            rol: "User",
            inversiones: [{ monto: 10000 }],
            prestamos_emitidos: [103, 104]
        }
    ];

    const prestamos = [
        { id_prestamo: 101, monto: 745871, cobros: [{ monto: 653431.7899999999, pagado: true }] },
        { id_prestamo: 102, monto: 50000, cobros: [{ monto: 20000, pagado: false }] },
        { id_prestamo: 103, monto: 30000, cobros: [{ monto: 15000, pagado: true }] },
        { id_prestamo: 104, monto: 60000, cobros: [{ monto: 50000, pagado: false }] }
    ];

    // Populate operator dropdown
    operadores.forEach(operator => {
        const option = document.createElement('option');
        option.value = operator.id_operador;
        option.textContent = operator.nombre;
        operatorSelect.appendChild(option);
    });

    // Add event listener to the dropdown for when an operator is selected
    operatorSelect.addEventListener('change', function(event) {
        const selectedOperatorId = parseInt(event.target.value);
        const selectedOperator = operadores.find(operator => operator.id_operador === selectedOperatorId);

        displayOperatorDetails(selectedOperator, prestamos);
    });

    // Display operator details and total money
    const displayOperatorDetails = (operator, prestamos) => {
        // Calculate total loans for the operator
        const totalLoans = prestamos
            .filter(p => operator.prestamos_emitidos.includes(p.id_prestamo))
            .reduce((sum, prestamo) => sum + prestamo.monto, 0);

        // Calculate total paid payments for the operator
        const totalPayments = prestamos
            .filter(p => operator.prestamos_emitidos.includes(p.id_prestamo))
            .flatMap(p => p.cobros.filter(cobro => cobro.pagado))
            .reduce((sum, cobro) => sum + cobro.monto, 0);

        const totalMoney = totalLoans - totalPayments;

        // Update the operator info section
        operatorInfo.innerHTML = `
            <h2>${operator.nombre}</h2>
            <p>Email: ${operator.email}</p>
            <p>Estado: ${operator.estado ? 'Activo' : 'Inactivo'}</p>
            <p>Rol: ${operator.rol}</p>
            <p>Total Inversiones: ${operator.inversiones.reduce((sum, inv) => sum + inv.monto, 0)}</p>
            <p>Total Préstamos: ${totalLoans}</p>
            <p>Total Pagos Recibidos (Paid Only): ${totalPayments}</p>
        `;

        totalMoneyDisplay.innerHTML = `
            <p class="amount">Total ${operator.nombre}: $${totalMoney.toLocaleString()}</p>
        `;
    };
});
