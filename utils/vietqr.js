function createVietQR(amount, content) {
    const bank = "MOMO";
    const account = "0329523228";

    return `https://img.vietqr.io/image/${bank}-${account}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}`;
}

module.exports = { createVietQR };
