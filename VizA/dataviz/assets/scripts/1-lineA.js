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
    var parser = d3.timeParse("%d/%m/%y")

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
   * @return Array
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
   * Précise le domaine des échelles utilisées par la graphique "Contrib"  pour l'axe X.
   *
   * @param xContrib      Échelle en X utilisée avec le graphique "Contrib".
   * @param data        Données provenant du fichier CSV.
   */
  function domainX(xContrib, data) {
    // TODO: Préciser les domaines pour la variable "xContrib" pour l'axe X.
    xContrib.domain(d3.extent(data, function (d) {
      return d.Date;
    }));
  }

  /**
   * Précise le domaine des échelles utilisées par la graphique "Contrib"  pour l'axe Y.
   *
   * @param yContrib      Échelle en Y utilisée avec le graphique "Contrib".
   * @param sources     Données triées par nom de Framework et par date (voir fonction "createSources").
   */
  function domainY(yContrib, sources) {
    // TODO: Préciser les domaines pour la variable "yContrib" pour l'axe Y.
    yContrib.domain([
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
  }

/**
 * Fichier permettant de dessiner la graphique "Contrib".
 */


/**
 * Crée une ligne SVG en utilisant les domaines X et Y spécifiés.
 * Cette fonction est utilisée par la graphique "Contrib".
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
   * Crée le graphique Contrib.
   *
   * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
   * @param sources   Les données à utiliser.
   * @param line      La fonction permettant de dessiner les lignes du graphique.
   * @param color     L'échelle de couleurs ayant une couleur associée à un nom de Framework.
   */
  function createContribLineChart(g, sources, line, color) {
    // TODO: Dessiner le graphique Contrib dans le groupe "g".
    // Pour chacun des "path" que vous allez dessiner, spécifier l'attribut suivant: .attr("clip-path", "url(#clip)").
    var ContribLineGroups = g.append("g")
      .attr("class", "Contrib")
      .selectAll("g")
      .data(sources)
      .enter()
      .append("g");



    ContribLineGroups.append("path")
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
        return "Contrib" + d.name;
      });

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
    var pathContrib = "#Contrib" + element.attr("value");
    if (element.attr("fill") === "white") {
      element.attr("fill", function () {
        return color(element.attr("value"))
      });
      d3.select(pathContrib).style("opacity", 1);
    } else {
      element.attr("fill", "white");
      d3.select(pathContrib).style("opacity", 0);
    }
  }


  //*******Graphique principal (Contrib)
  var marginContrib = {
    top: 5,
    right: 50,
    bottom: 150,
    left: 50
  };
  var widthContrib = 980 - marginContrib.left - marginContrib.right;
  var heightContrib = 550 - marginContrib.top - marginContrib.bottom;



  /***** Échelles *****/
  var xContrib = d3.scaleTime().range([0, widthContrib]);
  var yContrib = d3.scaleLinear().range([heightContrib, 0]);

  var xAxisContrib = d3.axisBottom(xContrib).tickFormat(localization.getFormattedDate);
  var yAxisContrib = d3.axisLeft(yContrib);


  /***** Création des éléments *****/
  var svg = d3.select("#lineA-svg")
    .attr("width", widthContrib + marginContrib.left + marginContrib.right)
    .attr("height", heightContrib + marginContrib.top + marginContrib.bottom);

  // Groupe affichant le graphique principal (Contrib).
  var Contrib = svg.append("g")
    .attr("transform", "translate(" + marginContrib.left + "," + marginContrib.top + ")");



  // Ajout d'un plan de découpage.
  svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", widthContrib)
    .attr("height", heightContrib);

  // Fonctions pour dessiner les lignes
  var lineContrib = createLine(xContrib, yContrib);


  /***** Chargement des données *****/
  d3.csv("./data/Contributors.csv").then(function(data) {
    /***** Prétraitement des données *****/
    var color = d3.scaleOrdinal(d3.schemeCategory10)
    domainColor(color, data);
    parseDate(data);

    var sources = createSources(color, data);
    domainX(xContrib, data);
    domainY(yContrib, sources);

    /***** Création du graphique Contrib *****/
    createContribLineChart(Contrib, sources, lineContrib, color);

    // Axes Contrib
    Contrib.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + heightContrib + ")")
      .call(xAxisContrib);

      Contrib.append("g")
      .attr("class", "y axis")
      .call(yAxisContrib);

      Contrib.append("text")
        .attr("y", heightContrib + 60)
        .attr("x", widthContrib/2)
        .style("text-anchor", "middle")
        .style("font-size",20)
        .text("Date")


      Contrib.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", + widthContrib * 0.025)
        .attr("x", - heightContrib * 0.2)
        .style("text-anchor", "middle")
        .style("font-size",20)
        .text("No. of Contributors");

    /***** Création de la légende *****/
    legend(svg, sources, color);
  });
