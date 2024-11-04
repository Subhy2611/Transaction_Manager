// Get the context of the canvas element
const ctx = document.getElementById('balanceChart').getContext('2d');

// Data for the pie chart in shades of blue
const data = {
    labels: [],
    datasets: [{
        data: [], // Example balances
        backgroundColor: [
            'rgb(73, 206, 252)', // Blue shade 1
            'rgb(0, 49, 102)',   // Blue shade 2
            'rgb(0, 86, 179)',   // Blue shade 3
            'rgb(50, 143, 175)'   // Blue shade 4
        ],
        borderColor: [
            'rgb(73, 206, 252)', // Blue shade 1
            'rgb(0, 49, 102)',  // Blue shade 2
            'rgb(0, 86, 179)',   // Blue shade 3
            'rgb(50, 143, 175)'   // Blue shade 4
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

///////////// To get username and email //////////////
document.addEventListener('DOMContentLoaded', () => {
    fetch('/user-info')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const firstname = data.firstname;
            const lastname = data.lastname;
            const email = data.email;
            const fullname = `${firstname} ${lastname}`;
            document.querySelector('.fullname').textContent = fullname;
            document.querySelector('.email').textContent = email;
            document.querySelector('.highlighted-text').textContent = fullname;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    // Fetch user info for displaying name and email
    fetch('/user-info')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.fullname').textContent = `${data.firstname} ${data.lastname}`;
            document.querySelector('.email').textContent = data.email;
            document.querySelector('.highlighted-text').textContent = `${data.firstname} ${data.lastname}`;
        })
        .catch(error => console.error('Error fetching user info:', error));

    // Fetch bank account details for balance and chart update
    fetch('/api/banks')
        .then(response => response.json())
        .then(accounts => {
            // Calculate total balance
            const totalBalance = accounts.reduce((sum, acc) => sum + acc.accountbalance, 0);
            document.querySelector('.balance-info h1').textContent = `$${totalBalance.toFixed(2)}`;

            // Update chart data
            const labels = accounts.map(acc => acc.bankname);
            const data = accounts.map(acc => acc.accountbalance);

            // Update and re-render the chart
            balanceChart.data.labels = labels;
            balanceChart.data.datasets[0].data = data;
            balanceChart.update();
        })
        .catch(error => console.error('Error fetching accounts:', error));
});
