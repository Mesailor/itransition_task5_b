const express = require("express");
const app = express();
const port = 3002;
const dataGenerator = require("./services/dataGenerator");

app.use(express.json());

app.get("/:region-:seed-:page-:errorNum-:quantity", (req, res) => {
  const usersFakeData = dataGenerator.generate(req.params);
  res
    .status(200)
    .set("Access-Control-Allow-Origin", "http://localhost:3000")
    .send(usersFakeData);
});

app.get("/change-errors/:region-:seed-:page-:errorNum", (req, res) => {
  let { region, seed, page, errorNum } = req.params;
  let usersFakeData = dataGenerator.generate({
    region,
    seed,
    page: 0,
    errorNum,
    quantity: 20,
  });

  for (let i = 1; i <= page; i++) {
    let banch = dataGenerator.generate({
      region,
      seed,
      page: i,
      errorNum,
      quantity: 10,
    });
    usersFakeData = usersFakeData.concat(banch);
  }

  res
    .status(200)
    .set("Access-Control-Allow-Origin", "http://localhost:3000")
    .send(usersFakeData);
});

app.listen(port, () => {
  console.log("Listen on port ", port);
});
