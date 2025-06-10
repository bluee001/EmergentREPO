import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate Allure report
exec('allure generate ./allure-results --clean', (error) => {
    if (error) {
        console.error('Error generating Allure report:', error);
        return;
    }

    // Read the report data
    const reportData = JSON.parse(fs.readFileSync('./allure-report/data/suites.json', 'utf8'));

    function generateEmailHTML(data) {
        const totalTests = data.children.reduce((acc, suite) => acc + suite.children.length, 0);
        const passedTests = data.children.reduce((acc, suite) => 
            acc + suite.children.filter(test => test.status === 'passed').length, 0);
        const failedTests = data.children.reduce((acc, suite) => 
            acc + suite.children.filter(test => test.status === 'failed').length, 0);
        const skippedTests = data.children.reduce((acc, suite) => 
            acc + suite.children.filter(test => test.status === 'skipped').length, 0);
        const passRate = ((passedTests / totalTests) * 100).toFixed(1);

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Test Execution Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
                .summary-item { margin: 10px 0; }
                .test-suite { margin: 20px 0; }
                .test-case { margin: 10px 0; padding: 10px; border-left: 4px solid #ccc; }
                .passed { border-left-color: #4CAF50; }
                .failed { border-left-color: #f44336; }
                .skipped { border-left-color: #FFC107; }
                .status { font-weight: bold; }
                .passed .status { color: #4CAF50; }
                .failed .status { color: #f44336; }
                .skipped .status { color: #FFC107; }
                .error { color: #f44336; margin-top: 5px; }
                .duration { color: #666; font-size: 0.9em; }
            </style>
        </head>
        <body>
            <h1>Test Execution Report</h1>
            <div class="summary">
                <h2>Summary</h2>
                <div class="summary-item">Total Tests: ${totalTests}</div>
                <div class="summary-item">Passed: ${passedTests}</div>
                <div class="summary-item">Failed: ${failedTests}</div>
                <div class="summary-item">Skipped: ${skippedTests}</div>
                <div class="summary-item">Pass Rate: ${passRate}%</div>
            </div>
            <div class="details">
                <h2>Test Results</h2>`;

        data.children.forEach(suite => {
            html += `<div class="test-suite">
                <h3>${suite.name}</h3>`;

            suite.children.forEach(test => {
                const statusClass = test.status.toLowerCase();
                html += `
                <div class="test-case ${statusClass}">
                    <div class="status">${test.status.toUpperCase()}</div>
                    <div class="name">${test.name}</div>
                    <div class="duration">Duration: ${(test.time.duration / 1000).toFixed(2)}s</div>`;

                if (test.status === 'failed' && test.statusDetails) {
                    html += `<div class="error">${test.statusDetails.message}</div>`;
                }

                html += `</div>`;
            });

            html += `</div>`;
        });

        html += `
            </div>
        </body>
        </html>`;

        return html;
    }

    // Generate and save the HTML report
    const htmlReport = generateEmailHTML(reportData);
    fs.writeFileSync('test-report.html', htmlReport);
    console.log('Email-friendly HTML report generated successfully at test-report.html');
}); 