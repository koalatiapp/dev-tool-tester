class Tool 
{
	constructor({ page }) {
        this.page = page;
        this._results = [];
    }

    async run() {
		const pageTitle = await this.page.evaluate(() => {
			const titleNode = document.querySelector('title');
			return titleNode ? titleNode.textContent.trim() : null;
		});
        this._results.push({
            'uniqueName': 'meta-title',
            'title': 'Page title',
            'weight': 1,
            'score': pageTitle && pageTitle.length > 10 ? 1 : 0,
            'snippets': [pageTitle],
        });
    }

    get results() {
        return this._results;
    }

    async cleanup() {

    }
}

module.exports = Tool;