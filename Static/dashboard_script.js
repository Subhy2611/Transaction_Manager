// Get the context of the canvas element
const ctx = document.getElementById('balanceChart').getContext('2d');

// Data for the pie chart in shades of blue
const data = {
    labels: ['Bank of America', 'Bank of Australia'],
    datasets: [{
        data: [1200.00, 1498.12], // Example balances
        backgroundColor: [
            'rgba(0, 190, 255, 0.7)', // Blue shade 1
            'rgba(0, 60, 255, 0.7)'   // Blue shade 2
        ],
        borderColor: [
            'rgba(0, 190, 255, 0.7)', // Blue shade 1
            'rgba(0, 60, 255, 0.7)'   // Blue shade 2
        ],
        borderWidth: 1
    }]
};

// Config for the chart
const config = {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Bank Balances'
            }
        }
    }
};

const balanceChart = new Chart(ctx, config);
