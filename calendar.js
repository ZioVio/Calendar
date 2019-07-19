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

function getMonth(year, month, dayToStartWeek = 0) {
    var weeks = []
    var date = new Date(year, month)
    var first_day = date.getDay()
    var iter_day = alignDay(dayToStartWeek, first_day) // to alighn calendar to your start week day
    var day_counter = 1
    var week_in_month = true
    while (week_in_month) {
        week_in_month = false
        var week = new Array(7).fill(0)
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
        days: this.opts.dayNames, // is not shifted with dayToStartWeek. Watch it yourself 
        calendar: weeks
    }
    return month
}
