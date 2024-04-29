const express = require("express");
const cors = require("cors");
const app = express();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = require("../config").JWT_SECRET;
const auth = require("./middleware");
const { Account } = require("../db");
app.use(cors());
router.post("/signup", async (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;

  const check = await User.findOne({
    username,
  });
  if (check) {
    return res.status(400).json({
      message: "Username already exists",
    });
  }

  const userSchema = zod.object({
    username: zod.string(),
    first_name: zod.string(),
    last_name: zod.string(),
    email: zod.string(),
    password: zod.string(),
  });

  const user = userSchema.parse(req.body);
  console.log(user);
  const newUser = await User.create(user);
  const userId = newUser._id;
  const account = await Account.create({
    userId,
    balance: 1 + Math.floor(Math.random() * 1000),
  });
  const token = jwt.sign({ username: newUser._id }, JWT_SECRET);
  res.status(201).json({
    message: "User created successfully",
    token,
  });
});

router.put("/update", auth.authMiddleware, async (req, res) => {
  const { first_name, last_name, password } = req.body;
  const userSchema = zod.object({
    first_name: zod.string(),
    last_name: zod.string(),
    password: zod.string(),
  });
  try {
    const user = userSchema.parse(req.body);
    console.log(req.userId);
    const updatedUser = await User.updateOne({ _id: req.userId }, req.body);
    res.status(200).json({
      message: "Updated successfully",
      updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error while updating information",
      error: err.errors,
    });
  }
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      { first_name: { $regex: filter } },
      { last_name: { $regex: filter } },
    ],
  });
  res.status(200).json({
    users,
  });
});

module.exports = router;
