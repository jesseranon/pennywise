const transactionAmount = document.querySelector('#createTransactionAmount')
const currentBalance = Number(document.querySelector('#currentBalance').innerText)
const spendReceive = document.querySelector('#createTransactionType')
const accountInfo = document.querySelector('#account-data')
const accountSubType = accountInfo.dataset.accountSubType

transactionAmount.addEventListener('input', (e) => {
    let inputAmount = e.target.value
    const inputLength = inputAmount.length
    let dollars = ''
    let cents = ''
    let newAmountDisplay = ''

    //format input
    /**
    pull off two right-most characters and format as cents
    if there are any other characters left, put those to dollars
    -> insert a comma after every third character from the right
     */

    // //change newAmount display
    // const selectedType = spendReceive.options[spendReceive.selectedIndex].value

    // let newAmount = currentBalance

    // if (accountSubType === 'asset') {
    //     newAmount += (selectedType === 'debit' ? inputAmount : -inputAmount)
    // } else {
    //     newAmount += (selectedType === 'debit' ? -inputAmount : inputAmount)
    // }

    // document.querySelector('#netEffect').innerText = newAmount
})