const http = require("http");
const fs = require("fs");
const replaceVal = (tempVal, orgVal) => {
  var temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  var temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  var temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  var temperature = temperature.replace("{%location%}", orgVal.name);
  var temperature = temperature.replace("{%country%}", orgVal.sys.country);
  var temperature = temperature.replace(
    "{%tempstatus%}",
    orgVal.weather[0].main
  );

  return temperature;
};

var requests = require("requests");
const homeFile = fs.readFileSync("views/index.html", "utf-8");
const server = http.createServer((req, res) => {
  if ((req.url = "/")) {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Ayodhya&appid=e513761e8f4a658b663dd138499aa0ba&units=metric"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        //   console.log(arrData[0].main.temp)
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
  }
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0");
