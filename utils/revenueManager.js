// utils/revenueManager.js
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const REVENUE_FILE = path.join(__dirname, '..', 'data', 'revenue.json');

function _read() {
    try {
        return JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8'));
    } catch {
        return { today: 0, month: 0, total: 0, updated: null };
    }
}

function _write(data) {
    fs.writeFileSync(REVENUE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    addRevenue(amount) {
        const raw = _read();
        const now = moment();
        const todayKey = now.format('YYYY-MM-DD');
        const monthKey = now.format('YYYY-MM');

        // Basic structure: store totals and last reset keys
        if (!raw.byDay) raw.byDay = {};
        if (!raw.byMonth) raw.byMonth = {};

        // add to day
        raw.byDay[todayKey] = (raw.byDay[todayKey] || 0) + amount;
        // add to month
        raw.byMonth[monthKey] = (raw.byMonth[monthKey] || 0) + amount;
        // totals
        raw.total = (raw.total || 0) + amount;
        raw.today = raw.byDay[todayKey];
        raw.month = raw.byMonth[monthKey];
        raw.updated = now.toISOString();

        _write(raw);
        return raw;
    },
    getRevenue() {
        return _read();
    }
};
