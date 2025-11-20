// utils/generateInvoice.js
// Generates a PDF invoice using pdfkit.
// Save to /invoices/{orderId}.pdf and return path.

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const LOGO_PATH = '/mnt/data/e65fa7d4-f873-4449-a9f3-1e038b61d606.png'; // your uploaded logo
const OUT_DIR = path.join(__dirname, '..', 'invoices');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function formatCurrency(v) {
    return (Number(v) || 0).toLocaleString('vi-VN') + ' VNĐ';
}

module.exports = async function generateInvoice({
    orderId,
    customerName,
    service,
    amount,
    notes,
    createdBy
}) {
    return new Promise((resolve, reject) => {
        try {
            const filename = `${orderId.replace(/[^\w-]/g, '_')}.pdf`;
            const outPath = path.join(OUT_DIR, filename);
            const doc = new PDFDocument({ size: 'A4', margin: 50 });

            const stream = fs.createWriteStream(outPath);
            doc.pipe(stream);

            // Header - logo + title
            if (fs.existsSync(LOGO_PATH)) {
                try {
                    doc.image(LOGO_PATH, 50, 45, { width: 90 });
                } catch (e) {
                    // ignore if image fail
                }
            }

            doc
                .fontSize(20)
                .text('HÓA ĐƠN THANH TOÁN', 160, 50, { align: 'right' });

            doc.moveDown(2);

            // Invoice meta
            doc.fontSize(10).text(`Mã hoá đơn: ${orderId}`, { align: 'left' });
            doc.text(`Ngày: ${new Date().toLocaleString('vi-VN')}`, { align: 'left' });
            doc.text(`Xác nhận bởi: ${createdBy}`, { align: 'left' });

            doc.moveDown();

            // Customer
            doc.fontSize(12).text(`Khách hàng: ${customerName}`);
            doc.text(`Dịch vụ: ${service}`);
            doc.text(`Giá tiền: ${formatCurrency(amount)}`);
            doc.moveDown();

            doc.fontSize(10).text('Ghi chú:', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(9).text(notes || 'Không có', { width: 470 });

            // Footer
            doc.moveDown(4);
            doc.fontSize(10).text('Cảm ơn bạn đã sử dụng dịch vụ!', { align: 'center' });

            doc.end();

            stream.on('finish', () => resolve(outPath));
            stream.on('error', reject);
        } catch (err) {
            reject(err);
        }
    });
};
