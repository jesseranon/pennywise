const forecastsDash = document.querySelector('.forecasts-dash')
const accountsDash = document.querySelector('.accounts-dash')
const transactionsDash = document.querySelector('.transactions-dash')
const mainModal = document.querySelector('#mainModal')
const categoriesObj = {}
categories.forEach(category => {
    categoriesObj[category] = null
})

const dataActions = ['edit', 'update', 'convert', 'delete'];

[forecastsDash, accountsDash, transactionsDash].forEach(dash => {
    if (dash) {
        dash.addEventListener('click', async e => {
            const action = e.target.closest('[data-action]').dataset.action || null
            const tileElement = e.target.closest('[data-type]')
            const type = tileElement.dataset.type
            if (action === 'create') {
                renderMainModal(type, action)
            }
            else if (dataActions.includes(action)) renderMainModal(type, action, tileElement)
        })
    }
})

//Modal

// render modal behavior
// target #mainModal

async function renderMainModal(type, action, tileElement = null) {
    try {
        renderMainModalBody(type, action, tileElement)
    } catch (err) {

    }
    //set #mainModalTitle
    //set #mainModalBody using renderModalBody()
    //set #mainModalSubmitButton action/href using setModalSubmit() ?
}

function renderMainModalBody(type, action, infoObj = null) {
    const body = mainModal.querySelector('#mainModalBody')
    switch (action) { //body.appendChild(result)
        case 'create':
            setCreateForm(type)
            break
        case 'edit':
            setUpdateForm(type, infoObj)
            break
        case 'convert':
            setCreateForm('transaction', infoObj)
            break
        case 'delete':
            setDeletePrompt(type, infoObj)
            break
    }
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

function setCreateForm(type, infoObj = null) {
    if (type === 'transaction') {
        setCreateTransactionForm(infoObj)
    } else {
        setCreateForecastForm(infoObj)
    }
}

function setCreateAccountForm() {
    //generate fields object
    const fields = {
        name: null,
        accountType: null,
        balanceType: null,
        amount: null
    }
    //call setForm() w/ fields object
    console.log(`create account form`)
    //setForm(fields)
}

function setCreateForecastForm() {
    try {
        // const accounts = await (need to create controller endpoint for getting user accounts)
        // const categories = await (need to create controller endpoint for getting user categories)
        const fields = {
            amount: null,
            accountingType: null,
            category: null,
            date: null,
        }
        console.log(`create forecast form`)
        //setForm(fields)
    } catch (err) {

    }
    
}

function setCreateTransactionForm(infoObj = null) {
    console.log(infoObj)
    const fields = {
        accountId: null,
        amount: null,
        accountingType: null,
        category: null,
        date: null
    }
    console.log(`create transaction${infoObj.forecast ? ' and convert forecast' : ''} form`)
    //setForm(fields)
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
    if (type === 'forecast') setUpdateForecastForm(infoObj)
    if (type === 'account') setUpdateAccountForm(infoObj)
    if (type === 'transaction') setUpdateTransactionForm(infoObj)
}

function setUpdateAccountForm(infoObj) {
    const fields = {
        name,
        type
    }
    console.log(`update account form`)
}

function setUpdateForecastForm(infoObj) {
    console.log(`update forecast form`)
}

function setUpdateTransactionForm(infoObj) {
    console.log(`update transaction form`)
}

/*
    DELETE PROMPT
    - sends a delete prompt with the given object's values
    - click the delete button to send delete put
*/

function setDeletePrompt(type, infoObj) {
    //call setMainModalSubmit() to set delete action link
    console.log(`delete ${type} prompt`)
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
*/

function renderForm(fieldsObj) {
    /* fields object
        formAction: url (string),
        formMethod: get/post (string),
        fieldType: {
                label: "label" (string)
                name: "fieldName" (string),
                value: "value" (string/null for blank)
                //optional
                type: "hidden",
                etc
        }
        /* example
        numberInput: {
                name: amount,
                value: null
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
    */
    const formElement = document.createElement('form')
    const {formAction, formMethod, ...fields} = fieldsObj
    console.log(fields)
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
        }
    }

    // // render form buttons
    //return form element
    console.log(formElement)
}

function renderFormGroup(...elements) {
    const formGroup = document.createElement('div')
    formGroup.classList.add("form-group")
    elements.forEach(element => {
        console.log(element)
        formGroup.appendChild(element)
    })
    console.log(formGroup)
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
    console.log(textInput)
    return textInput
}

function renderHiddenInput(fieldObject) {

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
    console.log(numberInput)
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
    console.log(dateInput)
    return dateInput
}

function renderSelectOptionInput(fieldObject) {
    const {label, name, id, options} = fieldObject
    const selectInput = document.createElement('select')
    selectInput.classList.add('form-select')
    selectInput.setAttribute('name', name)
    selectInput.setAttribute('id', id)

    for (const [k, v] of Object.entries(options)) {
        const optionElement = document.createElement('option')
        optionElement.value = k
        optionElement.innerText = v ? v : k[0].toUpperCase() + k.slice(1)
        selectInput.appendChild(optionElement)
    }
    console.log(selectInput)
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
    console.log(datalistInput)
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

function setMainModalSubmit() {

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
}

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