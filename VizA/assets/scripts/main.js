/** Main
 */
(function(d3, localization) {
  "use strict";

  /***** tabs *****/
  var tabs = d3.selectAll(".tabs li");
  tabs.on("click", function (d, i) {
    var self = this;
    var index = i;
    tabs.classed("active", function () {
      return self === this;
    });
    d3.selectAll(".tabs .tab")
      .classed("visible", function (d, i) {
        return index === i;
      });
  });



})(d3, localization);
