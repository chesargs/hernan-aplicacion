
document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('operador');

    // Simulated data - should be replaced with actual data retrieval
    const operators = [
        { id: '1', name: 'Operador 1' },
        { id: '2', name: 'Operador 2' }
    ];

    operators.forEach(op => {
        const option = document.createElement('option');
        option.value = op.id;
        option.textContent = op.name;
        select.appendChild(option);
    });
});
