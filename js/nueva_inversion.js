
document.addEventListener('DOMContentLoaded', async function() {
    const operadorSelect = document.getElementById('operador');
    const form = document.querySelector('form');

    // Fetch operators
    const fetchOperadores = async () => {
        const response = await fetch('data/operadores.json');
        return await response.json();
    };

    // Populate operator dropdown
    const populateOperadorDropdown = async () => {
        const operadores = await fetchOperadores();
        operadores.forEach(operador => {
            const option = document.createElement('option');
            option.value = operador.id_operador;
            option.textContent = operador.nombre;
            operadorSelect.appendChild(option);
        });
    };

    // Add event listener to form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nuevaInversion = {
            operador: operadorSelect.value,
            monto: document.getElementById('monto').value,
        };

        console.log("Nueva Inversión: ", nuevaInversion);
        // Save the new entry to inversiones.json (this would be done server-side in real implementation)
    });

    populateOperadorDropdown();
});
