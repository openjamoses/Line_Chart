"use strict";


/**
 * Précise le domaine en associant un nom de Framework à une couleur précise.
 *
 * @param color   
 * @param data    
 */
function domainColor(color, data) {
  // TODO: Définir le domaine de la variable "color" en associant un nom de Framework à une couleur.
  color.domain(d3.keys(data[0]).filter(function (key) {
    return key !== "Date";
  }));
}

/**
 * Convertit les dates se trouvant dans le fichier CSV en objet de type Date.
 *
 * @param data    Données provenant du fichier CSV.
 * @see https://www.w3schools.com/jsref/jsref_obj_date.asp
 */
function parseDate(data) {
  // TODO: Convertir les dates du fichier CSV en objet de type Date.
  var parser = d3.timeParse("%d/%m/%y");

  data.forEach(function (d) {
    d.Date = parser(d.Date);
  });
}

/**
 * Trie les données par nom de Framework puis par date.
 *
 * @param color     Échelle de couleurs (son domaine contient les noms de Frameworks).
 * @param data      Données provenant du fichier CSV.
 *
 * @return Array    Les données triées qui seront utilisées pour générer les graphiques.
 *                  L'élément retourné doit être un tableau d'objets comptant 10 entrées, une pour chaque rue
 *                  et une pour la moyenne. L'objet retourné doit être de la forme suivante:
 *
 *                  [
 *                    {
 *                      name: string      // Le nom de la rue,
 *                      values: [         // Le tableau compte 365 entrées, pour les 365 jours de l'année.
 *                        date: Date,     // La date du jour.
 *                        count: number   // Le nombre de vélos compté ce jour là (effectuer une conversion avec parseInt)
 *                      ]
 *                    },
 *                     ...
 *                  ]
 */
function createSources(color, data) {
  // TODO: Retourner l'objet ayant le format demandé.
  return color.domain().map(function (name) {
    return {
      name: name,
      values: data.map(function (d) {
        return {
          date: d.Date,
          count: +d[name]
        };
      })
    };
  });
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe X.
 *
 * @param xFocus      Échelle en X utilisée avec le graphique "focus".
 * @param xContext    Échelle en X utilisée avec le graphique "contexte".
 * @param data        Données provenant du fichier CSV.
 */
function domainX(xFocus, xContext, data) {
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  xFocus.domain(d3.extent(data, function (d) {
    return d.Date;
  }));
  xContext.domain(xFocus.domain());
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe Y.
 *
 * @param yFocus      Échelle en Y utilisée avec le graphique "focus".
 * @param yContext    Échelle en Y utilisée avec le graphique "contexte".
 * @param sources     Données triées par nom de rue et par date (voir fonction "createSources").
 */
function domainY(yFocus, yContext, sources) {
  // TODO: Préciser les domaines pour les variables "yFocus" et "yContext" pour l'axe Y.
  yFocus.domain([
    d3.min(sources, function (c) {
      return d3.min(c.values, function (v) {
        return v.count;
      });
    }),
    d3.max(sources, function (c) {
      return d3.max(c.values, function (v) {
        return v.count;
      });
    })
  ]);

  yContext.domain(yFocus.domain());
}


/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */


/**
 * Crée une ligne SVG en utilisant les domaines X et Y spécifiés.
 * Cette fonction est utilisée par les graphiques "focus" et "contexte".
 *
 * @param x               Le domaine X.
 * @param y               Le domaine Y.
 * @return d3.svg.line    Une ligne SVG.

 */
function createLine(x, y) {
  return d3.line()
    .defined(function (d) {
      return !isNaN(d.count);
    })
    .x(function (d) {
      return x(d.date)
    })
    .y(function (d) {
      return y(d.count)
    })
    .curve(d3.curveBasisOpen);
}

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de Framework.
 */
function createFocusLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique focus dans le groupe "g".
  // Pour chacun des "path" que vous allez dessiner, spécifier l'attribut suivant: .attr("clip-path", "url(#clip)").
  var focusLineGroups = g.append("g")
    .attr("class", "focus")
    .selectAll("g")
    .data(sources)
    .enter()
    .append("g");
     


  focusLineGroups.append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(d.values);
    })
    .style("stroke", function (d) {
      return color(d.name);
    })
    .attr("clip-path", "url(#clip)")
    .style("stroke", function (d) {
      return color(d.name);
    })
    .style("stroke-width", function (d) {
      return 1;
    })
    .attr("value", function (d) {
      return d.name
    }).attr("id", function (d) {
      return "focus" + d.name;
    });
 
}

