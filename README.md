# Koalati Tool Tester for Developers

This is a package that allows you to easily test Koalati tools from the command line.


## Getting started

If you have built your tool with the [Koalati's Tool Template](https://github.com/koalatiapp/tool-template), this package is already specified as a dev dependency.

If you have started your tool from scratch, start by adding this package as a dev dependency:
```
npm i @koalati/dev-tool-tester --save-dev
```

Make sure you have installed all of the devDependencies by running:
```bash
sudo npm install --unsafe-perm=true --allow-root
```

_It is important to have the extra arguments in there, because the testing script uses Puppeteer, which relies on the headless Chromium browser. Running in root and adding the `--unsafe-perm=true --allow-root` arguments is usually required for the Chromium browser to download and install itself along with Puppeteer._

Then, from within your tool's directory, you can test your tool with the following command:

```bash
npx @koalati/dev-tool-tester --url="https://koalati.com/"
```
