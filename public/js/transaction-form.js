const transactionAmount = document.querySelector('#transactionAmount')
const currentBalance = Number(document.querySelector('#currentBalance').innerText)
const spendReceive = document.querySelector('#transactionType')
const accountInfo = document.querySelector('#account-data')
const accountSubType = accountInfo.dataset.accountSubType

transactionAmount.addEventListener('input', (e) => {
    // let inputAmount = e.target.value
    // console.log(typeof inputAmount)
    // let placeholder = transactionAmount.getAttribute('placeholder')
    // if (inputAmount.length <= 2) {
    //     placeholder = placeholder.slice(0, placeholder.length - inputAmount.length)
    //     transactionAmount.setAttribute('placeholder', placeholder + inputAmount)
    // }
    // console.log(placeholder)

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