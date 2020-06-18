/**
 * Objet fournissant des fonctions pour formater correctement des données selon les règles locales (canadien-anglais).
 */
var localization = (function(d3) {
  "use strict";

  var self = {};
  var englishLocale = {
    "decimal": ",",
    "thousands": "",
    "grouping": [3],
    "currency": ["$", ""],
    "dateTime": "%a %b %e %X %Y",
    "date": "%d/%m/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    "months": ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "shortMonths": ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"]
  };
  var customTimeFormat = [
    [".%L", function(d) { return d.getMilliseconds(); }],
    [":%S", function(d) { return d.getSeconds(); }],
    ["%I:%M", function(d) { return d.getMinutes(); }],
    ["%I %p", function(d) { return d.getHours(); }],
    ["%d %b", function(d) { return d.getDate() !== 1; }],
    ["%B", function(d) { return d.getMonth(); }],
    ["%Y", function() { return true; }]
  ];
  var locale = d3.timeFormatDefaultLocale(englishLocale);

  /**
   * Obtient les règles locales.
   *
   * @return object   Un objet contenant les règles.
   */
  self.getLocale = function() {
    return locale;
  };

  /**
   * Formate une date selon les règles locales.
   *
   * @param date    L'objet date à formater.
   * @return {*}    La date formatée.
   */
  self.getFormattedDate = function(date) {
    return locale.format(customTimeFormat.find(function(format) {
      return format[1](date)
    })[0])(date);
  };

  return self;
})(d3);
