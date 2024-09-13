document.addEventListener('DOMContentLoaded', () => {
    const prestamosUrl = 'data/prestamos.json'; // Ensure this path is correct
    const clientesUrl = 'data/clientes.json'; // Ensure this path is correct

    // Fetch data and initialize the page
    const initializePage = async () => {
        const [prestamos, clientes] = await Promise.all([
            fetchData(prestamosUrl),
            fetchData(clientesUrl)
        ]);
        populateOverdueLoansTable(prestamos.filter(p => p.estado === 'vencido'), clientes);
    };

    // Fetch JSON data
    const fetchData = async (url) => {
        const response = await fetch(url);
        return response.json();
    };

    // Populate the overdue loans table
    const populateOverdueLoansTable = (prestamos, clientes) => {
        const overdueLoansBody = document.getElementById('overdue-loans-body');
        overdueLoansBody.innerHTML = '';

        prestamos.forEach(prestamo => {
            const cliente = clientes.find(c => c.id_cliente === prestamo.id_cliente);
            const saldoPendiente = prestamo.monto - (prestamo.cuotas_pagadas || 0);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente ? cliente.nombre : 'Desconocido'}</td>
                <td>${prestamo.monto.toLocaleString()}</td>
                <td>${prestamo.plazo !== undefined ? prestamo.plazo + ' ' + prestamo.unidad : 'N/A'}</td>
                <td>${!isNaN(saldoPendiente) ? saldoPendiente.toLocaleString() : 'N/A'}</td>
                <td>${prestamo.fecha_vencimiento ? prestamo.fecha_vencimiento : 'N/A'}</td>
                <td><button class="btn">+ Pago</button></td>
            `;
            overdueLoansBody.appendChild(row);
        });
    };

    initializePage();
});