document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('card-loan-form');

    form.addEventListener('submit', event => {
        event.preventDefault();

        const loanData = {
            clientName: document.getElementById('client-name').value,
            loanAmount: document.getElementById('loan-amount').value,
            ticketPhoto: document.getElementById('ticket-photo').files[0],
        };

        console.log('Card Loan Data:', loanData);
        // Here you would handle file upload and data submission
        alert('Préstamo con Tarjeta Registrado Exitosamente');
        form.reset();
    });
});