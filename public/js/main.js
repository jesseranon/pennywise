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
            let tileElement = e.target.closest('[data-type]')
            const type = tileElement.dataset.type
            if (type === 'transaction') {
                tileElement = e.target.closest('[data-account-id]')
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
        //set #mainModalTitle
        renderMainModalTitle(type, action)
        //set #mainModalBody using renderModalBody()
        renderMainModalBody(type, action, tileElement)
        //set #mainModalSubmitButton action/href using setModalSubmit() ?
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
    console.log(mainModalBody)
    let formElement = null
    let objectId = null
    switch (action) { //body.appendChild(result)
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
    console.log(formElement)
    if (formElement.children.length > 0) {
        if (infoObj) {
            if (type === 'account') return
            if (type === 'transaction') return
            if (type === 'forecast') objectId = infoObj.dataset.forecastId
        }
        formElement.setAttribute("action", `${type}/${(action === 'edit') ? 'update' : action}${(objectId) ? '/'+objectId : ''}`)
        console.log(formElement)
        mainModalBody.appendChild(formElement)
    } else {
        alert("for some reason the modal didn't render a form")
    }
}

function setMainModalSubmit() {
    //target the submit button
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
    console.log(`hello from setCreateAccountForm`)
    //generate fields object
    const fields = {
        textInput: {
            label: "Give this account a name",
            selectOptions: null,
            name: "createAccountName",
            id: "createAccountName"
        },
        selectOption: {
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
        },
        numberInput: {
            label: "Beginning Balance",
            name: "createAccountBalance",
            id: "createAccountBalance"
        }
    }
    // if (valuesObject) {//do stuff}
    return renderForm(fields)
}

function setCreateForecastForm(valuesObject = null) {
    // console.log(`create forecast form`)
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
    if (valuesObject) {
        fields.selectOption.value = valuesObject.accountingType
        fields.numberInput.value = valuesObject.amount
        fields.datalist.value = valuesObject.category
        fields.dateInput.value = values.Object.date
    }
    return renderForm(fields)
}

function setCreateTransactionForm(infoElement = null) {
    const accountId = infoElement.dataset.accountId
    console.log(`set create transaction form func`)
    console.log(infoElement)
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

        fields.numberInput.value = infoElement.querySelector('.forecastAmount').innerText.split('$')[1]
        fields.datalist.value = infoElement.querySelector('.forecastCategory').innerText 
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
    //generate fields object
    //call setForm() w/ fields object
    if (type === 'forecast') return setUpdateForecastForm(infoObj)
    if (type === 'account') return setUpdateAccountForm(infoObj)
    if (type === 'transaction') return setUpdateTransactionForm(infoObj)
}

function setUpdateAccountForm(infoObj) {
    //return renderForm(fields)
    console.log(`update account form`)
}

function setUpdateForecastForm(infoObj) {
    //return renderForm(fields)
    console.log(`update forecast form`)
}

function setUpdateTransactionForm(infoObj) {
    //return renderForm(fields)
    console.log(`update transaction form`)
    return setCreateTransactionForm(infoObj)
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
    console.log(`setDeletePrompt has Element`)
    console.log(tileElement.dataset)
    const fields = {
        paragraph
    }
    // let id = null
    // if (type === 'transaction') id = tileElement.dataset.forecastId
    // const formAction = `${type}/delete/`
    // for dates
    if (tileElement.querySelector('.forecastDate')) paragraph.date = tileElement.querySelector('.forecastDate').innerText
    
    // for amounts
    if (tileElement.querySelector('.forecastAmount')) paragraph.amount = tileElement.querySelector('.forecastAmount').innerText.slice(1)

    // for categories
    if (tileElement.querySelector('.forecastCategory')) paragraph.category = tileElement.querySelector('.forecastCategory').innerText
    
    return renderForm(fields)
    //call setMainModalSubmit() to set delete action link
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
    // console.log(fields)
    //set attributes to form
    //append fields according to type
    // // render form group
    // // append input field to form group
    // // append form group to form
    for (const field in fields) {
        switch (field) {
            case 'textInput':
                //call renderTextInput
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderTextInput(fieldsObj[field])
                    )
                )
                break
            case 'numberInput':
                //call renderNumberInput
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderNumberInput(fieldsObj[field])
                    )
                )
                break
            case 'dateInput':
                //call renderDateInput
                formElement.appendChild(
                    renderFormGroup(
                        renderFormLabel(fieldsObj[field]),
                        renderDateInput(fieldsObj[field])
                    )
                )
                break
            case 'hiddenInput':
                //call renderDateInput
                formElement.appendChild(
                    renderHiddenInput(fieldsObj[field])
                )
                break
            case 'selectOption':
                //call renderSelectOption
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
                //call renderFormTextInput
                //call renderDatalist
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

    // // render form buttons
    return formElement
}

