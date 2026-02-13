import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantPhone: string;
  customerName?: string;
  tableNumber?: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  paymentMethod: string;
}

export function generateInvoicePDF(data: InvoiceData): void {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.restaurantName, 105, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.restaurantAddress, 105, 22, { align: 'center' });
  doc.text(`Phone: ${data.restaurantPhone}`, 105, 28, { align: 'center' });
  
  // Invoice Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${data.invoiceNumber}`, 20, 65);
  doc.text(`Date: ${data.date}`, 20, 72);
  
  if (data.customerName) {
    doc.text(`Customer: ${data.customerName}`, 20, 79);
  }
  
  if (data.tableNumber) {
    doc.text(`Table: ${data.tableNumber}`, 150, 65);
  }
  
  // Items Table
  autoTable(doc, {
    startY: 90,
    head: [['Item', 'Qty', 'Price', 'Amount']],
    body: data.items.map(item => [
      item.name,
      item.quantity.toString(),
      `₹${item.price.toFixed(2)}`,
      `₹${item.amount.toFixed(2)}`
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
    },
  });
  
  // Get final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Totals
  const rightAlign = 190;
  const labelX = rightAlign - 60;
  let currentY = finalY;
  
  doc.setFontSize(10);
  doc.text('Subtotal:', labelX, currentY);
  doc.text(`₹${data.subtotal.toFixed(2)}`, rightAlign, currentY, { align: 'right' });
  
  currentY += 7;
  doc.text(`Tax (${((data.tax / data.subtotal) * 100).toFixed(0)}%):`, labelX, currentY);
  doc.text(`₹${data.tax.toFixed(2)}`, rightAlign, currentY, { align: 'right' });
  
  if (data.tip && data.tip > 0) {
    currentY += 7;
    doc.text('Tip:', labelX, currentY);
    doc.text(`₹${data.tip.toFixed(2)}`, rightAlign, currentY, { align: 'right' });
  }
  
  // Total with background
  currentY += 10;
  doc.setFillColor(0, 128, 0);
  doc.rect(labelX - 5, currentY - 6, 75, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', labelX, currentY);
  doc.text(`₹${data.total.toFixed(2)}`, rightAlign, currentY, { align: 'right' });
  
  // Payment Method
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  currentY += 15;
  doc.text(`Payment Method: ${data.paymentMethod}`, labelX, currentY);
  
  // Footer
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 270, 210, 27, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.setFontSize(8);
  doc.text('This is a computer generated invoice', 105, 287, { align: 'center' });
  
  // Save
  doc.save(`invoice-${data.invoiceNumber}.pdf`);
}

export function previewInvoice(data: InvoiceData): string {
  const doc = new jsPDF();
  
  // Same generation logic as above
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.restaurantName, 105, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.restaurantAddress, 105, 22, { align: 'center' });
  doc.text(`Phone: ${data.restaurantPhone}`, 105, 28, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${data.invoiceNumber}`, 20, 65);
  doc.text(`Date: ${data.date}`, 20, 72);
  
  if (data.customerName) {
    doc.text(`Customer: ${data.customerName}`, 20, 79);
  }
  if (data.tableNumber) {
    doc.text(`Table: ${data.tableNumber}`, 150, 65);
  }
  
  autoTable(doc, {
    startY: 90,
    head: [['Item', 'Qty', 'Price', 'Amount']],
    body: data.items.map(item => [
      item.name,
      item.quantity.toString(),
      `₹${item.price.toFixed(2)}`,
      `₹${item.amount.toFixed(2)}`
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
    },
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const rightAlign = 190;
  const labelX = rightAlign - 60;
  let currentY = finalY;
  
  doc.setFontSize(10);
  doc.text('Subtotal:', labelX, currentY);
  doc.text(`₹${data.subtotal.toFixed(2)}`, rightAlign, currentY, { align: 'right' });
  currentY += 7;
  doc.text(`Tax (${((data.tax / data.subtotal) * 100).toFixed(0)}%):`, labelX, currentY);
  doc.text(`₹${data.tax.toFixed(2)}`, rightAlign, currentY, { align: 'right' });
  
  if (data.tip && data.tip > 0) {
    currentY += 7;
    doc.text('Tip:', labelX, currentY);
    doc.text(`₹${data.tip.toFixed(2)}`, rightAlign, currentY, { align: 'right' });
  }
  
  currentY += 10;
  doc.setFillColor(0, 128, 0);
  doc.rect(labelX - 5, currentY - 6, 75, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', labelX, currentY);
  doc.text(`₹${data.total.toFixed(2)}`, rightAlign, currentY, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  currentY += 15;
  doc.text(`Payment Method: ${data.paymentMethod}`, labelX, currentY);
  
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 270, 210, 27, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.setFontSize(8);
  doc.text('This is a computer generated invoice', 105, 287, { align: 'center' });
  
  // Return base64 data URL for preview
  return doc.output('dataurlstring');
}
