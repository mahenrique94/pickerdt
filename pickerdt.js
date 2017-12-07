const DATEPICKER_NAME = "datePicker";
const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const checkInative = (date, today) => (parseInt(date.substring(3, 5)) - 1) == (today.getMonth()) ? "" : "is-inactive";
const datePickerClear = action => insertDateInInput(getFor(action), "");
const datePickerDate = day => insertDateInInput(getFor(day), day.dataset.date);
const datePickerPrevious = previous => insertDatePicker(newDateFrom(previous.dataset.month), findTarget(previous));
const datePickerNext = next => insertDatePicker(newDateFrom(next.dataset.month), findTarget(next));
const datePickerToday = action => insertDateInInput(getFor(action), new Date().toLocaleDateString("pt-br"));
const elementIsInput = element => element.tagName.toLowerCase() === "input";
const findTarget = element => document.querySelector(`#${element.dataset.target || element.dataset.for}`);
const getFor = day => document.querySelector(`#${getForName(day)}`);
const getMonth = date => months[date.getMonth()];
const hasElement = element => element;
const insertDatePicker = (date, element) => document.body.appendChild(newDatePicker(template(date, buildCalendar(date), element)));
const isDatePicker = day => day.classList.contains(`js-${DATEPICKER_NAME}`);
const newDateFrom = value => new Date(parseInt(value.substring(6, 10)), parseInt(value.substring(3, 5)) - 1, parseInt(value.substring(0, 2)));
const setDateAsFirstDay = date => date.setDate(date.getDate() - (date.getDate() - 1));
const setDateAsFirstDayOfCalendar = date => date.setDate((date.getDay() - 1) * -1);

function buildCalendar(date) {
    const calendar = [];    
    const dateToCalendar = new Date(date);
    
    configDate(dateToCalendar);
    for (let i = 0; i < 6; i++) {
      let calendarDays = [];
      for (let j = 0; j < 7; j++) {
        let days = [];
        days[0] = dateToCalendar.getDate();
        days[1] = dateToCalendar.toLocaleDateString("pt-br");
        calendarDays[j] = days;
        dateToCalendar.setDate(dateToCalendar.getDate() + 1);
      }
      calendar[i] = calendarDays;
    }

    return calendar;
}

function checkDate(element) {
    const target = elementIsInput(element) ? element : findTarget(element);
    if (hasElement(target)) {
        if (element.value)
            return newDateFrom(element.value);
    }
    return new Date();
}

function closeDatePicker() {
    const background = document.querySelector(".js-datePickerBackground");
    const datePicker = document.querySelector(".js-datePicker");
    if (hasElement(background) && hasElement(datePicker))
        background.parentNode.remove();
}

function configDate(date) {
    setDateAsFirstDay(date);
    setDateAsFirstDayOfCalendar(date);  
  }

function datePicker(element) {
    const date = checkDate(element)
    insertDatePicker(date, element);
}

function getForName(day) {
  if (isDatePicker(day))
    return day.dataset.for;
  return getForName(day.parentNode);
}

function insertDateInInput(input, date) {
  if (hasElement(input))
    input.value = date;
  closeDatePicker();
}

function newDatePicker(template) {
    const datePicker = document.createElement("div");
    datePicker.innerHTML = template;
    return datePicker;
}