/**
 * Crée le graphique contexte.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createContextLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique contexte dans le groupe "g".
  var contextLineGroups = g.append("g")
    .attr("class", "context")
    .selectAll("g")
    .data(sources)
    .enter().append("g");

  contextLineGroups.append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(d.values);
    })
    .attr("clip-path", "url(#clip)")

    .style("stroke", function (d) {
      return color(d.name);
    })
    .style("stroke-width", function (d) {
      return 1;
    })
    .attr("id", function (d) {
      return "context" + d.name;
    });
 

}

/**
 * Permet de redessiner le graphique focus à partir de la zone sélectionnée dans le graphique contexte.
 *
 * @param brush     La zone de sélection dans le graphique contexte.
 * @param g         Le groupe SVG dans lequel le graphique focus est dessiné.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param xFocus    L'échelle en X pour le graphique focus.
 * @param xContext  L'échelle en X pour le graphique contexte.
 * @param xAxis     L'axe X pour le graphique focus.
 * @param yAxis     L'axe Y pour le graphique focus.
 *
 * @see http://bl.ocks.org/IPWright83/08ae9e22a41b7e64e090cae4aba79ef9       (en d3 v3)
 * @see https://bl.ocks.org/mbostock/34f08d5e11952a80609169b7917d4172    ==> (en d3 v5) <==
 */
function brushUpdate(brush, g, line, xFocus, xContext, xAxis, yAxis) {
  // TODO: Redessiner le graphique focus en fonction de la zone sélectionnée dans le graphique contexte.
  xFocus.domain(d3.event.selection === null ? xContext.domain() : d3.event.selection.map(xContext.invert));
  g.selectAll("path.line").attr("d", function (d) {
    return line(d.values)
  });
  g.select(".x.axis").call(xAxis);
  g.select(".y.axis").call(yAxis);
}


/**
 * Fichier permettant de générer la légende et de gérer les interactions de celle-ci.
 */


/**
 * Crée une légende à partir de la source.
 *
 * @param svg       L'élément SVG à utiliser pour créer la légende.
 * @param sources   Données triées par nom de Framework et par date.
 * @param color     Échelle de 10 couleurs.
 */
function legend(svg, sources, color) {
  // TODO: Créer la légende accompagnant le graphique.
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(70,30)")
    .style("font-size", "12px");

  // Affiche un carré de la même couleur que la ligne qui lui correspond
  legend.selectAll("rect")
    .data(sources)
    .enter()
    .append("rect")
    .attr("fill", function (d) {
      return color(d.name);
    })
    .attr("stroke", "black")
    .attr("width", 15)
    .attr("height", 15)
    .attr("x", 20)

    .attr("y", function (d, i) {
      return  i * 30;
    })
    .attr("value", function (d) {
      return d.name;
    })
    .on("click", function() {
      displayLine(d3.select(this), color);
    });

  // Affiche un texte à droite du carré de couleur pour lier le nom de la Framework à une couleur
  legend.selectAll("text")
    .data(sources).enter()
    .append("text")
    .attr("y", function (d, i) {
      return 12 + i * 32;
    })
    .attr("x", 40)
    .style("font-size",15)
    .text(function (d) {
      return d.name;
    });

}

/**
 * Permet d'afficher ou non la ligne correspondant au carré qui a été cliqué.
 *
 * En cliquant sur un carré, on fait disparaitre/réapparaitre la ligne correspondant et l'intérieur du carré
 * devient blanc/redevient de la couleur d'origine.
 *
 * @param element   Le carré qui a été cliqué.
 * @param color     Échelle de 10 couleurs.
 */
