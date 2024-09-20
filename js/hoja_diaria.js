// Obtener datos de los préstamos desde GitHub Pages (URL de los JSON)
function obtenerPrestamos() {
    return fetch('https://chesargs.github.io/hernan-aplicacion/data/prestamos.json')
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching loans:', error));
}

// Obtener datos de los clientes desde GitHub Pages (URL de los JSON)
function obtenerClientes() {
    return fetch('https://chesargs.github.io/hernan-aplicacion/data/clientes.json')
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching clients:', error));
}

// Mostrar cobros por fecha seleccionada
function mostrarCobrosPorFecha(fecha) {
    obtenerPrestamos().then(prestamos => {
        obtenerClientes().then(clientes => {
            let cobrosDelDia = [];

            // Recorrer los préstamos y filtrar los cobros por la fecha seleccionada
            prestamos.forEach(prestamo => {
                prestamo.cobros.forEach(cobro => {
                    if (cobro.fecha_cobro === fecha && !cobro.pagado) {
                        // Encontrar el nombre del cliente basado en el ID
                        const cliente = clientes.find(c => c.id_cliente === prestamo.id_cliente);

                        cobrosDelDia.push({
                            cliente: cliente ? cliente.nombre : 'Cliente Desconocido',
                            monto: cobro.monto,
                            metodo_pago: cobro.metodo_pago,
                            pagado: cobro.pagado,
                            id_prestamo: prestamo.id_prestamo,
                            id_cobro: cobro.id_cobro
                        });
                    }
                });
            });

            // Mostrar cobros en la tabla
            const tableBody = document.getElementById('daily-sheet-body');
            tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

            if (cobrosDelDia.length > 0) {
                cobrosDelDia.forEach(cobro => {
                    let row = `<tr>
                                <td>${cobro.monto}</td>
                                <td>${cobro.cliente}</td>
                                <td><button onclick="marcarComoPagado(${cobro.id_prestamo},${cobro.id_cobro})" class="action-btn">💰</button></td>
                              </tr>`;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="3">No hay cobros pendientes para esta fecha.</td></tr>';
            }
        });
    });
}

// Marcar cobro como pagado y actualizar el JSON (en local o en el servidor si fuera necesario)
function marcarComoPagado(idPrestamo, idCobro) {
    const prestamo = obtenerPrestamoPorId(idPrestamo); // Asegúrate de tener esta función
    const cobro = prestamo.cobros.find(c => c.id_cobro === idCobro);
    if (cobro) {
        cobro.pagado = true;
        actualizarPrestamo(prestamo);
        mostrarCobrosPorFecha(document.querySelector('.flatpickr').value); // Refrescar la lista
    }
}