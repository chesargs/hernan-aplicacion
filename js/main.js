document.addEventListener('DOMContentLoaded', () => {
    const loansUrl = 'data/prestamos.json'; // URL for loan data
    const clientsUrl = 'data/clientes.json'; // URL for client data

    // Function to fetch and display data
    async function loadData() {
        try {
            // Fetch both loans and clients data
            const [loansResponse, clientsResponse] = await Promise.all([
                fetch(loansUrl),
                fetch(clientsUrl)
            ]);
            const loansData = await loansResponse.json();
            const clientsData = await clientsResponse.json();

            // Create a map of client IDs to client names
            const clientMap = new Map(clientsData.map(client => [client.id_cliente, client.nombre]));

            const loanList = document.getElementById('loan-list');
            const paymentList = document.getElementById('payment-list');

            // Clear existing content
            loanList.innerHTML = '';
            paymentList.innerHTML = '';

            // Process and display loans
            loansData.forEach(loan => {
                const clientName = clientMap.get(loan.id_cliente) || 'Unknown Client'; // Get client name or default to 'Unknown Client'

                const loanItem = document.createElement('li');
                loanItem.className = 'list-item'; // Add a class for styling if needed
                loanItem.innerHTML = `
                    <strong>Amount:</strong> $${loan.monto} - 
                    <em>Start Date: ${loan.fecha_inicio}</em> - 
                    <em>Status: ${loan.estado}</em> - 
                    <em>Client: ${clientName}</em>
                `;
                loanList.appendChild(loanItem);

                // Process and display payments
                loan.cobros.forEach(cobro => {
                    const paymentItem = document.createElement('li');
                    paymentItem.className = 'list-item'; // Add a class for styling if needed
                    paymentItem.innerHTML = `
                        <strong>Amount:</strong> $${cobro.monto} - 
                        <em>Date: ${cobro.fecha_cobro}</em>
                    `;
                    paymentList.appendChild(paymentItem);
                });
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Load data on page load
    loadData();

    // Add event listener for the "Rendir" button
    const renderButton = document.getElementById('render-button');
    if (renderButton) {
        renderButton.addEventListener('click', () => {
            alert('Rendir button clicked! Implement the desired functionality here.');
            // Add your "Rendir" button functionality here
        });
    }
});