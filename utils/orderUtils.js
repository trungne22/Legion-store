const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/orders.json");

function generateOrderId() {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `LEGION-${random}`;
}

function getVietnamTime() {
    return new Date().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh"
    });
}

function saveOrder(order) {
    const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    db.push(order);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 4));
}

module.exports = {
    generateOrderId,
    getVietnamTime,
    saveOrder
};
