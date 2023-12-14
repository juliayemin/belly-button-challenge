const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
  d3.json(url).then(data => {
      var names = data.names;

      var dropdownMenu = d3.select("#selDataset");
      names.forEach((sample) => {
          dropdownMenu.append("option")
                      .text(sample)
                      .property("value", sample);
      });

      var firstSample = names[0];
      updateCharts(firstSample);
      updateMetadata(firstSample);
      updateBubbleChart(firstSample);
      updateGaugeChart(firstSample);
  });
}

function updateCharts(sample) {
  d3.json(url).then(data => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;

      // Bar Chart
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [{
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
      }];

      var barLayout = {
          title: "Top 10 Bacteria Cultures Found",
          margin: { t: 30, l: 150 }
      };

      Plotly.newPlot("bar", barData, barLayout);
  });
}

function updateBubbleChart(sample) {
  d3.json(url).then(data => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;

      // A Bubble Chart
      var bubbleLayout = {
          title: "Bacteria Cultures Per Sample",
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" }
      };
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          }
      }];

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

function updateMetadata(sample) {
    d3.json(url).then(data => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var PANEL = d3.select("#sample-metadata");

        // Clear any existing data
        PANEL.html("");

        // Add each key-value pair to the panel
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function updateGaugeChart(sample) {
    d3.json(url).then(data => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var gaugeData = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: result.wfreq,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              axis: { range: [null, 9] },
              steps: [
                { range: [0, 3], color: "lightgreen" },
                { range: [3, 6], color: "yellow" },
                { range: [6, 9], color: "red" }
              ]
            }
          }
        ];

        var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
}

d3.selectAll("#selDataset").on("change", handleChange);

function handleChange() {
    var newSample = d3.select(this).property("value");
    updateCharts(newSample);
    updateMetadata(newSample);
    updateBubbleChart(newSample);
    updateGaugeChart(newSample);
}

init();
