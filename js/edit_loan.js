document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const loanId = parseInt(urlParams.get('loan_id'), 10);

    // Fetch the loan data from the prestamos.json file
    fetch('data/prestamos.json')
        .then(response => response.json())
        .then(prestamosData => {
            // Find the loan with the matching id_prestamo
            const loan = prestamosData.find(loan => loan.id_prestamo === loanId);

            if (loan) {
                document.getElementById('client').value = loan.id_cliente;  // Assuming you have a way to map client ID to client name
                document.getElementById('amount').value = loan.monto;
                document.getElementById('rate').value = loan.tasa;
                document.getElementById('date').value = loan.fecha_inicio;
                document.getElementById('term').value = loan.plazo + ' ' + loan.unidad;
                document.getElementById('status').value = loan.estado;
            } else {
                alert('Loan not found');
            }
        })
        .catch(error => {
            console.error('Error fetching loan data:', error);
            alert('Failed to load loan data.');
        });

    // Add event listener to the form to handle the submission (updating the loan)
    document.getElementById('editLoanForm').addEventListener('submit', function (event) {
        event.preventDefault();
        // Logic to save the updated loan data back to the server or update the JSON file
        alert('Loan details updated successfully!');
    });
});