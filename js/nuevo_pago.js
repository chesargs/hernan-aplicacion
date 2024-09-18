
document.addEventListener('DOMContentLoaded', async function() {
    const clienteSelect = document.getElementById('cliente');
    const cobradorSelect = document.getElementById('cobrador');
    const form = document.querySelector('form');

    // Fetch clients and operators
    const fetchClientes = async () => {
        const response = await fetch('data/clientes.json');
        return await response.json();
    };
    const fetchOperadores = async () => {
        const response = await fetch('data/operadores.json');
        return await response.json();
    };

    // Populate dropdowns
    const populateDropdowns = async () => {
        const clientes = await fetchClientes();
        const operadores = await fetchOperadores();

        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id_cliente;
            option.textContent = cliente.nombre;
            clienteSelect.appendChild(option);
        });

        operadores.forEach(operador => {
            const option = document.createElement('option');
            option.value = operador.id_operador;
            option.textContent = operador.nombre;
            cobradorSelect.appendChild(option);
        });
    };

    // Add event listener to form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nuevoPago = {
            cliente: clienteSelect.value,
            cobrador: cobradorSelect.value,
            monto: document.getElementById('monto').value,
        };

        console.log("Nuevo Pago: ", nuevoPago);
        // Save the new entry to prestamos.json (this would be done server-side in real implementation)
    });

    populateDropdowns();
});
