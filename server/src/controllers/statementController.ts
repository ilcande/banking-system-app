import { Request, Response } from "express";
import { generateStatementPdfService } from "../services/statementServices";
import { findTransactionsByAccountAndDate } from '../models/transactionModel';

export async function generateStatementController(req: Request, res: Response): Promise<void> {
  const { accountId, month, year } = req.params;
  const userId = (req as any).user.userId;
  
  try {
      // Ensure the user has access to this account
      const transactions = await findTransactionsByAccountAndDate(Number(accountId), Number(month), Number(year));
  
      if (transactions.length === 0) {
          res.status(404).json({ message: 'No transactions found for this period' });
      }
  
      // Generate the PDF
      const pdfPath = await generateStatementPdfService(Number(accountId), Number(userId), transactions, Number(month), Number(year));
  
      // Send the PDF file to the client
      res.download(pdfPath, `statement_${accountId}_${month}_${year}.pdf`);
  } catch (error: any) {
      console.error('Error generating statement:', error.message);
      res.status(500).json({ message: 'Failed to generate statement', error: error.message });
  }
}
