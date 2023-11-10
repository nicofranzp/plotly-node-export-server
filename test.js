const { render } = require("./ssr");
// const { plot } = require("@mhkeller/plot");

// run the server
var test1 = {
  data: [
    {
      y: [1.19, 1.06, 1.06],
      x: ["apr.21", "sep.21", "Stressed"],
      type: "bar",
      visible: true,
      name: "Effective",
      marker: { color: "rgb(112,173,71)" },
    },
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
  ],
  layout: {
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
    margin: { l: 40, r: 20, b: 60, t: 20 },
  },
};
test1.layout.width = 400;
test1.layout.height = 400;
render(JSON.stringify(test1), "test.svg").then((a) => console.log(a));
