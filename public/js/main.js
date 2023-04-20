const forecastsDash = document.querySelector('.forecasts-dash')
const accountsDash = document.querySelectorAll('.accounts-dash')
const transactionsDash = document.querySelector('.transactions-dash')
const mainModal = document.querySelector('#mainModal')
const categoriesObj = {}
categories.forEach(category => {
    console.log(category)
    categoriesObj[category] = category
})
const mainModalSubmitButton = document.querySelector('#mainModalSubmitButton')

const dataActions = ['edit', 'convert', 'delete'];

[forecastsDash, ...accountsDash, transactionsDash].forEach(dash => {
    if (dash) {
        dash.addEventListener('click', async e => {
            const action = e.target.closest('[data-action]').dataset.action || null
            // console.log(action)
            let tileElement = e.target.closest('[data-type]')
            const type = tileElement.dataset.type
            if (type === 'transaction') {
                if (action === 'create') tileElement = e.target.closest('[data-account-id]')
                else if (action === 'delete') tileElement = e.target.closest('[data-transaction-id]')
                renderMainModal(type, action, tileElement)
            } else if (action === 'create') {
                renderMainModal(type, action)
            } else if (dataActions.includes(action)) {
                if (action === 'convert') {
                    let accountId = null
                    const assets = accounts.filter(account => account.balanceType === 'asset')
                    if (assets.length) accountId = assets[0]._id
                    else accountId = accounts[0]._id
                    tileElement.setAttribute("data-account-id", accountId)
                }
                renderMainModal(type, action, tileElement)
            }
        })
    }
})

//Modal
// render modal behavior

function renderMainModal(type, action, tileElement = null) {
    if (tileElement) console.log(tileElement)
    try {
        renderMainModalTitle(type, action)

        renderMainModalBody(type, action, tileElement)
        
        setMainModalSubmit()
    } catch (err) {
        console.error(err)
    }
    
}

function renderMainModalTitle(type, action) {
    const mainModalTitle = mainModal.querySelector('#mainModalTitle')
    mainModalTitle.innerText = `${action[0].toUpperCase() + action.slice(1)} ${type[0].toUpperCase() + type.slice(1)}`
}

function renderMainModalBody(type, action, infoObj = null) {
    const mainModalBody = mainModal.querySelector('#mainModalBody')

    let formElement = null
    let objectId = null
    switch (action) {
        case 'create':
            formElement = setCreateForm(type, infoObj)
            break
        case 'edit':
            formElement = setUpdateForm(type, infoObj)
            break
        case 'convert':
            formElement = setUpdateForm('transaction', infoObj)
            break
        case 'delete':
            formElement = setDeletePrompt(type, infoObj)
            break
    }

    if (formElement.children.length > 0) {
        if (infoObj) {
            if (type === 'account') objectId = infoObj.dataset.accountId
            if (type === 'transaction') {
                let suffix = ''
                console.log(infoObj)
                if (action === 'create') {
                    suffix += '/null'
                    objectId = infoObj.dataset.accountId + suffix
                }

                else objectId = infoObj.dataset.transactionId
            }
            if (type === 'forecast') objectId = infoObj.dataset.forecastId
        }
        formElement.setAttribute("action", `/${type}/${(action === 'edit') ? 'update' : action}${(objectId) ? '/' + objectId : ''}`)

        mainModalBody.appendChild(formElement)
    } else {
        alert("for some reason the modal didn't render a form")
    }
}

function setMainModalSubmit() {
    mainModalSubmitButton.setAttribute("form", "form1")
    mainModalSubmitButton.setAttribute("value", "Submit")
}

/*
    CREATE FORMS
    top level:
    - setCreateForm
    calls:
    - setCreateAccountForm
    - setCreateForecastForm
    - setCreateTransactionForm
*/

function setCreateForm(type, infoObject = null) {
    if (type === 'transaction') return setCreateTransactionForm(infoObject)
    else if (type === 'forecast') return setCreateForecastForm(infoObject)
    else if (type === 'account') return setCreateAccountForm(infoObject)
}

function setCreateAccountForm(valuesObject = null) {
    const fields = {
        textInput: {
            label: "Give this account a name",
            selectOptions: null,
            name: "createAccountName",
            id: "createAccountName"
        },
    }
    if (!valuesObject) {
        fields.selectOption = {
            label: "Account type",
            name: "createAccountType",
            id: "createAccountType",
            options: {
                savings: "Savings",
                checking: "Checking",
                cash: "Cash",
                "credit-card": "Credit Card",
                loan: "Loan"
            }
        }
        fields.numberInput = {
            label: "Beginning Balance",
            name: "createAccountBalance",
            id: "createAccountBalance"
        }
    } else {
        fields.textInput.label = "Give this account a new name"
    }
    return renderForm(fields)
}

