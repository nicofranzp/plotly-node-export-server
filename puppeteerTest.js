const puppeteer = require("puppeteer");

var exp = function (plotlyData, layout) {
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

      await page.exposeFunction("plotlyData", plotlyData);
      await page.exposeFunction("layout", layout);

      let image = await page.evaluate(
        function (plotlyData, layout) {
          // @ts-ignore
          const Plotly = window.Plotly;
          return Plotly.toImage(
            { data: plotlyData, layout: layout },
            { format: "svg", imageDataOnly: true }
          );
        },
        plotlyData,
        layout
      );

      await browser.close();
      return resolve(image);
    } catch (e) {
      console.log("🚀 ~ file: index.js ~ line 13 ~ returnnewPromise ~ e", e);
      return reject(e);
    }
  });
};

module.exports = {
  exp,
};
