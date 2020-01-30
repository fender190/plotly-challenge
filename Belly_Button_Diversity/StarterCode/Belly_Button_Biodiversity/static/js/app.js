function buildMetadata(sample) {
  // Instructions
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  // get metasample data, loop trough Object entries and append to meta-data box


  // get metasample data, loop trough Object entries and append to meta-data box
  var urlmeta = `/metadata/${sample}`;
  var meta = d3.select("#sample-metadata")

  d3.json(urlmeta).then(data => {
    console.log(data);
    meta.html("");
    Object.entries(data).forEach(([key,value])=>{
      var para = meta.append("p")
      para.text(`${key}: ${value}`)
    });
    })
  };


function buildCharts(sample) {

  // Instructions
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  
    
    var url = `/samples/${sample}`;

    d3.json(url).then(data => {
      console.log(data);
      // slice first 10 values for pie chart
      var top_ids = data.otu_ids.slice(0,10);
      var top_labels = data.otu_labels.slice(0,10);
      var top_values = data.sample_values.slice(0,10);
      console.log(top_ids, top_labels, top_values);
      //plot pie chart
      var trace = {
        labels: top_ids,
        values: top_values,
        type: "pie",
        name: "otu_ids",
        hovertext: top_labels
        };
      var layout = {title: "Top 10 Samples"};
      var data1 = [trace];
      Plotly.newPlot("pie",data1,layout);
      //plot bubble chart    
      var trace2 = {
        x: data.otu_ids,
        y: data.sample_values,
        mode: "markers",
        marker: { size: data.sample_values,
        color: data.otu_ids},
        hovertext: data.otu_labels
      };
      var layout2 = {title:"Sample Values by ID"};
      var data2 = [trace2];
      Plotly.newPlot("bubble",data2,layout2);
    });

    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
