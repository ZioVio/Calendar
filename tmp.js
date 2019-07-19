var C = require('./calendar')
var calendar = new C.Calendar()

// console.log(calendar)
console.log(calendar.getMonth(2019, 2))
calendar.setOptions({monthNames: [
    "я", "ф", "м", "а", "м", "и",
    "и", "а", "с", "о", "н", "д"
], })



console.log(calendar.getMonth(2019, 2, 5))
