document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('personal-loan-form');

    form.addEventListener('submit', event => {
        event.preventDefault();

        const loanData = {
            clientName: document.getElementById('client-name').value,
            loanAmount: document.getElementById('loan-amount').value,
            loanTerm: document.getElementById('loan-term').value,
            paymentMethod: document.getElementById('payment-method').value,
        };

        console.log('Personal Loan Data:', loanData);
        // Here you would send the data to the server or process it as needed
        alert('Préstamo Personal Registrado Exitosamente');
        form.reset();
    });
});