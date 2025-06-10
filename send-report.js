import nodemailer from 'nodemailer';
import { createWriteStream } from 'fs';
import archiver from 'archiver';
import { join } from 'path';

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
});

// Create a zip archive of the report
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
});
const output = createWriteStream('allure-report.zip');
const reportDir = join(process.cwd(), 'allure-report-email');

archive.pipe(output);
archive.directory(reportDir, false);
archive.finalize();

// Send email after zip is created
output.on('close', async () => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'pankajkrk007@gmail.com',
        subject: 'Allure Test Report',
        text: 'Please find attached the Allure test report.',
        attachments: [{
            filename: 'allure-report.zip',
            path: 'allure-report.zip'
        }]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Report sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}); 