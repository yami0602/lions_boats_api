var express = require("express");
var morgan = require("morgan");

var app = express();

var boats = [];
var id = 0;

var updateId = function(req, res, next) {
  console.log(req.body);
  if (!req.body.id) {
    id++;
    req.body.id = id + "";
  }
  next();
};

// Global middleware
app.use(morgan("dev"));
app.use(express.static("client"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send(error);
  }
});

app.param("id", function(req, res, next, id) {
  var boat = boats.find(boat => boat.id == id);

  if (boat) {
    req.boat = boat;
    next();
  } else {
    res.send();
  }
});

//routes

// GET the entire boats collection
app.get("/boats", (req, res) => {
  res.json(boats);
});

//GET a boat record by its ID
app.get("/boats/:id", (req, res) => {
  var boat = req.boat;
  res.json(boat || {});
});

app.post("/boats", updateId, (req, res) => {
  var boat = req.body;
  boats.push(boat);
  res.json(boat);
});

app.put("/boats/:id", (req, res) => {
  var update = req.body;
  if (update.id) {
    delete update.id;
  }
  var boat = boats.findIndex(boat => boat.id == req.params.id);
  if (!boats[boat]) {
    res.send();
  } else {
    var updateBoat = Object.assign({}, boat[boat], update);
    res.json(updateBoat);
  }
});

app.delete("/boats/id:", (req, res) => {
  var boat = _.findIndex(boats, { id: req.params.id });
  if (!boats[boat]) {
    res.send();
  } else {
    var deletedBoat = boats[boat];
    boats.splice(boat, 1);
    res.json(deletedBoat);
  }
});

app.listen(3000, () => {
  console.log("Listening on Port 3000");
});
