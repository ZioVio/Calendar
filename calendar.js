/*
@todo learn about importing modules.
In future i will create a separate inline calendar module
for node-telegram-bot-api

Currently building one
*/

/**
 * @param {Object} opts object for values
 * @param {String[]} opts.dayNames the sting array of days
 * @param {String[]} opts.monthNames the string array of monthes
 * @param {Number} opts.dayToStartWeek the number of day to start the week. 
 * By default is 0s
 */
function Calendar(opts) {
    this.opts = {
        dayNames: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], 
        monthNames: [
            "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ], 
        dayToStartWeek: 0 // Sunday
    }
    parseOpts(opts, this.opts)
    this.setOptions = function(opts) {parseOpts(opts, this.opts)}
    this.getOptions = function() {return this.opts}
    this.getMonth = getMonth
}

exports.Calendar = Calendar;

function parseOpts(opts, default_opts) {
    if (typeof opts === 'object') {
        if (opts.dayNames !== undefined) {
            if (Array.isArray(opts.dayNames)  && opts.dayNames.length == 7) {
                if (isAnArrayOfStrings(opts.dayNames)) {
                    default_opts.dayNames = opts.dayNames
                }
            }
        }
        if (opts.monthNames !== undefined) {
            if (Array.isArray(opts.monthNames) && opts.monthNames.length == 12) {
                if (isAnArrayOfStrings(opts.monthNames)) {
                    default_opts.monthNames = opts.monthNames
                }
            }
        }
        if (opts.dayToStartWeek !== undefined && typeof opts.dayToStartWeek === 'number') {
            default_opts.dayToStartWeek = opts.dayToStartWeek
        }
    }
}

function isAnArrayOfStrings(x) {
    return x.every(function(i){ return typeof i === "string" });
}

function alignDay(dayToStartWeek, day) {
    if (day < dayToStartWeek) {
        day = 7 - dayToStartWeek + day
    } else {
        day -= dayToStartWeek
    }
    return day
}
//@todo comments
function getMonth(year, month, dayToStartWeek = 0) {
    var weeks = []
    var date = new Date(year, month)
    var first_day = date.getDay()
    var iter_day = alignDay(dayToStartWeek, first_day)
    var day_counter = 1
    var week_in_month = true
    while (week_in_month) {
        week_in_month = false
        var week = new Array(7)
        for (;iter_day < 7; iter_day++) {
            date.setDate(day_counter)
            if (date.getMonth() == month && date.getFullYear() == year) {
                week_in_month = true
                week[iter_day] = day_counter++
            } else {
                break
            }
        }

        iter_day = 0
        if (week_in_month)
            weeks.push(week)
    }
    var month = {
        month: this.opts.monthNames[month], 
        days: this.opts.dayNames, 
        weeks_arr: weeks
    }
    return month
}

function getMonthMarkup(year, month) {
    var inline_keyboard = []
    var days_btns = []
    var month_btn = [{text: calendar.monthNames[month] + " " + year, callback_data: 0}]
    inline_keyboard.push(month_btn)
    calendar.dayNames.forEach(element => {
        days_btns.push({text: element, callback_data: 0})
    });
    inline_keyboard.push(days_btns)
    var date = new Date(year, month)
    var day = date.getDay()
    var array_of_days = new Array(5)
    for (var i = 0; i < 6; i++) {
        array_of_days[i] = new Array(7)
        for (let j = 0; j < 7; j++) {
            array_of_days[i][j] = {text: ' ', callback_data: 0}
        }
    }
    i = getDayNumFromMonday(day)
    let day_counter = 1
    array_of_days[0][i].text = '1'
    array_of_days.forEach(element => {
        var week_is_in_month = false
        for (;i < 7; i++) {
            date.setDate(day_counter)
            if (date.getMonth() == month) {
                week_is_in_month = true
                element[i].text = (day_counter).toString()
                element[i].callback_data = new Date(year, month, day_counter).toDateString()
                day_counter++
            }
        }

        i = 0
        if (week_is_in_month)
            inline_keyboard.push(element)
    })
    var new_right_year = Number(year)
    var new_left_year = new_right_year
    var new_right_month = Number(month) + 1
    if (new_right_month == 12) {
        new_right_month = 0
        new_right_year += 1
    }
    var new_left_month = (month - 1) < 0 ? 11 : month - 1
    if (new_left_month == 11) 
        new_left_year -= 1 
    var right_btn = {text: ">>>", callback_data: `${new_right_year}_${new_right_month}`}
    var left_btn =  {text: "<<<", callback_data: `${new_left_year}_${new_left_month}`}
    inline_keyboard.push([left_btn, right_btn])
    inline_keyboard.push([{text: 'Назад', callback_data: states.Изменить_дату}])
    var reply_markup = {}
    reply_markup.inline_keyboard = inline_keyboard
    return JSON.stringify(reply_markup)
}