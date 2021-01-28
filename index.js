module.exports = async function runTool(Tool, url) {
    const puppeteer = require('puppeteer');
    const maxPageLoadAttempts = 3;
    const consoleMessages = { errors: [], warnings: [], others: [] };
    const browser = await puppeteer.launch({
        args: [
            '--disable-web-security',
        ],
        headless: true
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({ DNT: "1" });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setCacheEnabled(false);

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
            await page.goto(url, { waitUntil: "networkidle0",  timeout: 7500 * attemptCount });
            break;
        } catch (error) {
            if (attemptCount == maxPageLoadAttempts) {
                await browser.close();
                throw new Error("The page could not be loaded within a 30 seconds timespan, and therefore could not be tested.");
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
    let toolResults = null;
    try {
        const toolInstance = new Tool(availableData);
        await toolInstance.run();
        toolResults = toolInstance.results;
        await toolInstance.cleanup();
    } catch (error) { 
        await browser.close();
        throw error;
    }

    await browser.close();
    return toolResults;
}