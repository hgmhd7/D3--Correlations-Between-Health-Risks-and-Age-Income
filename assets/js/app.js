// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//////////////////////////////////////////////////////////////////////////////////////////

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

/////////////////////////////////////////////////////////////////////////////////////////

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
    d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}
// function used for updating x-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {

  // Create y scales
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d[chosenYAxis])])
    .range([height, 0]);

  return yLinearScale;

}

/////////////////////////////////////////////////////////////////////////////////

// function used for updating xAxis var upon click on axis label
function xRenderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function yRenderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

////////////////////////////////////////////////////////////////////////////////////


// function used for updating circles group with a transition to
// new circles
function xRenderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));


  return circlesGroup;
}
function yRenderCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////


// function used for updating circles group with a transition to
// new circles
function xRenderScatterText(textGroup, newXScale, chosenXAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));


  return textGroup;
}
function yRenderScatterText(textGroup, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]));

  return textGroup;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

  if (chosenXAxis === "poverty") {
    var label_1 = "In Poverty (%):";
  }
  else if (chosenXAxis === "age") {
    var label_1 = "Age (Median):";
  }
  else {
    var label_1 = "Income (Median):";
  }


  if (chosenYAxis === "healthcare") {
    var label_2 = "Lacks Healthcare (%):";
  }
  else if (chosenYAxis === "smokes") {
    var label_2 = "Smokes (%):";
  }
  else {
    var label_2 = "Obese (%):";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>${label_1} ${d[chosenXAxis]}<br>${label_2} ${d[chosenYAxis]}`);
    });

  textGroup.call(toolTip);

  textGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });



  return circlesGroup;
}

// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

//   if (chosenXAxis === "poverty") {
//     var label = "In Poverty (%):";
//   }
//   else {
//     var label = "Age (Median):";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }



//////////////////////////////////////////////////////////////////////////////////////////


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function (err, healthData) {
  if (err) throw err;

  // parse data
  healthData.forEach(function (data) {
    data.id = +data.id;
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });

  //////////////////////////////////////////////////////////////////////////////////////////

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);
  var yLinearScale = yScale(healthData, chosenYAxis);

  ///////////////////////////////////////////////////////////////////////////////////

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  ////////////////////////////////////////////////////////////////////////////////

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  /////////////////////////////////////////////////////////////////////////////////


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "#3399ff")
    .attr("opacity", ".5");

  var textGroup = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis] - .3))
    .style("fill", "black")
    .style("opacity", "1")
    .style("text-anchor", "middle")
    .style("font-size", "15")
    .text(d => d.abbr);



  // var textGroup = chartGroup.selectAll("text")
  // .data(healthData)
  // .enter()
  // .append("text")
  // .attr("dx", d => xLinearScale(d[chosenXAxis]))
  // .attr("dy", d => yLinearScale(d[chosenYAxis]))
  // .text(d => d.abbr)
  // .append("text")
  // .attr("fill", "black")
  // .attr("opacity", "1");

  // circlesGroup.append("text")
  // .attr("cx", d => xLinearScale(d[chosenXAxis]))
  // .attr("cy", d => yLinearScale(d[chosenYAxis]))
  //   .text(d => d.abbr)
  //   .classed("states");

  ///////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////

  // Create group for  2 x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (Median)");

  ////////////////////////////////////////////////////////////////////////////////////////////

  // Create group for 2 y- axis labels 
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("y", 0 - (margin.left - 40))
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .attr("dy", "1em")//  moves value slightly to the right???
    .classed("active", true)
    .text("Lacks Healthcare (%)");


  var smokesLabel = yLabelsGroup.append("text")
    .attr("y", 0 - (margin.left - 20))
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .attr("dy", "1em")//  moves value slightly to the right???
    .classed("inactive", true)
    .text("Smokes (%)");


  var obeseLabel = yLabelsGroup.append("text")
    .attr("y", 0 - (margin.left))
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity") // value to grab for event listener
    .attr("dy", "1em")//  moves value slightly to the right???
    .classed("inactive", true)
    .text("Obese (%)");

  console.log(circlesGroup)
  // console.log(chosenXAxis);
  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////



  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = xRenderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = xRenderCircles(circlesGroup, xLinearScale, chosenXAxis);
        

        //update the location of the state labels with new x values
        xRenderScatterText(textGroup, xLinearScale, chosenXAxis)


        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  /////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////

  // x axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates y axis with transition
        yAxis = yRenderAxes(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = yRenderCircles(circlesGroup, yLinearScale, chosenYAxis);

        //update the location of the state labels with new x values
        yRenderScatterText(textGroup, yLinearScale, chosenYAxis)

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

});



