#!/usr/bin/env node

const Tool = require(`${process.cwd()}/tool.js`);
const validator = new (require('@koalati/results-validator'))();
const puppeteer = require('puppeteer');
const args = require('minimist')(process.argv.slice(2))
const clc = require('cli-color');
const maxPageLoadAttempts = 3;
const consoleMessages = { errors: [], warnings: [], others: [] };
let jsonResults = null;

if ('url' in args) {
    (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({ DNT: "1" });
        await page.setViewport({ width: 1920, height: 1080 });

        // Collect errors from the console in case the tool needs it
        page.on('pageerror', ({ message }) => consoleMessages.errors.push(message))
            .on('requestfailed', request => consoleMessages.errors.push(`${request.failure().errorText} ${request.url()}`))
            .on('console', message => {
                const type = message.type().substr(0, 3).toUpperCase();
                const key = { ERR: 'errors', WAR: 'warnings' }[type] || 'others';
                consoleMessages[key].push(message.text());
            });

        // Attempt to connect to the targeted page
        for (let attemptCount = 1; attemptCount <= maxPageLoadAttempts; attemptCount++) {
            try {
                await page.goto(args['url'], { waitUntil: "networkidle0",  timeout: 7500 * attemptCount });
                break;
            } catch (error) {
                if (attemptCount == maxPageLoadAttempts) {
                    console.log(clc.red(JSON.stringify({ error: "The page could not be loaded within a 30 seconds timespan, and therefore could not be tested." })));
                    await browser.close();
                    process.exit(1);
                }
            }
        }

        // Prepare the data that will be provided to the tool
        const availableData = {
            page,
            consoleMessages,
            devices: puppeteer.devices
        };

        // Run the tool
        try {
            const toolInstance = new Tool(availableData);
            await toolInstance.run();
            const validationErrors = validator.checkResults(toolInstance.results)

            if (validationErrors.length) {
                for (const error of validationErrors) {
                    console.log(clc.red('Results validation error: ' + error));
                }
                await browser.close();
                process.exit(1);
            }

            jsonResults = JSON.stringify(toolInstance.results, null, 2);
            await toolInstance.cleanup();
        } catch (error) {
            console.log(clc.red('An error occured while running the tool.'));
            console.log(error);
            await browser.close();
            process.exit(1);
        }

        console.log(clc.green('Tool ran successfully without any errors.'));
        console.log(clc.green('Here are the JSON encoded results it returned:'));
        console.log(jsonResults);
        await browser.close();
    })();
} else {
    console.log(clc.red(JSON.stringify({ error: 'Missing URL argument.' })));
    process.exit(1);
}
