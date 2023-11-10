const puppeteer = require("puppeteer");

var exp = function (plotlyData, layout) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(`<html>
      <body>
      <span id="chart">&nbsp;</span>
      </body>
      </html>`);
      await page.addScriptTag({
        url: "https://code.jquery.com/jquery-3.2.1.min.js",
      });
      await page.addScriptTag({
        url: "https://cdn.plot.ly/plotly-1.58.4.min.js",
      });

      await page.exposeFunction("plotlyData", plotlyData);
      await page.exposeFunction("layout", layout);

      let image = await page.evaluate(
        function (plotlyData, layout) {
          // @ts-ignore
          const Plotly = window.Plotly;
          Plotly.newPlot("chart", plotlyData, layout);
          return Plotly.toImage("chart", {
            format: "svg",
            width: layout.width ? layout.width : 800,
            height: layout.height ? layout.height : 600,
          });
        },
        plotlyData,
        layout
      );

      await browser.close();
      return resolve(image.replace(/^data:image\/(png|jpg);base64,/, ""));
    } catch (e) {
      console.log("🚀 ~ file: index.js ~ line 13 ~ returnnewPromise ~ e", e);
      return reject(e);
    }
  });
};

module.exports = {
  exp,
};
