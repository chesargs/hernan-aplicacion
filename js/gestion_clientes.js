
document.addEventListener('DOMContentLoaded', async function() {
    const tableBody = document.querySelector('#clientes-table tbody');

    // Fetch clients data
    const fetchClientes = async () => {
        const response = await fetch('data/clientes.json');
        return await response.json();
    };

    // Populate clients table
    const populateClientesTable = async () => {
        const clientes = await fetchClientes();
        tableBody.innerHTML = '';
        clientes.forEach(cliente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.email}</td>
                <td>${cliente.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    populateClientesTable();
});
