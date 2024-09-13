document.addEventListener('DOMContentLoaded', () => {
    const operadoresUrl = 'data/operadores.json';
    const prestamosUrl = 'data/prestamos.json';
    const clientesUrl = 'data/clientes.json';

    // Function to fetch JSON data
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    // Fetch data and initialize the page
    const initializePage = async () => {
        const [operadores, prestamos, clientes] = await Promise.all([
            fetchData(operadoresUrl),
            fetchData(prestamosUrl),
            fetchData(clientesUrl)
        ]);

        populateOperatorDropdown(operadores);
        const defaultOperator = operadores[0];
        displayOperatorDetails(defaultOperator, prestamos);
        populateLoansTables(defaultOperator, prestamos, clientes);
        populatePaymentsTable(defaultOperator, prestamos, clientes);
        calculateGrandTotal(prestamos, operadores);

        addSearchFunctionality(); // Initialize the search functionality

        // Initialize investments if on inversiones.html page
        if (document.getElementById('investments-body')) {
            displayOperatorInvestments(defaultOperator);
        }
    };

    // Populate operator dropdown
    const populateOperatorDropdown = (operadores) => {
        const operatorSelect = document.getElementById('operator-select');
        operadores.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.id_operador;
            option.textContent = operator.nombre;
            operatorSelect.appendChild(option);
        });

        operatorSelect.addEventListener('change', async (event) => {
            const selectedOperatorId = parseInt(event.target.value);
            const selectedOperator = operadores.find(operator => operator.id_operador === selectedOperatorId);
            const prestamos = await fetchData(prestamosUrl);
            const clientes = await fetchData(clientesUrl);

            displayOperatorDetails(selectedOperator, prestamos);
            populateLoansTables(selectedOperator, prestamos, clientes);
            populatePaymentsTable(selectedOperator, prestamos, clientes);
            calculateGrandTotal(prestamos, operadores);

            addSearchFunctionality(); // Re-initialize the search functionality after changing the operator

            // Display investments if on inversiones.html page
            if (document.getElementById('investments-body')) {
                displayOperatorInvestments(selectedOperator);
            }
        });
    };

    // Display operator details and total money
    const displayOperatorDetails = (operator, prestamos) => {
        const operatorInfo = document.getElementById('operator-info');
        const totalMoneyDisplay = document.getElementById('total-money-display');
    
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

    // Populate loans tables
    const populateLoansTables = (operator, prestamos, clientes) => {
        const cashTableBody = document.getElementById('cash-loans-body');
        const cardTableBody = document.getElementById('card-loans-body');

        cashTableBody.innerHTML = '';
        cardTableBody.innerHTML = '';

        prestamos.forEach(prestamo => {
            if (operator.prestamos_emitidos.includes(prestamo.id_prestamo)) {
                const cliente = clientes.find(c => c.id_cliente === prestamo.id_cliente);
                const row = document.createElement('tr');

                // Make rows clickable to redirect to the loan details page
                row.onclick = () => redirectToLoanDetailsPage(prestamo.id_prestamo);

                row.innerHTML = `
                    <td>${cliente ? cliente.nombre : 'Desconocido'}</td>
                    <td>${prestamo.monto.toLocaleString()}</td>
                    <td>${prestamo.tasa.toFixed(3)}</td>
                    <td>${prestamo.fecha_inicio}</td>
                    <td>${prestamo.plazo} ${prestamo.unidad}</td>
                    <td>${prestamo.estado}</td>
                `;

                if (prestamo.tipo === 'cash') {
                    cashTableBody.appendChild(row);
                } else if (prestamo.tipo === 'card') {
                    cardTableBody.appendChild(row);
                }
            }
        });
    };

    // Populate payments table with cobros data
    const populatePaymentsTable = (operator, prestamos, clientes) => {
        const paymentsTableBody = document.getElementById('payments-received-body');
        paymentsTableBody.innerHTML = '';
    
        const operatorPrestamos = prestamos
            .filter(p => operator.prestamos_emitidos.includes(p.id_prestamo));
    
        operatorPrestamos.forEach(prestamo => {
            prestamo.cobros.filter(cobro => cobro.pagado).forEach(cobro => {
                const cliente = clientes.find(c => c.id_cliente === prestamo.id_cliente);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cliente ? cliente.nombre : 'Desconocido'}</td>
                    <td>${cobro.monto.toLocaleString()}</td>
                    <td>${cobro.fecha_cobro}</td>
                `;
                paymentsTableBody.appendChild(row);
            });
        });
    };

    // Calculate and display the grand total for all operators
    const calculateGrandTotal = (prestamos, operadores) => {
        const grandTotalElement = document.getElementById('grand-total');
    
        let totalInvestments = 0;
        let totalPaidCollections = 0;
    
        operadores.forEach(operator => {
            // Sum all investments for each operator
            const operatorInvestments = operator.inversiones.reduce((sum, inv) => sum + inv.monto, 0);
            totalInvestments += operatorInvestments;
    
            // Sum only paid collections for each operator
            const operatorLoans = prestamos.filter(p => operator.prestamos_emitidos.includes(p.id_prestamo));
            const operatorPaidCollections = operatorLoans
                .flatMap(p => p.cobros.filter(cobro => cobro.pagado))
                .reduce((sum, cobro) => sum + cobro.monto, 0);
    
            totalPaidCollections += operatorPaidCollections;
        });
    
        // Calculate grand total as investments + paid collections
        const grandTotal = totalInvestments + totalPaidCollections;
    
        grandTotalElement.textContent = `$${grandTotal.toLocaleString()}`;
    };

    // Display investments for the selected operator
    const displayOperatorInvestments = (operator) => {
        const investmentsTableBody = document.getElementById('investments-body');
        if (investmentsTableBody) {
            investmentsTableBody.innerHTML = ''; // Clear existing rows

            operator.inversiones.forEach(inversion => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${operator.nombre}</td>
                    <td>$${inversion.monto.toLocaleString()}</td>
                    <td>${new Date().toLocaleDateString()}</td> <!-- Placeholder for investment date -->
                    <td>${operator.estado ? 'Activo' : 'Inactivo'}</td>
                `;
                investmentsTableBody.appendChild(row);
            });
        }
    };

    // Redirect to the loan details page
    function redirectToLoanDetailsPage(loanId) {
        window.location.href = `detalle_prestamo.html?loan_id=${loanId}`;
    }

    // Add search functionality
    const addSearchFunctionality = () => {
        const cashSearchInput = document.querySelector('.search-bar-cash input');
        const cardSearchInput = document.querySelector('.search-bar-card input');

        cashSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterLoansByClientName(searchTerm, 'cash-loans-body');
        });

        cardSearchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterLoansByClientName(searchTerm, 'card-loans-body');
        });
    };

    // Function to filter loans based on the search term
    const filterLoansByClientName = (searchTerm, tableBodyId) => {
        const tableRows = document.querySelectorAll(`#${tableBodyId} tr`);

        tableRows.forEach(row => {
            const clientName = row.querySelector('td:first-child').textContent.toLowerCase();
            if (clientName.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    };

    initializePage();
});