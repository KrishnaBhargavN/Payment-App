const express = require("express");
const app = express();
const userRouter = require("./user");
const router = express.Router();
const cors = require("cors");
const accountRouter = require("./account");

app.use(cors());
router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;
