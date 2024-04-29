const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://krishnabhargav:y1djvEjW6JqSwZMI@learning.3rluhuv.mongodb.net/paytm"
);

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0, required: true },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
  User,
  Account,
};
