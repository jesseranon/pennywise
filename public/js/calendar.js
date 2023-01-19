window.addEventListener('load', (e) => {
    console.log(e)
})

function setCurrentDate() {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDate = today.getDate()
    return `${currentYear}-${currentMonth}-${currentDate}`
}

// listen for click on each date tile, highlight selected date, display forecasts and transactions