function setCreateForecastForm(infoElement = null) {
    const fields = {
        selectOption: {
            label: "Are you expecting to pay something or to get paid?",
            name: "accountingType",
            id: "accountingType",
            options: {
                credits: "Pay something",
                debits: "Get paid"
            }
        },
        numberInput: {
            label: "How much?",
            name: "amount",
            id: "amount"
        },
        datalist: {
            label: "Which category is this for?",
            selectOptions: Object.assign(
                {
                    id: "categories"
                },
                categoriesObj
            ),
            name: "category",
            id: "category",
            list: "categories"
        },
        dateInput: {
            label: "When is this going to happen?",
            name: "date",
            id: "date"
        }
    }
    if (infoElement) {
        fields.selectOption.selected = infoElement.querySelector('.forecastAmount').innerText[0] === '+' ? 'debits' : 'credits'
        fields.numberInput.value = infoElement.querySelector('.forecastAmount').innerText.slice(2)
        fields.datalist.value = infoElement.querySelector('.forecastCategory').innerText

        const [month, day, year] = infoElement.querySelector('.forecastDate').innerText.split('/')
        fields.dateInput.value = `${year}-${month}-${day}`
    }
    return renderForm(fields)
}

function setCreateTransactionForm(infoElement = null) {
    const accountId = infoElement.dataset.accountId
    const fields = {
        hiddenInput: {
            name: "account",
            value: accountId
        },
        selectOption: {
            label: "Are you putting money into this account, or spending out of it?",
            name: "accountingType",
            id: "accountingType",
            options: {
                debits: "deposit/pay down",
                credits: "spend"
            },
            selected: null
        },
        numberInput: {
            label: "How much?",
            name: "amount",
            id: "amount"
        },
        datalist: {
            label: "Which category is this for?",
            selectOptions: Object.assign(
                {
                    id: "categories"
                },
                categoriesObj
            ),
            name: "category",
            id: "category",
            list: "categories"
        }
    }

    if (infoElement) {
        if (infoElement.querySelector('.forecast-decrease')) fields.selectOption.selected = 'credits'
        else if (infoElement.querySelector('.forecast-increase')) fields.selectOption.selected = 'debits'

        const number = infoElement.querySelector('.forecastAmount')
        if (number) fields.numberInput.value = number.innerText.split('$')[1]

        const category = infoElement.querySelector('.forecastCategory')
        if (category) fields.datalist.value = category.innerText

        let accountLabel = "For "
        const accountName = infoElement.querySelector('.account-name')
        if (accountName) {
            fields.hiddenInput.label = accountLabel + accountName.innerText
        }
        else fields.hiddenInput.label = accountLabel + document.querySelector('.accounts-dash').querySelector('.account-name').innerText
    }

    return renderForm(fields)
}

/*
    UPDATE FORMS
    top level:
    - setUpdateForm
    calls:
    - setUpdateAccountForm
    - setUpdateForecastForm
    - setUpdateTransactionForm
*/
function setUpdateForm(type, infoObj) {
    if (type === 'forecast') return setUpdateForecastForm(infoObj)
    if (type === 'account') return setUpdateAccountForm(infoObj)
    if (type === 'transaction') return setUpdateTransactionForm(infoObj)
}

function setUpdateAccountForm(infoObj) {
    return setCreateAccountForm(infoObj)
}

function setUpdateForecastForm(infoObj) {
    return setCreateForecastForm(infoObj)
}

function setUpdateTransactionForm(infoObj) {
    const fields = {
        selectOption: {
            label: "Are you putting money into this account, or spending out of it?",
            name: "accountingType",
            id: "accountingType",
            options: {
                debits: "deposit/pay down",
                credits: "spend"
            },
            selected: null
        },
        numberInput: {
            label: "How much?",
            name: "amount",
            id: "amount"
        },
        datalist: {
            label: "Which category is this for?",
            selectOptions: Object.assign(
                {
                    id: "categories"
                },
                categoriesObj
            ),
            name: "category",
            id: "category",
            list: "categories"
        }
    }

    if (infoObj.dataset.type === 'transaction') {
        delete fields.selectOption
        fields.numberInput.value = infoObj.querySelector('.transactionAmount').innerText.slice(2)
        fields.datalist.value = infoObj.querySelector('.transactionCategory').innerText
    }

    if (infoObj.dataset.type === 'forecast') {
        fields.selectOption.selected = infoObj.querySelector('.forecastAmount').innerText[0] === '+' ? 'debits' : 'credits'
        fields.numberInput.value = infoObj.querySelector('.forecastAmount').innerText.slice(2)
        fields.datalist.value = infoObj.querySelector('.forecastCategory').innerText
    }

    return renderForm(fields)
}