function renderFormGroup(...elements) {
    const formGroup = document.createElement('div')
    formGroup.classList.add("form-group")
    elements.forEach(element => {
        console.log(element)
        formGroup.appendChild(element)
    })
    // console.log(formGroup)
    return formGroup
}

function renderTextInput(fieldObject) {
    console.log(fieldObject)
    const {label, selectOptions, ...rest} = fieldObject
    const textInput = document.createElement('input')
    textInput.classList.add("form-control")
    textInput.setAttribute("type", "text")
    textInput.setAttribute("autocomplete", "off")
    console.log(rest)

    for (const attr in rest) {
        console.log(attr)
        console.log(fieldObject[attr])
        if (fieldObject[attr] != null) textInput.setAttribute(attr, fieldObject[attr])
    }
    // console.log(textInput)
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
    // console.log(numberInput)
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
    // console.log(dateInput)
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
    // console.log(selectInput)
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
    // console.log(datalistInput)
    return datalistInput
}

function renderFormLabel(fieldObject) {
    //wrap element in label
    const label = document.createElement('label')
    label.setAttribute("for", fieldObject.name)
    label.classList.add("form-label")
    label.innerText = fieldObject.label
    return label
}

function renderDeleteParagraph(fieldObject) {
    const paragraph = document.createElement('p')
    paragraph.innerHTML += `Are you sure you want to delete the`
    //for accounts
    if (fieldObject.hasOwnProperty("subType")) paragraph.innenrHTML += ` ${fieldObject.subType}`

    paragraph.innerHTML += ` ${fieldObject.type}`

    //for accounts
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

/** DEPRECATE BELOW THIS LINE WHEN FINISHED **/

// MODULAR FORM FIELDS RENDER FUNCTIONS TESTING

// const testFormFieldsObject = {
//     formAction: "#",
//     formMethod: "GET",
//     textInput: {
//         label: "Name",
//         selectOptions: null,
//         name: "createAccountName",
//         id: "createAccountName"
//     },
//     selectOption: {
//         label: "Account Type",
//         name: "createAccountType",
//         id: "createAccountType",
//         options: {
//             savings: null,
//             checking: null,
//             cash: null,
//             "credit-card": "Credit Card",
//             loan: null
//         }
//     },
//     numberInput: {
//         label: "Beginning Balance",
//         name: "createAccountBalance",
//         id: "createAccountBalance"
//     }
// }

// const testFormFieldsObject2 = {
//     formAction: "#",
//     formMethod: "GET",
//     datalist: {
//         label: "Choose Category",
//         selectOptions: Object.assign({
//             id: "categories"
//             },
//             categories
//         ),
//         name: "category",
//         id: "category",
//         list: "categories",

//     }
// }

// renderForm(testFormFieldsObject2)

// // DELETE MODAL
// const deleteForecastButtons = document.querySelectorAll('.delete-forecast')

// const deleteModal = document.querySelector('#deleteModal')

// const deleteModalTextDocType = deleteModal.querySelector('#deleteModalTextDocType')
// const deleteModalTextDate = deleteModal.querySelector('#deleteModalTextDate')
// const deleteModalTextCategory = deleteModal.querySelector('#deleteModalTextCategory')
// const deleteModalTextAmount = deleteModal.querySelector('#deleteModalTextAmount')
// const deleteModalDeleteButton = deleteModal.querySelector('#deleteModalDeleteBtn')

// const deleteModalText = [deleteModalTextDocType, deleteModalTextDate, deleteModalTextCategory, deleteModalTextAmount]

// deleteForecastButtons.forEach(b => {
//     b.addEventListener('click', e => {
//         // get forecast info
//         const clickedForecast =  e.target.closest('.forecast-tile')
//         const forecastDate = clickedForecast.querySelector('.forecastDate').innerText
//         const forecastCategory = clickedForecast.querySelector('.forecastCategory').innerText
//         const forecastAmount = clickedForecast.querySelector('.forecastAmount').innerText
//         const forecastId = clickedForecast.getAttribute('data-forecast-id')
//         // populate spans in modal with forecast info
//         deleteModalTextDocType.innerText = `forecast`
//         deleteModalTextDate.innerText = forecastDate
//         deleteModalTextCategory.innerText = forecastCategory
//         deleteModalTextAmount.innerText = forecastAmount
//         deleteModalDeleteButton.setAttribute('href', `/forecasts/deleteForecast/${forecastId}`)
//     })
// })