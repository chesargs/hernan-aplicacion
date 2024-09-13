document.addEventListener('DOMContentLoaded', () => {
    const prestamosUrl = 'data/prestamos.json';
    const operadoresUrl = 'data/operadores.json';
    const clientesUrl = 'data/clientes.json';

    const loadLoanDetails = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const loanId = urlParams.get('loan_id');

        try {
            const [prestamos, operadores, clientes] = await Promise.all([
                fetch(prestamosUrl).then(res => res.json()),
                fetch(operadoresUrl).then(res => res.json()),
                fetch(clientesUrl).then(res => res.json())
            ]);

            const loan = prestamos.find(p => p.id_prestamo === parseInt(loanId));
            if (!loan) {
                throw new Error('Loan not found.');
            }

            const operator = operadores.find(o => o.prestamos_emitidos.includes(loan.id_prestamo));
            const client = clientes.find(c => c.id_cliente === loan.id_cliente);

            document.getElementById('client-name').textContent = client ? client.nombre : 'N/A';
            document.getElementById('loan-amount').textContent = loan.monto.toLocaleString();
            document.getElementById('loan-rate').textContent = loan.tasa.toFixed(3);
            document.getElementById('loan-start-date').textContent = loan.fecha_inicio;
            document.getElementById('loan-term').textContent = `${loan.plazo} ${loan.unidad}`;
            document.getElementById('loan-status').textContent = loan.estado;

            if (operator) {
                document.getElementById('operator-name').textContent = operator.nombre;
                document.getElementById('operator-email').textContent = operator.email;
                document.getElementById('operator-role').textContent = operator.rol;
                document.getElementById('operator-status').textContent = operator.estado ? 'Activo' : 'Inactivo';
            } else {
                document.getElementById('operator-name').textContent = 'N/A';
                document.getElementById('operator-email').textContent = 'N/A';
                document.getElementById('operator-role').textContent = 'N/A';
                document.getElementById('operator-status').textContent = 'N/A';
            }

            // Display only paid payments
            const paymentsBody = document.getElementById('payments-body');
            paymentsBody.innerHTML = ''; // Clear existing rows
            loan.cobros.filter(cobro => cobro.pagado).forEach(cobro => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cobro.fecha_cobro}</td>
                    <td>${cobro.monto.toLocaleString()}</td>
                    <td>${cobro.metodo_pago || 'N/A'}</td>
                `;
                paymentsBody.appendChild(row);
            });

            // Display pending payments
            const pendingPaymentsBody = document.getElementById('pending-payments-body');
            pendingPaymentsBody.innerHTML = ''; // Clear existing rows
            loan.cobros.filter(cobro => !cobro.pagado).forEach(cobro => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cobro.fecha_cobro}</td>
                    <td>${cobro.monto.toLocaleString()}</td>
                    <td>${cobro.metodo_pago || 'N/A'}</td>
                `;
                pendingPaymentsBody.appendChild(row);
            });

            // Handle the "Edit Loan" button
            document.getElementById('edit-loan-button').addEventListener('click', () => {
                window.location.href = `edit_loan.html?loan_id=${loanId}`;
            });

        } catch (error) {
            alert(error.message);
        }
    };

    loadLoanDetails();
});