/*
    DELETE PROMPT
    - sends a delete prompt with the given object's values
    - click the delete button to send delete put
*/

function setDeletePrompt(type, tileElement) {
    const paragraph = {
        type
    }

    const fields = {
        paragraph
    }

    if (type === 'forecast') {
        if (tileElement.querySelector('.forecastDate')) paragraph.date = tileElement.querySelector('.forecastDate').innerText
    
        if (tileElement.querySelector('.forecastAmount')) paragraph.amount = tileElement.querySelector('.forecastAmount').innerText.slice(1)

        if (tileElement.querySelector('.forecastCategory')) paragraph.category = tileElement.querySelector('.forecastCategory').innerText
        
    }
    
    if (type === 'account') {
        if (tileElement.querySelector('.accountName')) paragraph.name = tileElement.querySelector('.accountName').innerText
        
        if (tileElement.querySelector('.accountType')) paragraph.subType = tileElement.querySelector('.accountType').innerText
        
        if (tileElement.querySelector('.accountBalance')) paragraph.amount = tileElement.querySelector('.accountBalance').innerText        
    }

    if (type === 'transaction') {
        if (tileElement.querySelector('.transactionDate')) paragraph.date = tileElement.querySelector('.transactionDate').innerText

        if (tileElement.querySelector('.transactionCategory')) paragraph.category = tileElement.querySelector('.transactionCategory').innerText

        if (tileElement.querySelector('.transactionAmount')) paragraph.amount = tileElement.querySelector('.transactionAmount').innerText.slice(1)
    }
    
    return renderForm(fields)
}

/*
    FORM HELPERS
    top level:
    - renderForm: calls all others
    middle:
    - renderFormGroup: wraps form inputs into form-groups
    bottom level:
    - renderFormLabel
    - renderTextInput
    - renderNumberInput
    - renderDateInput
    - renderSelectOptionInput
    - renderDatalistInput
    - setMainModalSubmit
*/

function renderForm(fieldsObj) {
    /* fields object
        fieldType: {
                label: "label" (string)
                name: "fieldName" (string),
                value: "value" (string/null for blank)
                //optional
                type: "hidden",
                etc
        }
        /* example
        textInput: {
            label,
            selectOptions,
            ... rest
        }
        numberInput: {
                name,
                id
        }
        dateInput: {
            label,
            rest
        }
        hiddenInput: {
            name,
            value,
            id
        }
        datalist: {
            id: "string",
            options: [ "string", "string2", "string3" ]
        }
        selectOption: {
            label,
            name,
            id,
            options: {
                key1: value1,
                key2: value2
            }
        }
        paragraph: {
            type
            amount
            date
            category
            name
            subtype
        }
    */
    const formElement = document.createElement('form')
    formElement.setAttribute("id", "form1")
    formElement.setAttribute("method", "post")
    
    const {...fields} = fieldsObj

    //append fields according to type
    // // render form group
    // // append input field to form group
    // // append form group to form
    for (const field in fields) {
        switch (field) {
            case 'textInput':
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderTextInput(fieldsObj[field])
                    )
                )
                break
            case 'numberInput':
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderNumberInput(fieldsObj[field])
                    )
                )
                break
            case 'dateInput':
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderDateInput(fieldsObj[field])
                    )
                )
                break
            case 'hiddenInput':
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderHiddenInput(fieldsObj[field])
                    )
                )
                break
            case 'selectOption':
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderSelectOptionInput(fieldsObj[field])
                    )
                )
                break
            case 'datalist':
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderTextInput(fieldsObj[field]),
                        renderDatalistInput(fieldsObj[field])
                    )
                )
                break
            case 'paragraph':
                formElement.appendChild(
                    renderFormGroup(
                        renderDeleteParagraph(fieldsObj[field])
                    )
                )
                break
        }
    }

    return formElement
}

function renderFormGroup(...elements) {
    const formGroup = document.createElement('div')
    formGroup.classList.add("form-group")
    elements.forEach(element => {
        if (element) formGroup.appendChild(element)
    })
    return formGroup
}

