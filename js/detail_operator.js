document.addEventListener('DOMContentLoaded', async () => {
    const operadoresUrl = 'data/operadores.json'; // Ensure the path is correct

    // Function to get the operator ID from the URL
    const getOperatorIdFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('operator_id');
    };

    // Fetch operator data
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // Populate the operator details
    const populateOperatorDetails = (operator) => {
        document.getElementById('operator-name').textContent = operator.nombre;
        document.getElementById('operator-email').textContent = operator.email;
        document.getElementById('operator-status').textContent = operator.estado === "true" ? 'Activo' : 'Inactivo';
        document.getElementById('operator-role').textContent = operator.rol;
        document.getElementById('operator-total-investments').textContent = `$${operator.inversiones.reduce((sum, inv) => sum + inv.monto, 0).toLocaleString()}`;
        document.getElementById('operator-total-returns').textContent = `$${operator.rendiciones.reduce((sum, ren) => sum + ren.monto, 0).toLocaleString()}`;
    };

    // Populate the operator investments table
    const populateOperatorInvestmentsTable = (operator) => {
        const investmentsTableBody = document.getElementById('operator-investments-body');
        investmentsTableBody.innerHTML = ''; // Clear existing rows

        operator.inversiones.forEach(inversion => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>$${inversion.monto.toLocaleString()}</td>
                <td>${new Date(inversion.fecha).toLocaleDateString()}</td>
                <td>${operator.estado === "true" ? 'Activo' : 'Inactivo'}</td>
            `;
            investmentsTableBody.appendChild(row);
        });
    };

    // Initialize the page
    const initializePage = async () => {
        const operatorId = parseInt(getOperatorIdFromUrl());
        const operadores = await fetchData(operadoresUrl);
        const selectedOperator = operadores.find(operator => operator.id_operador === operatorId);

        if (selectedOperator) {
            populateOperatorDetails(selectedOperator);
            populateOperatorInvestmentsTable(selectedOperator);
        } else {
            console.error('Operator not found');
        }
    };

    initializePage();
});