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
  var prev = $('.prev');
  var next = $('.next');

  var darkMode = $('.btn-dark');
  var lightMode = $('.btn-light');
  var body = $('body');

  darkMode.click(function(){
    body.removeClass('light-background');
    body.addClass('dark-background');
    $('.month-days li').removeClass('month-days_light-background');
    $('.month-days li').addClass('month-days_dark-background');
  });

  lightMode.click(function(){
    body.removeClass('dark-background');
    body.addClass('light-background');
    $('.month-days li').removeClass('month-days_dark-background');
    $('.month-days li').addClass('month-days_light-background');
  });

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

  // Al click dell'icona viene visualizzato il mese precedente
  prev.click(function(){
    // invoco funzione che stampa il mese precedente
    printPreviousMonth();
  });

  // Al click dell'icona viene visualizzato il mese successivo
  next.click(function(){
    // invoco funzione che stampa il mese successivo
    printFollowingMonth();
  });

  // Navigazione con tastiera
  $(document).keyup(function(event){
    // tasto destra
    if ( event.which == 37 || event.keyCode == 37 ) {
      // invoco funzione che stampa il mese precedente
      printPreviousMonth();
    }
    // tasto sinistra
    else if ( event.which == 39 || event.keyCode == 39 ) {
      // invoco funzione che stampa il mese successivo
      printFollowingMonth();
    }
  });


  /**************
  * FUNZIONI  
  **************/
  // Funzione che stampa a schermo i giorni del mese
  function printMonthDays(data){
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
  function printHolidays(date){
    // Referenza API
    var myAPI = 'https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0'
    // chiamo API
    $.ajax({
      url: myAPI,
      method: 'GET',
      data: {
        year: date.year(),
        month: date.month()
      },
      success: function(result){
        var holidays = result.response;
        // ciclo per stampare le festività
        for ( var i = 0; i < holidays.length; i++) {
          // oggetti di holidays
          var thisHoliday = holidays[i];
          // assegno data attribute ai li
          var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');
          // se è una festività assegno la classe .holiday e stampo
          if ( listItem ) {
            listItem.addClass('holiday');
            listItem.text( listItem.text() + ' - ' + thisHoliday.name );
          }
        }
      },
      error: function(){
        console.log('Errore');
      }
    });
  };

  // Funzione che stampa il mese precedente
  function printPreviousMonth(){
    // validazione per non andare oltre
    if ( baseMonth.month() == 0 ) {
      alert('Non puoi tornare indietro nel tempo!');
    }
    else {
      // torno indietro di un mese, lo visualizzo e nascondo gli altri
      baseMonth.subtract(1, 'M');
      monthDays.children().remove();
      // funzione con la quale stampo i giorni
      printMonthDays(baseMonth);
      // funzione con la quale stampo le festività
      printHolidays(baseMonth);
    }
  };

  // Funzione che stampa il mese successivo
  function printFollowingMonth(){
    // validazione per non andare oltre
    if ( baseMonth.month() == 11 ) {
      alert('Non puoi viaggiare nel futuro!');
    }
    else {
      // vado avanti di un mese, lo visualizzo e nascondo gli altri
      baseMonth.add(1, 'M');
      monthDays.children().remove();
      // funzione con la quale stampo i giorni
      printMonthDays(baseMonth);
      // funzione con la quale stampo le festività
      printHolidays(baseMonth);
    }
  };

});