function template(date, calendar, element) {
    const previousMonth = new Date(date.getFullYear(), (date.getMonth() - 1), 1);
    const nextMonth = new Date(date.getFullYear(), (date.getMonth() + 1), 1);

    return `
    <div class="dp-datePicker--background js-datePickerBackground" onclick="closeDatePicker();">
        <span class="dp-datePicker__icon">X</span>
        <div class="dp-datePicker js-datePicker" data-for="${element.dataset.target}">
            <table class="dp-calendar">
            <caption class="dp-controls">
                <div class="dp-controls__info">
                <span class="dp-controls__info___title">${getMonth(date)}</span>
                <div class="dp-controls__info___detail">
                    <span class="dp-controls__info___dayOfMonth">${date.getDate()}</span>
                    <div class="dp-controls__info___detailGroup">
                    <span class="dp-controls__info___month">${getMonth(date).substring(0, 3)}</span>
                    <span class="dp-controls__info___year">${date.getFullYear()}</span>
                    </div>
                </div>
                </div>
                <div class="dp-controls__wrap">
                <span class="dp-controls__previous js-previous" data-for="${element.dataset.target}" data-month="${previousMonth.toLocaleDateString("pt-br")}" onclick="datePickerPrevious(this);">&lt;</span>
                <div class="dp-controls__date">
                    <span class="dp-controls__month js-month">${getMonth(date)}</span>
                    <span class="dp-controls__year js-year">${date.getFullYear()}</span>
                </div>
                <span class="dp-controls__next js-next" data-for="${element.dataset.target}" data-month="${nextMonth.toLocaleDateString("pt-br")}" onclick="datePickerNext(this);">&gt;</span>
                </div>
            </caption>
            <thead class="dp-header">
                <tr class="dp-weekDays">
                <th class="dp-weekDays__name is-weekend">Dom</th>
                <th class="dp-weekDays__name">Seg</th>
                <th class="dp-weekDays__name">Ter</th>
                <th class="dp-weekDays__name">Qua</th>
                <th class="dp-weekDays__name">Qui</th>
                <th class="dp-weekDays__name">Sex</th>
                <th class="dp-weekDays__name is-weekend">Sab</th>
                </tr>
            </thead>
            <tbody class="dp-days">
                <tr class="dp-days__week">
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[0][0][1], date)}" data-date="${calendar[0][0][1]}" onclick="datePickerDate(this);">${calendar[0][0][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[0][1][1], date)}" data-date="${calendar[0][1][1]}" onclick="datePickerDate(this);">${calendar[0][1][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[0][2][1], date)}" data-date="${calendar[0][2][1]}" onclick="datePickerDate(this);">${calendar[0][2][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[0][3][1], date)}" data-date="${calendar[0][3][1]}" onclick="datePickerDate(this);">${calendar[0][3][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[0][4][1], date)}" data-date="${calendar[0][4][1]}" onclick="datePickerDate(this);">${calendar[0][4][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[0][5][1], date)}" data-date="${calendar[0][5][1]}" onclick="datePickerDate(this);">${calendar[0][5][0]}</td>
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[0][6][1], date)}" data-date="${calendar[0][6][1]}" onclick="datePickerDate(this);">${calendar[0][6][0]}</td>
                </tr>
                <tr class="dp-days__week">
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[1][0][1], date)}" data-date="${calendar[1][0][1]}" onclick="datePickerDate(this);">${calendar[1][0][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[1][1][1], date)}" data-date="${calendar[1][1][1]}" onclick="datePickerDate(this);">${calendar[1][1][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[1][2][1], date)}" data-date="${calendar[1][2][1]}" onclick="datePickerDate(this);">${calendar[1][2][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[1][3][1], date)}" data-date="${calendar[1][3][1]}" onclick="datePickerDate(this);">${calendar[1][3][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[1][4][1], date)}" data-date="${calendar[1][4][1]}" onclick="datePickerDate(this);">${calendar[1][4][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[1][5][1], date)}" data-date="${calendar[1][5][1]}" onclick="datePickerDate(this);">${calendar[1][5][0]}</td>
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[1][6][1], date)}" data-date="${calendar[1][6][1]}" onclick="datePickerDate(this);">${calendar[1][6][0]}</td>
                </tr>
                <tr class="dp-days__week">
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[2][0][1], date)}" data-date="${calendar[2][0][1]}" onclick="datePickerDate(this);">${calendar[2][0][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[2][1][1], date)}" data-date="${calendar[2][1][1]}" onclick="datePickerDate(this);">${calendar[2][1][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[2][2][1], date)}" data-date="${calendar[2][2][1]}" onclick="datePickerDate(this);">${calendar[2][2][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[2][3][1], date)}" data-date="${calendar[2][3][1]}" onclick="datePickerDate(this);">${calendar[2][3][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[2][4][1], date)}" data-date="${calendar[2][4][1]}" onclick="datePickerDate(this);">${calendar[2][4][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[2][5][1], date)}" data-date="${calendar[2][5][1]}" onclick="datePickerDate(this);">${calendar[2][5][0]}</td>
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[2][6][1], date)}" data-date="${calendar[2][6][1]}" onclick="datePickerDate(this);">${calendar[2][6][0]}</td>
                </tr>
                <tr class="dp-days__week">
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[3][0][1], date)}" data-date="${calendar[3][0][1]}" onclick="datePickerDate(this);">${calendar[3][0][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[3][1][1], date)}" data-date="${calendar[3][1][1]}" onclick="datePickerDate(this);">${calendar[3][1][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[3][2][1], date)}" data-date="${calendar[3][2][1]}" onclick="datePickerDate(this);">${calendar[3][2][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[3][3][1], date)}" data-date="${calendar[3][3][1]}" onclick="datePickerDate(this);">${calendar[3][3][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[3][4][1], date)}" data-date="${calendar[3][4][1]}" onclick="datePickerDate(this);">${calendar[3][4][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[3][5][1], date)}" data-date="${calendar[3][5][1]}" onclick="datePickerDate(this);">${calendar[3][5][0]}</td>
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[3][6][1], date)}" data-date="${calendar[3][6][1]}" onclick="datePickerDate(this);">${calendar[3][6][0]}</td>
                </tr>
                <tr class="dp-days__week">
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[4][0][1], date)}" data-date="${calendar[4][0][1]}" onclick="datePickerDate(this);">${calendar[4][0][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[4][1][1], date)}" data-date="${calendar[4][1][1]}" onclick="datePickerDate(this);">${calendar[4][1][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[4][2][1], date)}" data-date="${calendar[4][2][1]}" onclick="datePickerDate(this);">${calendar[4][2][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[4][3][1], date)}" data-date="${calendar[4][3][1]}" onclick="datePickerDate(this);">${calendar[4][3][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[4][4][1], date)}" data-date="${calendar[4][4][1]}" onclick="datePickerDate(this);">${calendar[4][4][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[4][5][1], date)}" data-date="${calendar[4][5][1]}" onclick="datePickerDate(this);">${calendar[4][5][0]}</td>
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[4][6][1], date)}" data-date="${calendar[4][6][1]}" onclick="datePickerDate(this);">${calendar[4][6][0]}</td>
                </tr>
                <tr class="dp-days__week">
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[5][0][1], date)}" data-date="${calendar[5][0][1]}" onclick="datePickerDate(this);">${calendar[5][0][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[5][1][1], date)}" data-date="${calendar[5][1][1]}" onclick="datePickerDate(this);">${calendar[5][1][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[5][2][1], date)}" data-date="${calendar[5][2][1]}" onclick="datePickerDate(this);">${calendar[5][2][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[5][3][1], date)}" data-date="${calendar[5][3][1]}" onclick="datePickerDate(this);">${calendar[5][3][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[5][4][1], date)}" data-date="${calendar[5][4][1]}" onclick="datePickerDate(this);">${calendar[5][4][0]}</td>
                <td class="dp-days__week___day js-day ${checkInative(calendar[5][5][1], date)}" data-date="${calendar[5][5][1]}" onclick="datePickerDate(this);">${calendar[5][5][0]}</td>
                <td class="dp-days__week___day is-weekend js-day ${checkInative(calendar[5][6][1], date)}" data-date="${calendar[5][6][1]}" onclick="datePickerDate(this);">${calendar[5][6][0]}</td>
                </tr>
            </tbody>
            <tfoot class="dp-actions">
                <tr>
                <td colspan="7">
                    <div class="dp-actions__wrap">
                    <button class="dp-actions__action js-today" onclick="datePickerToday(this);" type="button">Hoje</button>
                    <button class="dp-actions__action js-clear" onclick="datePickerClear(this);" type="button">Limpar</button>
                    </div>
                </td>
                </tr>
            </tfoot>
            </table>
        </div>
    </div>`
}