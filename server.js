import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/test")


const Dish = mongoose.model("Dish", {
    id : Number,
    name: String,
    description: String,
    price: Number,
    allergens: [String]
})

// Create a dish
app.post("/dishes", (req, res) => {
    const dishToSave = new Dish(req.body)
    dishToSave.save().then((dish) => res.json(dish))
})

// Get all dishes
app.get("/dishes", (req, res) => {
    Dish.find().then((dishes) => res.json(dishes))
    .catch(() => res.status(404).end())
})

// Get a single dish
app.get("/dishes/:id", async(req, res) => {
    Dish.findById(req.params.id)
    .then((dish) => res.json(dish))
    .catch(() => res.status(404).end())
})

// Update one by ID
app.put("/dishes/:id", async(req, res) => {
    Dish.findByIdAndUpdate(req.params.id, req.body)
    .then((dish) => res.json(dish))
    .catch(() => res.status(404).end())
})

// Delete one by ID
app.delete("/dishes/:id", async(req, res) => {
    Dish.findByIdAndDelete(req.params.id)
    .then((dish) => res.json(dish))
    .catch(() => res.status(404).end())
})

app.get("*", (req, res) => {
    res.status(404).end()
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})    