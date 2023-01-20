(async function($) {

    
    "use strict";
    
// Given data for events in JSON format
const data = await getForecasts()
const event_data = {events: data.events}
const currency = data.currency

const months = [ 
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December" 
]

// Event handler for when a date is clicked
function date_click(event) {
    $(".events-container").show(250);
    $("#dialog").hide(250);
    $(".active-date").removeClass("active-date");
    $(this).addClass("active-date");
    show_events(event.data.events, event.data.month, event.data.day);
};

// Event handler for when a month is clicked
function month_click(event) {
    $(".events-container").show(250);
    $("#dialog").hide(250);
    var date = event.data.date;
    $(".active-month").removeClass("active-month");
    $(this).addClass("active-month");
    const new_month = $(".month").index(this);
    date.setMonth(new_month);
    init_calendar(date);
}

// Event handler for when the year right-button is clicked
function next_year(event) {
    $("#dialog").hide(250);
    const date = event.data.date;
    const new_year = date.getFullYear()+1;
    $("year").html(new_year);
    date.setFullYear(new_year);
    init_calendar(date);
}

// Event handler for when the year left-button is clicked
function prev_year(event) {
    $("#dialog").hide(250);
    const date = event.data.date;
    const new_year = date.getFullYear()-1;
    $("year").html(new_year);
    date.setFullYear(new_year);
    init_calendar(date);
}

// Event handler for clicking the Add Event button
function new_event(event) {
    // if a date isn't selected then do nothing
    console.log(event.data)
    if($(".active-date").length===0)
        return;
    // remove red error input on click
    $("input").click(function(){
        $(this).removeClass("error-input");
    })
    // empty inputs/set input date and hide events
    /*
        need to figure out how to get date from .active-date
        month -> .active-month.text()
        date -> .active-date.text()
        year -> #label.year.text()
        */
    const abbreviatedMonths = months.map(m => m.slice(0, 3))
    const month = abbreviatedMonths.indexOf($('.active-month').text().slice(0,3)) + 1
    const date = $('.active-date').text()
    const year = $('#label.year').text()
    const dateString = `${year}-${pad(month)}-${pad(date)}`
    $("#date").val(dateString);
    $("#dialog input[type=text]").val('');
    $("#dialog input[type=number]").val('');
    $(".events-container").hide(250);
    $("#dialog").show(250);
    // Event handler for cancel button
    $("#cancel-button").click(function() {
        $("#date").removeClass("error-input");
        $("#category").removeClass("error-input");
        $("#accountingType").removeClass("error-input");
        $("#amount").removeClass("error-input");
        $("#dialog").hide(250);
        $(".events-container").show(250);
    });
    // Event handler for ok button
    // should submit form data to /forecasts/createForecast
    /*
        amount
        accountingType
        category
        date
        user will be in request.user already
    */
    // $("#ok-button").unbind().click({date: event.data.date}, function() {
    //     const date = event.data.date;
    //     const name = $("#name").val().trim();
    //     const count = parseInt($("#count").val().trim());
    //     const day = parseInt($(".active-date").html());
    //     // Basic form validation
    //     if(name.length === 0) {
    //         $("#name").addClass("error-input");
    //     }
    //     else if(isNaN(count)) {
    //         $("#count").addClass("error-input");
    //     }
    //     else {
    //         $("#dialog").hide(250);
    //         console.log("new event");
    //         new_event_json(name, count, date, day);
    //         date.setDate(day);
    //         init_calendar(date);
    //     }
    // });
}

    // Setup the calendar with the current date
$(document).ready(function(){
    const date = new Date();
    const today = date.getDate();
    // Set click handlers for DOM elements
    $(".right-button").click({date: date}, next_year);
    $(".left-button").click({date: date}, prev_year);
    $(".month").click({date: date}, month_click);
    $("#add-button").click({date: date}, new_event);
    // Set current month as active
    $(".months-row").children().eq(date.getMonth()).addClass("active-month");
    init_calendar(date);
    const events = check_events(today, date.getMonth()+1, date.getFullYear());
    show_events(events, months[date.getMonth()], today);
});

// Initialize the calendar by appending the HTML dates
function init_calendar(date) {
    $(".tbody").empty();
    $(".events-container").empty();
    const calendar_days = $(".tbody");
    const month = date.getMonth();
    const year = date.getFullYear();
    const day_count = days_in_month(month, year);
    let row = $("<tr class='table-row'></tr>");
    const today = date.getDate();
    // Set date to 1 to find the first day of the month
    date.setDate(1);
    const first_day = date.getDay();
    // 35+firstDay is the number of date elements to be added to the dates table
    // 35 is from (7 days in a week) * (up to 5 rows of dates in a month)
    for(let i=0; i<35+first_day; i++) {
        // Since some of the elements will be blank, 
        // need to calculate actual date from index
        const day = i-first_day+1;
        // If it is a sunday, make a new row
        if(i%7===0) {
            calendar_days.append(row);
            row = $("<tr class='table-row'></tr>");
        }
        // if current index isn't a day in this month, make it blank
        if(i < first_day || day > day_count) {
            var curr_date = $("<td class='table-date nil'>"+"</td>");
            row.append(curr_date);
        }   
        else {
            const curr_date = $("<td class='table-date'>"+day+"</td>");
            const events = check_events(day, month+1, year);
            if(today===day && $(".active-date").length===0) {
                curr_date.addClass("active-date");
                show_events(events, months[month], day);
            }
            // If this date has any events, style it with .event-date
            if(events.length!==0) {
                curr_date.addClass("event-date");
            }
            // Set onClick handler for clicking a date
            curr_date.click({events: events, month: months[month], day:day}, date_click);
            row.append(curr_date);
        }
    }
    // Append the last row and set the current year
    calendar_days.append(row);
    $(".year").text(year);
}

// Get the number of days in a given month/year
function days_in_month(month, year) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 1);
    return (monthEnd - monthStart) / (1000 * 60 * 60 * 24);    
}

