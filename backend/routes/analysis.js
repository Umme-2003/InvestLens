// backend/routes/analysis.js

const express = require('express');
const { spawn } = require('child_process');
// We no longer need the 'fs' module for temporary files
const upload = require('../file-upload');
const authMiddleware = require('../middleware/authMiddleware');
const { analyzePitchDeckText } = require('../services/aiService');
const { generateInvestmentThesisPDF } = require('../services/pdfService');
const { sendReportEmail } = require('../services/emailService');

const router = express.Router();

router.post('/upload', [authMiddleware, upload.single('pitchDeck')], async (req, res) => {
    // Check if a file was uploaded by multer
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        // Get metadata from the request. The user info comes from the JWT middleware.
        const startupName = req.file.originalname.replace(/\.pptx?/i, '').replace(/[^a-zA-Z0-9]/g, '');
        const recipientEmail = req.user.email;

        // The file content is now in memory as a "Buffer"
        const fileBuffer = req.file.buffer;

        // Step 1: Extract text by piping the buffer to the Python script
        const extractedText = await new Promise((resolve, reject) => {
            // We run 'python3' to be explicit, and no longer pass a file path argument
            const pythonProcess = spawn('python3', ['scripts/extract_text.py']);
            
            let textOutput = '';
            let errorOutput = '';
            
            // Listen for data from the script's standard output
            pythonProcess.stdout.on('data', (data) => {
                textOutput += data.toString();
            });

            // Listen for any errors from the script's standard error
            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            // When the script process finishes...
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    // Success! Resolve the promise with the extracted text.
                    resolve(textOutput);
                } else {
                    // Failure! Log the error output and reject the promise.
                    console.error(`Python script error output: ${errorOutput}`);
                    reject(new Error(`Python script failed with exit code ${code}`));
                }
            });

            // Write the file buffer from memory into the Python script's standard input stream
            pythonProcess.stdin.write(fileBuffer);
            // Close the input stream to signal that we are done sending data
            pythonProcess.stdin.end();
        });

        // Step 2: Send the extracted text to the AI for analysis
        const analysisResult = await analyzePitchDeckText(extractedText);

        // Step 3: Generate the PDF report using the AI's analysis
        const pdfUrl = await generateInvestmentThesisPDF(analysisResult, startupName);
        
        // Step 4: Send a notification email with the report link
        await sendReportEmail(recipientEmail, pdfUrl);
        
        // Step 5: Send the final success response to the frontend
        res.status(200).json({
            message: 'Report generated and sent successfully!',
            filePath: pdfUrl,
        });

    } catch (error) {
        // Catch any error that happens in the try block (Python, AI, PDF, Email)
        console.error('Full analysis workflow failed:', error);
        res.status(500).json({ message: 'Failed to complete the analysis process.' });
    }
});

module.exports = router;