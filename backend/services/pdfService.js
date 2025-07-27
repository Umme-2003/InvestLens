// backend/services/pdfService.js
require('dotenv').config();
const PDFDocument = require('pdfkit');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require("@aws-sdk/lib-storage");
const { PassThrough } = require('stream');

// New, Hardened Code
const region = process.env.AWS_S3_REGION ? process.env.AWS_S3_REGION.replace(/["']/g, "") : undefined;

const s3Client = new S3Client({
  region: region, // Use the cleaned region variable
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
// New, Fully Hardened Code
async function generateInvestmentThesisPDF(analysisData, startupName) {
  const date = new Date().toISOString().slice(0, 10);
  const key = `reports/Investment_Thesis_${startupName}_${date}_${Date.now()}.pdf`;
  
  // Sanitize the bucket name variable just in case
  const bucketName = process.env.AWS_S3_BUCKET_NAME ? process.env.AWS_S3_BUCKET_NAME.replace(/["']/g, "") : undefined;

  return new Promise((resolve, reject) => { //...


    const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 72, right: 72 } });
    const passthrough = new PassThrough();
    doc.pipe(passthrough);

    try {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: key,
          Body: passthrough,
          ContentType: 'application/pdf',
          ACL: 'public-read',
        },
      });

      upload.done().then(() => {
        // Use simple, robust string concatenation.
        // The previous ENOTFOUND error was due to a bad .env value, which is now fixed.
        const fileUrl = `https://${bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
        resolve(fileUrl);
      }).catch(reject);
    } catch (err) {
      console.error("S3 Upload Initialization Error:", err);
      reject(err);
    }
    
    // --- PDF Content Generation (Remains the same) ---
    doc.font('Helvetica-Bold');
    doc.fontSize(20).text('Investment Thesis Report', { align: 'center' });
    doc.fontSize(16).text(startupName, { align: 'center' });
    doc.moveDown(2);
    // ... all your other doc.text() commands for the PDF content ...
    doc.fontSize(14).text('1. Summary Section');
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(11).text('Investment Recommendation: ', { continued: true }).font('Helvetica').text(analysisData.investmentRecommendation);
    doc.font('Helvetica-Bold').text('Overall Score: ', { continued: true }).font('Helvetica').text(`${analysisData.overallScore} / 100`);
    doc.font('Helvetica-Bold').text('Confidence Score: ', { continued: true }).font('Helvetica').text(`${analysisData.confidenceScore} / 100`);
    doc.font('Helvetica-Bold').text('Processing Date: ', { continued: true }).font('Helvetica').text(new Date().toUTCString());
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(14).text('2. Key Strengths & Weaknesses');
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(11).text('Strengths:');
    doc.font('Helvetica').list(analysisData.strengths, { bulletRadius: 2 });
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(11).text('Weaknesses:');
    doc.font('Helvetica').list(analysisData.weaknesses, { bulletRadius: 2 });
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(14).text('3. Recommendations');
    doc.font('Helvetica').fontSize(11).text(analysisData.recommendations, { align: 'justify' });
    doc.moveDown(2);
    doc.font('Helvetica-Bold').fontSize(14).text('4. Category-wise Analysis');
    doc.moveDown();
    analysisData.categoryAnalysis.forEach(category => {
        doc.font('Helvetica-Bold').fontSize(11).text(`${category.category} (Score: ${category.score}/10, Weight: ${category.weight}%)`);
        doc.font('Helvetica').fontSize(11).text(category.feedback, { align: 'justify' });
        doc.moveDown();
    });
    // Finalize the PDF
    doc.end();
  });
}

module.exports = { generateInvestmentThesisPDF };