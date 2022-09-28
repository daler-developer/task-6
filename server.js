const express = require("express");
const cors = require("cors");
const { stringify } = require("csv-stringify/sync");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/csv", (req, res) => {
  const data = req.body.data;

  console.log(data);

  return res.json({
    csv: stringify(data),
  });
});

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  return res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 4000);