function displayLine(element, color) {
  // TODO: Compléter le code pour faire afficher ou disparaître une ligne en fonction de l'élément cliqué.
  var pathContext = "#context" + element.attr("value");
  var pathFocus = "#focus" + element.attr("value");
  if (element.attr("fill") === "white") {
    element.attr("fill", function () {
      return color(element.attr("value"))
    });
    d3.select(pathContext).style("opacity", 1);
    d3.select(pathFocus).style("opacity", 1);
  } else {
    element.attr("fill", "white");
    d3.select(pathContext).style("opacity", 0);
    d3.select(pathFocus).style("opacity", 0);
  }
}




//*******Graphique principal (focus)
var marginFocus = {
  top: 5,
  right: 50,
  bottom: 150,
  left: 50
};
var widthFocus = 980 - marginFocus.left - marginFocus.right;
var heightFocus = 550 - marginFocus.top - marginFocus.bottom;

// Graphique secondaire qui permet de choisir l'échelle de la visualisation (contexte)
var marginContext = {
  top: 430,
  right: 50,
  bottom: 30,
  left: 50
};
var widthContext = widthFocus;
var heightContext = 550 - marginContext.top - marginContext.bottom;

/***** Échelles *****/
var xFocus = d3.scaleTime().range([0, widthFocus]);
var yFocus = d3.scaleLinear().range([heightFocus, 0]);

var xContext = d3.scaleTime().range([0, widthContext]);
var yContext = d3.scaleLinear().range([heightContext, 0]);

var xAxisFocus = d3.axisBottom(xFocus).tickFormat(localization.getFormattedDate);
var yAxisFocus = d3.axisLeft(yFocus);

var xAxisContext = d3.axisBottom(xContext).tickFormat(localization.getFormattedDate);

/***** Création des éléments *****/
var svg = d3.select("#lineB-svg")
  .attr("width", widthFocus + marginFocus.left + marginFocus.right)
  .attr("height", heightFocus + marginFocus.top + marginFocus.bottom);

// Groupe affichant le graphique principal (focus).
var focus = svg.append("g")
  .attr("transform", "translate(" + marginFocus.left + "," + marginFocus.top + ")");

// Groupe affichant le graphique secondaire (contexte).
var context = svg.append("g")
  .attr("transform", "translate(" + marginContext.left + "," + marginContext.top + ")");

// Ajout d'un plan de découpage.
svg.append("defs")
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", widthFocus)
  .attr("height", heightFocus);

// Fonctions pour dessiner les lignes
var lineFocus = createLine(xFocus, yFocus);
var lineContext = createLine(xContext, yContext);

// Permet de redessiner le graphique principal lorsque le zoom/brush est modifié.
var brush = d3.brushX()
  .extent([[0, 0], [widthContext, heightContext]])
  .on("brush", function () {
    brushUpdate(brush, focus, lineFocus, xFocus, xContext, xAxisFocus, yAxisFocus);
  });

/***** Chargement des données *****/
d3.csv("./data/Commits.csv").then(function(data) {
  /***** Prétraitement des données *****/
  var color = d3.scaleOrdinal(d3.schemeCategory10)
  domainColor(color, data);
  parseDate(data);

  var sources = createSources(color, data);
  domainX(xFocus, xContext, data);
  domainY(yFocus, yContext, sources);

  /***** Création du graphique focus *****/
  createFocusLineChart(focus, sources, lineFocus, color);

  // Axes focus
  focus.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightFocus + ")")
    .call(xAxisFocus);
    
    focus.append("g")
    .attr("class", "y axis")
    .call(yAxisFocus);

    focus.append("text")             
      .attr("y", heightFocus + 5)
      .attr("x", widthFocus  + 30)
      .style("text-anchor", "middle")
      .style("font-size",20)
      .text("Date")

    
    focus.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", + widthFocus * 0.025)
      .attr("x", - heightFocus * 0.2)
      .style("text-anchor", "middle")
      .style("font-size",20)
      .text("No. of Commits")

  
  /***** Création du graphique contexte *****/
  createContextLineChart(context, sources, lineContext, color);

  // Axes contexte
  context.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightContext + ")")
    .call(xAxisContext);
    

  context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", -6)
    .attr("height", heightContext + 7);
 
 

  /***** Création de la légende *****/
  legend(svg, sources, color);
});



