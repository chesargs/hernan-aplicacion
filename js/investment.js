document.addEventListener('DOMContentLoaded', () => {
    const operadoresUrl = 'data/operadores.json'; // Ensure the path is correct

    // Fetch JSON data
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // Initialize the investments page
    const initializeInvestmentsPage = async () => {
        const operadores = await fetchData(operadoresUrl);
        populateOperatorDropdown(operadores);
        calculateGrandTotal(operadores);
        displayOperatorInvestments(operadores); // Display all investments by default

        document.getElementById('operator-select').addEventListener('change', (event) => {
            const selectedOperatorId = event.target.value;
            if (selectedOperatorId === "all") {
                displayOperatorInvestments(operadores); // Display all investments if "Todos los Operadores" is selected
            } else {
                const selectedOperator = operadores.find(operator => operator.id_operador === parseInt(selectedOperatorId));
                displayOperatorInvestments([selectedOperator]); // Display selected operator's investments
            }
        });
    };

    // Populate operator dropdown
    const populateOperatorDropdown = (operadores) => {
        const operatorSelect = document.getElementById('operator-select');
        operatorSelect.innerHTML = '<option value="all">Todos los Operadores</option>';

        operadores.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.id_operador;
            option.textContent = operator.nombre;
            operatorSelect.appendChild(option);
        });
    };

    // Calculate and display the grand total for all investments
    const calculateGrandTotal = (operadores) => {
        const grandTotalElement = document.getElementById('grand-total');
        const grandTotal = operadores.reduce((total, operator) => {
            return total + operator.inversiones.reduce((sum, inv) => sum + inv.monto, 0);
        }, 0);

        grandTotalElement.textContent = `$${grandTotal.toLocaleString()}`;
    };

    // Display investments for the selected operator(s)
    const displayOperatorInvestments = (operators) => {
        const investmentsTableBody = document.getElementById('investments-body');
        investmentsTableBody.innerHTML = ''; // Clear existing rows

        operators.forEach(operator => {
            operator.inversiones.forEach(inversion => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${operator.nombre}</td>
                    <td>$${inversion.monto.toLocaleString()}</td>
                    <td>${new Date().toLocaleDateString()}</td> <!-- Placeholder for investment date -->
                    <td>${operator.estado === "true" ? 'Activo' : 'Inactivo'}</td>
                `;

                // Add click event to redirect to the detailed operator page
                row.addEventListener('click', () => {
                    window.location.href = `detalle_operador.html?operator_id=${operator.id_operador}`;
                });

                investmentsTableBody.appendChild(row);
            });
        });
    };

    initializeInvestmentsPage();
});