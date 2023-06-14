import PDFDocument from 'pdfkit';
import Handlebars from 'handlebars';
import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

const generateInvoice = async (
  invoiceData,
  templateFilePath,
  outputPath,
  pdfOptions
) => {
  try {
    const invoiceTemplate = await readFileAsync(templateFilePath, 'utf-8');

    // Compile the template
    const compiledTemplate = Handlebars.compile(invoiceTemplate);

    // Generate HTML content using the compiled template and the provided invoice data
    const htmlContent = compiledTemplate(invoiceData);

    // Create a new PDF document
    const doc = new PDFDocument(pdfOptions);

    // Pipe the PDF document to a writable stream or save it to a file
    doc.pipe(fs.createWriteStream(outputPath));

    // Embed the HTML content into the PDF document
    doc.html(htmlContent, {
      // PDF generation options (e.g., page size, margins, etc.)
    });

    // Finalize and close the PDF document
    doc.end();
  } catch (error) {
    throw new Error(`Error generating invoice: ${error.message}`);
  }
};

export default generateInvoice;
