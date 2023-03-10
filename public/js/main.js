const forecastsDash = document.querySelector('.forecasts-dash')
const accountsDash = document.querySelector('.accounts-dash')
const transactionsDash = document.querySelector('.transactions-dash')

forecastsDash.addEventListener('click', e => {
    // if (e.target.matches('li.forecast-tile') || e.target.closest('.forecast-tile')) {
    //     console.log('show forecast modal')
    // }
    if (e.target.closest('[data-create="forecast"]')) location.href('/forecasts/createForecast')
})

accountsDash.addEventListener('click', e => {
    if (e.target.matches('li.account-tile') || e.target.closest('.account-tile')) {
        console.log('show account modal')
    }
})

// transactionsDash.addEventListener('click', e => {
//     if (e.target.matches('li.transaction-tile') || e.target.closest('.transaction-tile')) {
//         console.log('show transaction modal')
//     }
// })

// MODALS
const mainModal = document.querySelector('#mainModal')

// DELETE MODAL
const deleteForecastButtons = document.querySelectorAll('.delete-forecast')

const deleteModal = document.querySelector('#deleteModal')

const deleteModalTextDocType = deleteModal.querySelector('#deleteModalTextDocType')
const deleteModalTextDate = deleteModal.querySelector('#deleteModalTextDate')
const deleteModalTextCategory = deleteModal.querySelector('#deleteModalTextCategory')
const deleteModalTextAmount = deleteModal.querySelector('#deleteModalTextAmount')
const deleteModalDeleteButton = deleteModal.querySelector('#deleteModalDeleteBtn')

const deleteModalText = [deleteModalTextDocType, deleteModalTextDate, deleteModalTextCategory, deleteModalTextAmount]

deleteForecastButtons.forEach(b => {
    b.addEventListener('click', e => {
        console.log(`delete forecast button clicked`)
        // get forecast info
        const clickedForecast =  e.target.closest('.forecast-tile')
        const forecastDate = clickedForecast.querySelector('.forecastDate').innerText
        const forecastCategory = clickedForecast.querySelector('.forecastCategory').innerText
        const forecastAmount = clickedForecast.querySelector('.forecastAmount').innerText
        const forecastId = clickedForecast.getAttribute('data-forecast-id')
        // // populate spans in modal with forecast info
        deleteModalTextDocType.innerText = `forecast`
        deleteModalTextDate.innerText = forecastDate
        deleteModalTextCategory.innerText = forecastCategory
        deleteModalTextAmount.innerText = forecastAmount
        deleteModalDeleteButton.setAttribute('href', `/forecasts/deleteForecast/${forecastId}`)
    })
})

const closeModalButtons = document.querySelectorAll('button[data-bs-dismiss="modal"]')

closeModalButtons.forEach(b => {
    b.addEventListener('click', e => {
        // console.log('close modal button clicked')
        // clear delete modal spans
        deleteModalText.forEach(e => e.innerText = "")
        // remove href from delete button
        deleteModalDeleteButton.removeAttribute('href')
    })
})