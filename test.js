const { export2SVG } = require("./plotly2SVG");
var config = {
  toImageButtonOptions: {
    format: "png",
    filename: "grafico_IEF",
    height: 200,
    width: 1200,
    scale: 2,
  },
  modeBarButtonsToRemove: [
    "zoomIn2d",
    "zoomOut2d",
    "autoScale2d",
    "toggleSpikelines",
    "select2d",
    "lasso2d",
  ],
  showEditInChartStudio: false,
  displaylogo: false,
  responsive: true,
};
var data = [
  {
    y: [null, null, 0.89],
    x: ["apr.21", "sep.21", "Stressed"],
    type: "bar",
    visible: true,
    name: "Rates shock",
    marker: { color: "rgb(175,171,171)" },
  },
  {
    y: [null, null, 0.47],
    x: ["apr.21", "sep.21", "Stressed"],
    type: "bar",
    visible: true,
    name: "Inflationary shock",
    marker: { color: "rgb(59,56,56)" },
  },
  {
    y: [null, null, 0.43],
    x: ["apr.21", "sep.21", "Stressed"],
    type: "bar",
    visible: true,
    name: "Unemployment shock",
    marker: { color: "rgb(84,130,53)" },
  },
  {
    y: [null, null, 0],
    x: ["apr.21", "sep.21", "Stressed"],
    type: "bar",
    visible: true,
    name: "total",
    text: [null, null, "2,87"],
    hovertemplate: "<b>Total</b>:%{text}",
    hoverlabel: { namelength: 0 },
    marker: { color: "rgb(112,173,71)" },
    showlegend: false,
  },
];
var layout = {
  barmode: "stack",
  font: {
    family:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'",
    size: 14,
  },
  xaxis: {
    tickcolor: "rgba(33, 37, 41, 0.1)",
    gridcolor: "rgba(33, 37, 41, 0.1)",
    automargin: true,
    tickson: "boundaries",
    showdividers: true,
    ticklen: 15,
  },
  yaxis: {
    zerolinecolor: "rgb(33, 37, 41)",
    tickcolor: "rgba(33, 37, 41, 0.1)",
    gridcolor: "rgba(33, 37, 41, 0.1)",
    automargin: true,
  },
  legend: {
    orientation: "h",
    bgcolor: "rgba(0, 0, 0, 0)",
    x: 0,
    y: 1.1,
  },
  showlegend: true,
  plot_bgcolor: "rgb(255, 255, 255)",
  paper_bgcolor: "rgb(255, 255, 255)",
  margin: { l: 10, r: 10, b: 20, t: 10 },
};
export2SVG(data, layout, config, "gName2");
