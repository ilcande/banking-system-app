import { CreateTransactionParams } from '../interfaces/transactions/CreateTransactionParams';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateStatementPdfService(accountId: number, _userId: number, transactions: CreateTransactionParams[], month: number, year: number): Promise<string> {
  const statementsDir = path.join(__dirname, '../../statements');
  const pdfPath = path.join(statementsDir, `statement_${accountId}_${month}_${year}.pdf`);

  // Ensure the statements directory exists
  if (!fs.existsSync(statementsDir)) {
    fs.mkdirSync(statementsDir, { recursive: true });
  }

  // Create the PDF document
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Create a write stream for the PDF file
  const stream = fs.createWriteStream(pdfPath);
  doc.pipe(stream);

  // Add header content to the PDF
  doc.fontSize(20).text(`Statement for account ${accountId}`, { align: 'center' });
  doc.fontSize(14).text(`For the month of ${month}/${year}`, { align: 'center' });
  doc.moveDown();
  
  // Set the font size smaller for table content
  doc.fontSize(10);

  // Define column widths and starting x positions
  const colWidths = { id: 100, type: 100, amount: 100, date: 150, targetId: 100 };
  const startX = 50;
  const headerY = doc.y;

  // Add table headers with precise positioning
  doc.font('Helvetica-Bold');
  doc.text('Transaction ID', startX, headerY);
  doc.text('Type', startX + colWidths.id, headerY);
  doc.text('Amount', startX + colWidths.id + colWidths.type, headerY);
  doc.text('Date', startX + colWidths.id + colWidths.type + colWidths.amount, headerY);
  doc.text('Target Account ID', startX + colWidths.id + colWidths.type + colWidths.amount + colWidths.date, headerY);
  doc.moveDown();
  
  // Draw a line under the headers
  doc.moveTo(startX, doc.y).lineTo(startX + colWidths.id + colWidths.type + colWidths.amount + colWidths.date + colWidths.targetId, doc.y).stroke();
  doc.moveDown();

  // Reset font for transaction rows
  doc.font('Helvetica');

  // Add transaction rows with consistent x-coordinates
  transactions.forEach((transaction) => {
    const y = doc.y; // Get current y position

    doc.text(transaction.transaction_id ? transaction.transaction_id.toString() : 'N/A', startX, y);
    doc.text(transaction.type, startX + colWidths.id, y);
    doc.text(transaction.amount.toString(), startX + colWidths.id + colWidths.type, y);
    doc.text(new Date(transaction.date ?? '').toLocaleString(), startX + colWidths.id + colWidths.type + colWidths.amount, y);
    doc.text(transaction.target_account_id ? transaction.target_account_id.toString() : 'N/A', startX + colWidths.id + colWidths.type + colWidths.amount + colWidths.date, y);
    doc.moveDown();
  });

  // Finalize the PDF and end the document
  doc.end();

  // Wait for the stream to finish writing
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return pdfPath;
}
