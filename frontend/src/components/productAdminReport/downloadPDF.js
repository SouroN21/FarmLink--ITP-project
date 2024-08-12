import { jsPDF } from "jspdf";
import logo from "../../assets/logo.png";

const downloadPdf = (vegiQuantity, fruitQuantity, inventoryValue, totalRevenue, outOfStock) => {
    const doc = new jsPDF();
    // Add the company logo
    doc.addImage(logo, "JPEG", 160, 10, 30, 30);

    // Header information (Company Contact)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(60, 80, 60); // Dark green color
    doc.text("FarmLink.Org", 10, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Email: FarmLink.Org@outlook.com", 10, 20);
    doc.text("Phone: 0761827545", 10, 30);

    // Report Title
    doc.setFontSize(14);
    doc.setTextColor(100, 150, 100); // Theme color
    doc.text("Product Admin Report", 10, 45);

    let y = 55; // Start content below the header
    doc.setFontSize(12);
    doc.setTextColor(0);

    // Section for vegetable quantity
    doc.text(`Total Vegetable Quantity: ${vegiQuantity}`, 10, y);
    y += 10;

    // Section for fruit quantity
    doc.text(`Total Fruit Quantity: ${fruitQuantity}`, 10, y);
    y += 10;

    // Section for inventory value
    doc.text(`Inventory Value: $${inventoryValue.toFixed(2)}`, 10, y);
    y += 10;

    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 10, y);
    y += 10;
    // Adding a section header for out of stock products
    doc.setFillColor(232, 232, 232); // Grey background for section header
    doc.setTextColor(200, 0, 0); // Red color for text
    doc.rect(10, y, 190, 8, "F"); // Draw rectangle with fill
    y += 6;
    doc.text("Out of Stock Products:", 12, y);

    // List out of stock products
    outOfStock.forEach((product) => {
      y += 10;
      doc.setTextColor(0);
      doc.text(`- ${product.name}`, 15, y);
    });

    // Final call to download the PDF
    doc.save("ProductAdminReport.pdf");
};

export default downloadPdf;