function renderTextInput(fieldObject) {
    const {label, selectOptions, ...rest} = fieldObject
    const textInput = document.createElement('input')
    textInput.classList.add("form-control")
    textInput.setAttribute("type", "text")
    textInput.setAttribute("autocomplete", "off")

    for (const attr in rest) {
        console.log(attr)
        console.log(fieldObject[attr])
        if (fieldObject[attr] != null) textInput.setAttribute(attr, fieldObject[attr])
    }

    return textInput
}

function renderHiddenInput(fieldObject) {
    const hiddenInput = document.createElement('input')
    hiddenInput.setAttribute("type", "hidden")
    hiddenInput.setAttribute("name", fieldObject.name)
    hiddenInput.setAttribute("value", fieldObject.value)

    return hiddenInput
}

function renderNumberInput(fieldObject) {
    const {label, ...rest} = fieldObject
    const numberInput = document.createElement('input')
    numberInput.classList.add("form-control")
    numberInput.setAttribute("type", "number")
    numberInput.setAttribute("step", "0.01")
    numberInput.setAttribute("min", "0")
    numberInput.setAttribute("placeholder", "0.00")
    numberInput.setAttribute("autocomplete", "off")

    for (const attr in rest) {
        if (fieldObject[attr]) numberInput.setAttribute(attr, fieldObject[attr])
    }

    return numberInput
}

function renderDateInput(fieldObject) {
    const {label, ...rest} = fieldObject
    const dateInput = document.createElement('input')
    dateInput.classList.add("form-control")
    dateInput.setAttribute("type", "date")

    for (const attr in rest) {
        if (fieldObject[attr]) dateInput.setAttribute(attr, fieldObject[attr])
    }

    return dateInput
}

function renderSelectOptionInput(fieldObject) {
    const {label, name, id, options, selected} = fieldObject
    const selectInput = document.createElement('select')
    selectInput.classList.add('form-select')
    selectInput.setAttribute('name', name)
    selectInput.setAttribute('id', id)

    for (const [k, v] of Object.entries(options)) {
        const optionElement = document.createElement('option')
        optionElement.value = k
        optionElement.innerText = v ? v : k[0].toUpperCase() + k.slice(1)
        if (selected && selected == k) optionElement.setAttribute('selected', 'selected')
        selectInput.appendChild(optionElement)
    }

    return selectInput
}

function renderDatalistInput(fieldObject) {
    const {label, selectOptions, ...rest} = fieldObject
    const datalistInput = document.createElement('datalist')
    const {id, ...options} = selectOptions
    datalistInput.setAttribute('id', id)

    for (const [k,v] of Object.entries(options)) {
        const optionElement = document.createElement('option')
        optionElement.value = v
        datalistInput.appendChild(optionElement)
    }

    return datalistInput
}

function renderFormLabel(fieldObject) {
    const label = document.createElement('label')
    label.setAttribute("for", fieldObject.name)
    label.classList.add("form-label")
    label.innerText = fieldObject.label
    return label
}

function renderDeleteParagraph(fieldObject) {
    console.log('delete action', fieldObject)
    const paragraph = document.createElement('p')
    paragraph.innerHTML += `Are you sure you want to delete the`

    if (fieldObject.hasOwnProperty("subType")) paragraph.innerHTML += ` ${fieldObject.subType}`

    paragraph.innerHTML += ` ${fieldObject.type}`

    if (fieldObject.hasOwnProperty("name")) paragraph.innerHTML += ` ${fieldObject.name}`
    
    if (fieldObject.hasOwnProperty("date")) paragraph.innerHTML += ` on ${fieldObject.date}`

    if (fieldObject.hasOwnProperty("category")) paragraph.innerHTML += ` for ${fieldObject.category}`

    if (fieldObject.hasOwnProperty("amount")) paragraph.innerHTML += ` in the amount of ${fieldObject.amount}`

    paragraph.innerHTML += `?`

    return paragraph
}

// CLOSE MODAL
// close modal behavior
// // erase #mainModalTitle
// // erase #mainModalBody
// // un-set #mainModalSubmitButton action/href

const closeModalButtons = document.querySelectorAll('button[data-bs-dismiss="modal"]')

closeModalButtons.forEach(b => {
    b.addEventListener('click', resetMainModal)
})
function resetMainModal() {
    mainModal.querySelector('#mainModalTitle').innerHTML = ''
    mainModal.querySelector('#mainModalBody').innerHTML = ''
    mainModalSubmitButton.removeAttribute("form")
    mainModalSubmitButton.removeAttribute("value")
}