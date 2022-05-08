const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) =>
      console.log("Could not connect to MongoDB...", error.message)
    );
};

module.exports = connect;
