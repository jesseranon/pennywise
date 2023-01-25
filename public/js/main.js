const forecastsDash = document.querySelector('.forecasts-dash')
const accountsDash = document.querySelector('.accounts-dash')
const transactionsDash = document.querySelector('.transactions-dash')

forecastsDash.addEventListener('click', e => {
    if (e.target.matches('li.forecast-tile') || e.target.closest('.forecast-tile')) {
        console.log('show forecast modal')
    }
})

accountsDash.addEventListener('click', e => {
    if (e.target.matches('li.account-tile') || e.target.closest('.account-tile')) {
        console.log('show account modal')
    }
})

transactionsDash.addEventListener('click', e => {
    if (e.target.matches('li.transaction-tile') || e.target.closest('.transaction-tile')) {
        console.log('show transaction modal')
    }
})