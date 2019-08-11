// Set the plot dementions
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

// Carve out the specific areat to aoply the scatter plot
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {

  // Create scales
  if (chosenXAxis === "poverty") {
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d[chosenXAxis] + 2.5)])
      .range([0, width]);
  }
  else if (chosenXAxis === "age") {
    var xLinearScale = d3.scaleLinear()
      .domain([29.5, d3.max(healthData, d => d[chosenXAxis] + 1.9)])
      .range([0, width]);
  }
  else {
    var xLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(healthData, d => d[chosenXAxis] + 6029)])
      .range([0, width]);
  }


  return xLinearScale;

}


// Function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {

  // Create y scales
  if (chosenYAxis === "obesity") {
    var yLinearScale = d3.scaleLinear()
      .domain([20, d3.max(healthData, d => d[chosenYAxis] + 2.1)])
      .range([height, 0]);
  }
  else if (chosenYAxis === "smokes") {
    var yLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d[chosenYAxis] + 1.3)])
      .range([height, 0]);
  }
  else {
    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(healthData, d => d[chosenYAxis] + 1.1)])
      .range([height, 0]);
  }

  return yLinearScale;

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function used for updating xAxis var upon click on axis label
function xRenderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// Function used for updating yAxis var upon click on axis label
function yRenderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Function used for updating circles group with a transition to
// new circles on x-axis change
function xRenderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));


  return circlesGroup;
}


// Function used for updating circles group with a transition to
// new circles on y-axis change
function yRenderCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Function used for updating the state abbreviation text group with a transition to
// new circles on x-axis change
function xRenderScatterText(textGroup, newXScale, chosenXAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));


  return textGroup;
}


// Function used for updating the state abbreviation text group with a transition to
// new circles on y-axis change
function yRenderScatterText(textGroup, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis] - 0.25));

  return textGroup;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function used for updating the state abbreviation text group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

  if (chosenXAxis === "poverty") {
    var label_1 = "In Poverty (%): ";
  }
  else if (chosenXAxis === "age") {
    var label_1 = "Age (Median): ";
  }
  else {
    var label_1 = "Income (Median): ";
  }


  if (chosenYAxis === "healthcare") {
    var label_2 = "Lacks Healthcare (%): ";
  }
  else if (chosenYAxis === "smokes") {
    var label_2 = "Smokes (%): ";
  }
  else {
    var label_2 = "Obese (%): ";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-9, 0])
    .html(function (d) {
      return (`${d.state}<br>${label_1}  ${d[chosenXAxis]}<br>${label_2}  ${d[chosenYAxis]}`);
    });

  textGroup.call(toolTip);

  textGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // Onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });



  return circlesGroup;
}


//*******A DIFFERENT METHOD I WAS PLAYING AROUND WITH.  LEAVING IT IN CODE FOR FUTURE REFERENCE *********//

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



//////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Create xLinearScale and yLinearScale data
  var xLinearScale = xScale(healthData, chosenXAxis);
  var yLinearScale = yScale(healthData, chosenYAxis);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // Append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 11)
    // .attr("fill", "#3399ff")// Other colors I was trying
    // .attr("fill", "#cc99ff")// Other colors I was trying
    .attr("fill", "#66b2ff")
    .attr("opacity", ".5");


  // Append initial state abbreviation text to circles
  var textGroup = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis] - 0.25))
    .style("fill", "black")
    .style("opacity", "1")
    .style("text-anchor", "middle")
    .style("font-size", "11")
    .style("font-weight", "bold")
    .text(d => d.abbr);


  //*******A DIFFERENT METHOD I WAS PLAYING AROUND WITH.  LEAVING IT IN CODE FOR FUTURE REFERENCE *********//

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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Create group for the 3 x-axis labels
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Create group for the 3 y-axis labels
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


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////


  // x-axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function () {
      // Get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // Replaces chosenXAxis with value
        chosenXAxis = value;

        // DEBUGGER TO CHECK VALUES
        // console.log(chosenXAxis)

        // Functions here found above csv import
        // Updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // Updates x axis with transition
        xAxis = xRenderAxes(xLinearScale, xAxis);

        // Updates circles with new x values
        circlesGroup = xRenderCircles(circlesGroup, xLinearScale, chosenXAxis);


        // Update the location of the state labels with new x values
        xRenderScatterText(textGroup, xLinearScale, chosenXAxis)


        // Updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

        // Changes classes to change bold text
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // y-axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function () {
      // Get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // Replaces chosen YAxis with value
        chosenYAxis = value;

        // DEBUGGER TO CHECK VALUES
        // console.log(chosenYAxis)

        // Functions here found above csv import
        // Updates y scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // Updates y axis with transition
        yAxis = yRenderAxes(yLinearScale, yAxis);

        // Updates circles with new y values
        circlesGroup = yRenderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // Update the location of the state labels with new x values
        yRenderScatterText(textGroup, yLinearScale, chosenYAxis)

        // Updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

        // Changes classes to change bold text
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


