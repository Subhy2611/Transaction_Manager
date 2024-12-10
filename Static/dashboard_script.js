// Function to generate shades of blue based on ratio
function generateBlueShadesByRatio(count, ratios) {
    const shades = [];
    for (let i = 0; i < count; i++) {
        const ratio = ratios[i];
        const hue = 190 + (ratio * 50); // Hue for blue(180 to 240)
        // Map ratio (0 to 1) to lightness from 70% (lightest) to 10% (darkest)
        const lightness = 70 - (ratio * 60);
        const shade = `hsl(${hue}, 100%, ${lightness}%)`;
        shades.push(shade);
    }
    return shades;
}

// Get the context of the canvas element
const ctx = document.getElementById('balanceChart').getContext('2d');

// Data for the pie chart in shades of blue
const data = {
    labels: [],
    datasets: [{
        data: [], // Will be populated dynamically
        backgroundColor: [], // Will be generated dynamically
        borderColor: [], // Will be generated dynamically
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

// Fetch bank account details for balance and chart update
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/banks')
        .then(response => response.json())
        .then(accounts => {
            // Calculate total balance
            const totalBalance = accounts.reduce((sum, acc) => sum + acc.accountbalance, 0);
            document.querySelector('.balance-info h1').textContent = `$${totalBalance.toFixed(2)}`;

            // Update chart data
            const labels = accounts.map(acc => acc.bankname);
            const data = accounts.map(acc => acc.accountbalance);
            const ratios = data.map(balance => balance / totalBalance);

            // Generate shades of blue based on the ratio of the amount each account holds
            const shades = generateBlueShadesByRatio(accounts.length, ratios);

            // Update and re-render the chart
            balanceChart.data.labels = labels;
            balanceChart.data.datasets[0].data = data;
            balanceChart.data.datasets[0].backgroundColor = shades;
            balanceChart.data.datasets[0].borderColor = shades;
            balanceChart.update();
        })
        .catch(error => console.error('Error fetching accounts:', error));
});

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

///////////// To get user name and email //////////////
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
});

    
/////////////// To get bank names to view transactions //////////////
document.addEventListener('DOMContentLoaded', () => {      
    fetch('/api/banks')
        .then(response => response.json())
        .then(accounts => {
            // Show all bank names
            accounts.forEach(account => {
            const button = document.createElement('button');
            button.className = 'tab';
            button.textContent = account.bankname;
            document.querySelector('.transactions-tabs').appendChild(button);

            // Add click fuctionality to selected bank
            document.querySelector('.transactions-tabs').addEventListener('click', function(event) {
                // Check if a button was clicked
                if (event.target.classList.contains('tab')) {
                    // Remove the 'active' class from all buttons
                    document.querySelectorAll('.transactions-tabs .tab').forEach(btn => btn.classList.remove('active'));
                    
                    // Add the 'active' class to the clicked button
                    event.target.classList.add('active');

                    // (Optional) Handle showing transactions for the clicked bank here
                    console.log(`Selected bank: ${event.target.textContent}`);
                }
            });
        });
    })
    .catch(error => console.error('Error fetching accounts:', error));
});
