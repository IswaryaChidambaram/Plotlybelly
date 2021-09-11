function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(participantId) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var samples = data.samples;

    var selectedSamples = samples.filter(sample => sample.id == participantId);

    var selectedSample = selectedSamples[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = selectedSample.otu_ids;
    var otuLabels = selectedSample.otu_labels;
    var sampleValues = selectedSample.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0, 10).map(otuId => "OTU " + otuId);

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValues.slice(0, 10),
      y: yticks,
      text: otuLabels.slice(0, 10),
      type: "bar",
      orientation: "h"
    }
    var barData = [
      trace
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "top 10 bacterial species",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID", categoryorder: "total ascending" }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      marker: {
        size: sampleValues,
        color: otuIds,
      },
      text: otuLabels,
      mode: "markers"
    }
    var bubbleData = [
      bubbleTrace
    ]
    var bubbleLayout = {
      title: "Bacterial Cultures Per Sample",
      xaxis: { title: "OTU ID" }
    }
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Take the metadata for the given participantID
    var matchingMedata = data.metadata.filter(item => item.id == participantId)
    var participantMetadata = matchingMedata[0];

    // 4. Create the trace for the gauge chart.
    var gaugeTrace = {
      value: participantMetadata.wfreq,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week" },
      gauge: {
        bar: { color: "black" },
        axis: { range: [0, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" }
        ],
      }
    };
    var gaugeData = [
      gaugeTrace
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
    }

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
