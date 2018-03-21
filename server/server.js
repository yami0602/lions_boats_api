var express = require("express");
var bodyParser = require("body-parser");
var _ = require("lodash");
var morgan = require("morgan");
var app = express();

const PORT = 3000;
var lions = [];
var id = 0;

var updateId = function(req, res, next) {
  if (!req.body.id) {
    id++;
    req.body.id = id + "";
  }

  next();
};

app.use(express.static("client"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.param("id", function(req, res, next, id) {
  var lion = _.find(lions, { id: id });

  if (lion) {
    req.lion = lion;
    next();
  } else {
    res.send();
  }
});

// routes
app.get("/lions", (req, res) => {
  res.json(lions);
});

app.post("/lions", updateId, (req, res) => {
  var lion = req.body;

  lion.id = id + "";

  lions.push(lion);

  res.json(lion);
});

app.get("/lions/:id", (req, res) => {
  var lion = _.find(lions, { id: req.params.id });
  res.json(lion || {});
});

app.post("/lions", (req, res) => {
  var lion = req.body;
  id++;
  lion.id = id + "";

  lions.push(lion);

  res.json(lion);
});

app.put("/lions:id", (req, res) => {
  var update = req.body;
  if (update.id) {
    delete update.id;
  }

  var lion = _.findIndex(lions, { id: req.params.id });
  if (!lions[lion]) {
    res.send();
  } else {
    var updateLion = _.assign(lions[lion], update);
    res.json(updateLion);
  }
});

app.delete("/lions/:id", (req, res) => {
  var lion = _.findIndex(lions, { id: req.param.id });
  if (!lions[lion]) {
    res.send();
  } else {
    var deletedLion = lions[lion];
    lions.splice(lion, 1);
    res.json(deletedLion);
  }
});

app.listen(PORT, () => {
  console.log(`on port ${PORT}`);
});
