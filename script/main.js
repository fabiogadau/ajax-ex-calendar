/*
* CALENDAR
Creare un calendario dinamico con le festività. 
Partiamo dal gennaio 2018 dando la possibilità di cambiare mese, gestendo il caso in cui l’API non possa ritornare festività. 
Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
Ogni volta che cambio mese dovrò:
Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018).
Controllare quanti giorni ha il mese scelto formando così una lista.
Chiedere all’api quali sono le festività per il mese scelto.
Evidenziare le festività nella lista.
*/

$(document).ready(function() {

  // Referenze
  var monthName = $('.month');
  var monthDays = $('.month-days');

  // Init Handlebars
  var source = $('#day-template').html();
  var template = Handlebars.compile(source);

  // Punto di partenza del calendario
  var baseMonth = moment('2018-01-01');
  console.log(baseMonth.daysInMonth());

  // Invoco funzione che stampa i giorni del mese
  printMonthDays(baseMonth);
  // Invoco funzione che stampa le festività del mese
  printHolidays(baseMonth);


  /**************
  * FUNZIONI  
  **************/
  // Funzione che stampa a schermo i giorni del mese
  function printMonthDays(data) {
    // numero di giorni del mese
    var daysInMonth = data.daysInMonth();
    // imposto il nome del mese
    monthName.html( data.format('MMMM - YYYY') );
    // imposta data-attribute data visualizzata
    monthName.attr( 'data-this-date', data.format('YYYY-MM-DD') );
    // genero giorni del mese
    for ( var i = 0; i < daysInMonth; i++ ) {
      var thisDate = moment({
        year: data.year(),
        month: data.month(),
        day: i+1
      });
      // imposto dati del template
      var monthDay = {
        dayClass: 'day',
        completeDate: thisDate.format('YYYY-MM-DD'),
        day: thisDate.format('DD dddd')
      };
      // compilo il template e aggiungo al markup
      var dayToPrint = template(monthDay);
      monthDays.append(dayToPrint);
      console.log(dayToPrint);
    };
  };

  // Funzione che stampa le festività del mese
  function printHolidays(date) {
    var myAPI = 'https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0'
    // chiamo API
    $.ajax({
      url: myAPI,
      method: 'GET',
      data: {
        year: date.year(),
        month: date.month()
      },
      success: function(result) {
        var holidays = result.response;

        for ( var i = 0; i < holidays.length; i++) {
          var thisHoliday = holidays[i];

          var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

          if ( listItem ) {
            listItem.addClass('holiday');
            listItem.text( listItem.text() + ' - ' + thisHoliday.name );
          }
        }
      },
      error: function() {
        console.log('Errore');
      }
    });
  };

});