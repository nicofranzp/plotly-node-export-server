const puppeteer = require("puppeteer");
const fs = require("fs-extra");

var exp = function (plotlyData, layout, config) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
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
        url: "https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.27.1/plotly.min.js",
      });
      // await page.exposeFunction("plotlyData", plotlyData);
      // await page.exposeFunction("layout", layout);
      // await page.exposeFunction("config", config);
      let image = await page.evaluate(
        function (plotlyData, layout, config) {
          // @ts-ignore
          const Plotly = window.Plotly;
          return Plotly.toImage(
            { data: plotlyData, layout: layout, config: config },
            { format: "svg", imageDataOnly: true, height: 400, width: 400 }
          );
        },
        plotlyData,
        layout,
        config
      );
      await browser.close();
      return resolve(image);
    } catch (e) {
      console.log("🚀 ~ file: index.js ~ line 13 ~ returnnewPromise ~ e", e);
      return reject(e);
    }
  });
};

function export2SVG(data, layout, config, plotname) {
  return new Promise(async (resolve, reject) => {
    let imageBuffer = await exp(data, layout, config);
    await fs.writeFile(plotname + ".svg", imageBuffer);
  });
}

module.exports = {
  export2SVG,
};
