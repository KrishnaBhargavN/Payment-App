const express = require("express");
const app = express();
const router = express.Router();
const auth = require("./middleware");
const { Account } = require("../db");
const cors = require("cors");
app.use(cors());
app.use(express.json());

router.get("/balance", auth.authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });
    res.status(200).json({
      balance: account.balance,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error",
      error: err.message,
    });
  }
});

router.post("/transfer", auth.authMiddleware, async (req, res) => {
  const session = await Account.startSession();
  session.startTransaction();
  const { to, amount } = req.body;
  try {
    const account = await Account.findOne({ userId: req.userId });
    const toAccount = await Account.findOne({ userId: to });
    if (!toAccount) {
      session.abortTransaction();
      return res.status(400).json({
        message: "Invalid user",
      });
    }
    if (Number(account.balance) < Number(amount)) {
      session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }
    await Account.updateOne(
      { userId: req.userId },
      { balance: Number(account.balance) - Number(amount) }
    );
    await Account.updateOne(
      { userId: to },
      { balance: Number(toAccount.balance) + Number(amount) }
    );
    res.status(200).json({
      message: "Transfer successful",
    });
    session.commitTransaction();
  } catch (err) {
    session.abortTransaction();
    res.status(400).json({
      message: "Error",
      error: err.message,
    });
  }
});

module.exports = router;
