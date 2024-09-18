
document.addEventListener('DOMContentLoaded', async function() {
    const operatorSelect = document.getElementById('operador');

    // Fetch operators data
    const fetchOperators = async () => {
        const response = await fetch('data/operadores.json');
        return await response.json();
    };

    // Populate operator dropdown
    const populateOperatorDropdown = async () => {
        const operadores = await fetchOperators();
        operadores.forEach(operator => {
            const option = document.createElement('option');
            option.value = operator.id_operador;
            option.textContent = operator.nombre;
            operatorSelect.appendChild(option);
        });
    };

    // Initialize dropdown on page load
    populateOperatorDropdown();
});
