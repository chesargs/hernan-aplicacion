document.addEventListener('DOMContentLoaded', () => {
    const prestamosUrl = 'data/prestamos.json';
    const clientesUrl = 'data/clientes.json';

    // Fetch data and initialize the page
    const initializePage = async () => {
        const [prestamos, clientes] = await Promise.all([
            fetchData(prestamosUrl),
            fetchData(clientesUrl)
        ]);
        populateLoansTables(prestamos, clientes);
        addSearchFunctionality();
        addViewMoreFunctionality(prestamos, clientes);
    };

    // Fetch JSON data
    const fetchData = async (url) => {
        const response = await fetch(url);
        return response.json();
    };

    // Populate the loans tables with data
    const populateLoansTables = (prestamos, clientes) => {
        const cashLoansBody = document.getElementById('cash-loans-body');
        const cardLoansBody = document.getElementById('card-loans-body');
        const maxInitialDisplay = 3;

        const cashLoans = prestamos.filter(p => p.tipo === 'cash');
        const cardLoans = prestamos.filter(p => p.tipo === 'card');

        populateLoanTable(cashLoans, clientes, cashLoansBody, maxInitialDisplay);
        populateLoanTable(cardLoans, clientes, cardLoansBody, maxInitialDisplay);
    };

    const populateLoanTable = (loans, clientes, tableBody, maxDisplay) => {
        tableBody.innerHTML = '';

        loans.slice(0, maxDisplay).forEach(prestamo => {
            const cliente = clientes.find(c => c.id_cliente === prestamo.id_cliente);
            const saldoPendiente = prestamo.monto - (prestamo.cuotas_pagadas || 0);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente ? cliente.nombre : 'Desconocido'}</td>
                <td>${prestamo.monto.toLocaleString()}</td>
                <td>${prestamo.plazo !== undefined ? prestamo.plazo + ' ' + prestamo.unidad : 'N/A'}</td>
                <td>${!isNaN(saldoPendiente) ? saldoPendiente.toLocaleString() : 'N/A'}</td>
                <td>${prestamo.tasa !== undefined ? prestamo.tasa : 'N/A'}</td>
                <td>
                    <button class="btn btn-details" data-loan-id="${prestamo.id_prestamo}">Detalles</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Store remaining loans for view more functionality
        if (loans.length > maxDisplay) {
            tableBody.dataset.remainingLoans = JSON.stringify(loans.slice(maxDisplay));
        }

        // Add event listeners for the "Ver Detalles" buttons
        document.querySelectorAll('.btn-details').forEach(button => {
            button.addEventListener('click', (event) => {
                const loanId = event.target.getAttribute('data-loan-id');
                window.location.href = `detalle_prestamo.html?loan_id=${loanId}`;
            });
        });
    };

    // View more functionality
    const addViewMoreFunctionality = (prestamos, clientes) => {
        document.querySelectorAll('.btn-view-more').forEach(button => {
            button.addEventListener('click', (event) => {
                const tableBodyId = event.target.getAttribute('data-target');
                const tableBody = document.getElementById(tableBodyId);
                const remainingLoans = JSON.parse(tableBody.dataset.remainingLoans || '[]');

                if (button.dataset.expanded === "true") {
                    // Collapse extra loans
                    tableBody.innerHTML = '';
                    const maxInitialDisplay = 3;
                    const loanType = tableBodyId.includes('cash') ? 'cash' : 'card';
                    const loans = prestamos.filter(p => p.tipo === loanType);

                    populateLoanTable(loans, clientes, tableBody, maxInitialDisplay);
                    button.textContent = "Ver más";
                    button.dataset.expanded = "false";
                } else {
                    // Expand to show all loans
                    remainingLoans.forEach(prestamo => {
                        const cliente = clientes.find(c => c.id_cliente === prestamo.id_cliente);
                        const saldoPendiente = prestamo.monto - (prestamo.cuotas_pagadas || 0);
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${cliente ? cliente.nombre : 'Desconocido'}</td>
                            <td>${prestamo.monto.toLocaleString()}</td>
                            <td>${prestamo.plazo !== undefined ? prestamo.plazo + ' ' + prestamo.unidad : 'N/A'}</td>
                            <td>${!isNaN(saldoPendiente) ? saldoPendiente.toLocaleString() : 'N/A'}</td>
                            <td>${prestamo.tasa !== undefined ? prestamo.tasa : 'N/A'}</td>
                            <td>
                                <button class="btn btn-details" data-loan-id="${prestamo.id_prestamo}">Ver Detalles</button>
                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                    button.textContent = "Ver menos";
                    button.dataset.expanded = "true";
                }

                // Re-attach event listeners for the "Ver Detalles" buttons
                document.querySelectorAll('.btn-details').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const loanId = event.target.getAttribute('data-loan-id');
                        window.location.href = `detalle_prestamo.html?loan_id=${loanId}`;
                    });
                });
            });
        });
    };

    // Add search functionality
    const addSearchFunctionality = () => {
        document.getElementById('search-cash-loans').addEventListener('input', function () {
            filterTable('cash-loans-body', this.value.toLowerCase());
        });

        document.getElementById('search-card-loans').addEventListener('input', function () {
            filterTable('card-loans-body', this.value.toLowerCase());
        });
    };

    const filterTable = (tableId, searchTerm) => {
        const rows = document.querySelectorAll(`#${tableId} tr`);
        rows.forEach(row => {
            const clientName = row.querySelector('td').textContent.toLowerCase();
            row.style.display = clientName.includes(searchTerm) ? '' : 'none';
        });
    };

    initializePage();
});