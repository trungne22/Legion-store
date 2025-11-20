const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/feedback.json");

function ensureDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
    }
}

function readDB() {
    ensureDB();
    return JSON.parse(fs.readFileSync(DB_PATH));
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function addFeedback(userId, content) {
    const db = readDB();
    const entry = {
        id: db.length + 1,
        userId,
        content,
        timestamp: new Date().toISOString()
    };
    db.push(entry);
    writeDB(db);
    return entry;
}

module.exports = { addFeedback, readDB };
