// utils/orderManager.js
const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

function _read() {
    try {
        return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    } catch {
        return {};
    }
}
function _write(data) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    createOrUpdateOrder(orderId, payload) {
        const data = _read();
        if (!data[orderId]) data[orderId] = {};
        data[orderId] = { ...(data[orderId] || {}), ...payload };
        _write(data);
        return data[orderId];
    },
    getOrder(orderId) {
        const data = _read();
        return data[orderId] || null;
    },
    setStatus(orderId, status) { // status: Pending|Paid|Delivered
        const data = _read();
        if (!data[orderId]) data[orderId] = {};
        data[orderId].status = status;
        data[orderId].updatedAt = new Date().toISOString();
        _write(data);
        return data[orderId];
    },
    listAll() {
        return _read();
    }
};
