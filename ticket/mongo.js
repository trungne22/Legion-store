const mongoose = require("mongoose");

async function connect() {
    if (!process.env.MONGO_URI) {
        console.log("❌ MONGO_URI không tồn tại trong .env!");
        return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected!");
}

module.exports = connect;
