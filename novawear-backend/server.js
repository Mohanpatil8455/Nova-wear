const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 IMPORT MODELS (VERY IMPORTANT PATHS)
const User = require("./models/User");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

const Contact = require("./models/Contact");


// 🔹 CONNECT TO MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/novawear")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* =========================
   AUTH APIs
   ========================= */

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  await User.create({ email, password });
  res.send("Registration successful");
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.send(user._id);
  else res.send("Invalid credentials");
});

/* =========================
   CART APIs
   ========================= */

// ADD TO CART
app.post("/cart/add", async (req, res) => {
  const cartItem = await Cart.create(req.body);
  res.json(cartItem);
});

// GET CART
app.get("/cart/:userId", async (req, res) => {
  const items = await Cart.find({ userId: req.params.userId });
  res.json(items);
});

// REMOVE ITEM
app.delete("/cart/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.send("Item removed");
});

/* =========================
   ORDER API
   ========================= */

// PLACE ORDER
app.post("/order", async (req, res) => {
  const order = await Order.create(req.body);
  await Cart.deleteMany({ userId: req.body.userId });
  res.json(order);
});

// 🔹 START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// SAVE CONTACT FORM DATA
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  await Contact.create({ name, email, message });
  res.send("Message saved successfully");
});

// REVIEW FORM

const Review = require("./models/Review");

// Save review
app.post("/review", async (req, res) => {
  await Review.create(req.body);
  res.send("Review saved");
});

// Get all reviews
app.get("/review", async (req, res) => {
  const reviews = await Review.find().sort({ date: -1 });
  res.json(reviews);
});
