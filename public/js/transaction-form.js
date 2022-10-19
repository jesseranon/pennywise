const transactionAmount = document.querySelector('#createTransactionAmount')
const currentBalance = Number(document.querySelector('#currentBalance').innerText)
const spendReceive = document.querySelector('#createTransactionType')
const accountInfo = document.querySelector('#account-data')
const accountSubType = accountInfo.dataset.accountSubType

transactionAmount.addEventListener('input', (e) => {
    let inputAmount = e.target.value
    const inputLength = inputAmount.length
    //format input
    if (inputLength <= 2) {
        inputAmount = Number("00." + "0".repeat(2 - inputLength) + inputAmount)
    } else if (inputLength <= 4) { // 01.23 -> 12.34
        inputAmount = Number("0".repeat(4 - inputLength) + inputAmount.slice(0, inputLength - 2) + "." + inputAmount.slice(inputLength - 2))
    } else if (inputLength === 5) {
        inputAmount = Number(inputAmount.toString())
    }
    console.log(inputAmount)

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