// Adds a json event to event_data
/*
    should just be an http request to createForecast
 */
function new_event_json(name, count, date, day) {
    const event = {
        "occasion": name,
        "invited_count": count,
        "year": date.getFullYear(),
        "month": date.getMonth()+1,
        "day": day
    };
    event_data["events"].push(event);
}

// Display all events of the selected date in card views
function show_events(events, month, day) {
    // Clear the dates container
    $(".events-container").empty();
    $(".events-container").show(250);
    // console.log(`show_events function console:`)
    // console.log(event_data["events"]);
    // If there are no events for this date, notify the user
    if(events.length===0) {
        const event_card = $("<div class='event-card'></div>");
        const event_name = $("<div class='event-name'>There are no events planned for "+month+" "+day+".</div>");
        $(event_card).css({ "border-left": "10px solid #FF1744" });
        $(event_card).append(event_name);
        $(".events-container").append(event_card);
    }
    else {
        // Go through and add each event as a card to the events container
        for(let i=0; i<events.length; i++) {
            const event = events[i]
            const inc = (event.accountingType === 'debits') ? '+' : '-'
            const event_card = $("<div class='event-card'></div>");
            const event_name = $("<div class='event-name'>"+events[i].category.name+":</div>");
            const event_count = $("<div class='event-count'>"+inc+' '+currency+events[i].amount.$numberDecimal+"</div>");
            if(events[i]["cancelled"]===true) {
                $(event_card).css({
                    "border-left": "10px solid #FF1744"
                });
                event_count = $("<div class='event-cancelled'>Cancelled</div>");
            }
            $(event_card).append(event_name).append(event_count);
            $(".events-container").append(event_card);
        }
    }
}

// Checks if a specific date has any events
function check_events(day, month, year) {
    var events = [];
    for(var i=0; i<event_data["events"].length; i++) {
        var event = event_data["events"][i];
        if(event["day"]==day &&
            event["month"]==month &&
            event["year"]==year) {
                events.push(event);
            }
    }
    return events;
}


})(jQuery);

async function getForecasts() {
    try {
        // console.log(`sending fetch request from calendar-main`)
        const res = await fetch(`/calendar/getCalendarEvents/`)
        if (!res.ok) {
            const err = new Error(`data was not ok`)
            throw err
        }
        const data = await res.json()

        convertDatesToLocale(data.events)

        return data

    } catch (err) {
        console.log(err)
    }
}

function convertDatesToLocale(array) {
    const offsetMinutes = new Date().getTimezoneOffset()
    array.forEach(event => {
        const currentDate = new Date(event.date)
        // console.log(typeof currentDate)
        // console.log(`date before conversion: ${currentDate}`)
        const eventYear = currentDate.getFullYear()
        const eventMonth = currentDate.getMonth()
        const eventDate = currentDate.getDate()
        const eventHours = currentDate.getHours()
        const eventMinutes = currentDate.getMinutes() + offsetMinutes
        event.date = new Date(eventYear, eventMonth, eventDate, eventHours, eventMinutes)
        event["day"] = event.date.getDate()
        event["month"] = event.date.getMonth() + 1
        event["year"] = event.date.getFullYear()
    })
}

function pad(s) {
    let str = s
    if (typeof str !== 'string') str = str.toString()
    if (str.length < 2) str = '0' + str
    return str
}