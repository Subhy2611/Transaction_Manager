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