const transactionAmount = document.querySelector('#createTransactionAmount')
const currentBalance = Number(document.querySelector('#currentBalance').innerText)
const spendReceive = document.querySelector('#createTransactionType')
const accountInfo = document.querySelector('#account-data')
const accountSubType = accountInfo.dataset.accountSubType

transactionAmount.addEventListener('input', (e) => {
    const inputAmount = Number(e.target.value)
    const selectedType = spendReceive.options[spendReceive.selectedIndex].value

    let newAmount = currentBalance

    if (accountSubType === 'asset') {
        newAmount += (selectedType === 'debit' ? inputAmount : -inputAmount)
    } else {
        newAmount += (selectedType === 'debit' ? -inputAmount : inputAmount)
    }

    document.querySelector('#netEffect').innerText = newAmount
})