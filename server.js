import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/test")

const dishSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    allergens: [String]
})

const Dish = mongoose.model("Dish", dishSchema)

const Cart = mongoose.model("Cart", {
    dishes: [dishSchema]
})


const Choice = mongoose.model("Choice", {
    address: {
        street: String,
        city: String,
        zip: Number
    },
    dishes: [dishSchema]
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

// Create a cart
app.post("/cart", (req, res) => {
    const cartToSave = new Cart(req.body)
    cartToSave.save().then((cart) => res.json(cart))
})

// Get the cart
app.get("/cart", (req, res) => {
    Cart.find().then((cart) => res.json(cart))
    .catch(() => res.status(404).end())
})

// Add a dish to the cart
app.post("/cart/:id", async(req, res) => {
    const dish = await Dish.findById(req.params.id)
    const cart = await Cart.find()
    cart[0].dishes.push(dish)
    cart[0].save().then((cart) => res.json(cart))
})

// Remove a dish from the cart
app.delete("/cart/:id", async(req, res) => {
    const cart = await Cart.find()
    cart[0].dishes = cart[0].dishes.filter((dish) => dish._id != req.params.id)
    cart[0].save().then((cart) => res.json(cart))
})

// Create a choice
app.post("/choice", (req, res) => {
    const choiceToSave = new Choice(req.body)
    choiceToSave.save().then((choice) => res.json(choice))
})

// Get all choices (for admin)
app.get("/choice", (req, res) => {
    Choice.find().then((choice) => res.json(choice))
    .catch(() => res.status(404).end())
})

// Get a single choice
app.get("/choice/:id", async(req, res) => {
    Choice.findById(req.params.id)
    .then((choice) => res.json(choice))
    .catch(() => res.status(404).end())
})

// Add a dish by id to the choice by id, verify that the dish is in the cart
app.post("/choice/:id/:dishId", async(req, res) => {
    const dish = await Dish.findById(req.params.dishId)
    const choice = await Choice.findById(req.params.id)
    const cart = await Cart.find()
    if (cart[0].dishes.some((dish) => dish._id == req.params.dishId)) {
        console.log("dish is in cart")
        choice.dishes.push(dish)
        choice.save().then((choice) => res.json(choice))
    } else {
        console.log("dish not in cart")
        res.status(404).end()
    }
})


// Remove a dish by id from the choice by id
app.delete("choice/:id/:dish", async(req, res) => {
    const choice = await Choice.findById(req.params.id)
    choice.dishes = choice.dishes.filter((dish) => dish._id != req.params.dish)
    choice.save().then((choice) => res.json(choice))
})


// Delete one by ID
app.delete("/choice/:id", async(req, res) => {
    Choice.findByIdAndDelete(req.params.id)
    .then((choice) => res.json(choice))
    .catch(() => res.status(404).end())
})

app.get("*", (req, res) => {
    res.status(404).end()
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})