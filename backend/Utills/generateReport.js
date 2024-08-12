const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateReport(title, content) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const filePath = path.join(__dirname, '../reports/report.pdf'); 

        fs.mkdirSync(path.dirname(filePath), { recursive: true });

        const stream = fs.createWriteStream(filePath);

        const imagePath = path.join(__dirname, '../assets/logo.png');
        
        if (fs.existsSync(imagePath)) {
            const logoX = 50;
            const logoY = 20;
            doc.image(imagePath, logoX, logoY, { width: 100 });
        } else {
            console.log("Logo file not found:", imagePath);
        }

        const email = 'farmlink.org@gmail.com';
        const phoneNumber = '0761827545';

        const { width } = doc.page;
        const emailX = width -70- doc.widthOfString('Email: ' + email) - 20;
        const emailY = 40;

        doc.fontSize(12).text('Email: ' + email, emailX, emailY);

        const phoneNumberY = emailY + doc.currentLineHeight();
        doc.text('Phone: ' + phoneNumber, emailX, phoneNumberY);

        const marginTop = 30;
        doc.fontSize(20).font('Helvetica-Bold').text(title, 100, 150 + marginTop);

        const contentMarginTop = 30;
        doc.fontSize(12).font('Helvetica').text(content, 100, 200 + contentMarginTop);

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', reject);

        doc.pipe(stream);
    });
}

module.exports = generateReport;
