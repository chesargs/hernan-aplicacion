
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nuevoOperador = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            rol: document.getElementById('rol').value,
        };

        console.log("Nuevo Operador: ", nuevoOperador);
        // Save the new entry to operadores.json (this would be done server-side in real implementation)
    });
});
