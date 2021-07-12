# puppeteer-printer
A small library to print content from a url using Node.js &amp; Puppeteer.

## Why? 
I had a need for saving the content viewed by users for legal reasons in a project. 

## Dependencies 

The only non-native dependency is 'puppeteer', the project also uses 'fs' and 'path' though.

## How to use? 

- Get the ```index.js``` file from the repo.
- Add 'puppeteer' dependency to your project: 
	```
	npm install puppeteer
	# or "yarn add puppeteer"
	```

- Require the main file in your project:
```var printer = require('./index');```
- Call the ``` printer.print(options) ``` function.
```
printer.print({
		targetURL: 'https://en.wikipedia.org/wiki/Neutrino_oscillation', 
		output: 'exaple-output',
		logs: false,
		resetCache: false,
		customStyle: "#toc{ display: none; }", // Hide the TOC in printing.
		landscape: false,
		scale: 1,
		printFormat: 'pdf',
		margin: { top: '1in', right: '1in', bottom: '1in', left: '1in'}
});
```
- That's it. You can run it now. 

### The Options Object (Parameter for printer.print())

|Key | Data Type | Description | Example|
|---|---|---|---|
|targetURL | string | URL of the page to save | 'https://en.wikipedia.org/wiki/Neutrino_oscillation'|
|output | string | Name of the file to write the data to. Can be with or without extension | 'outFile.pdf'|
|logs | boolean | Much like the 'verbose' parameter in most executable. Specifies whether it should print the ongoing operations to console. | false|
|resetCache | boolean | Whether the puppeteer cache should be cleared before navigation. | false|
|customStyle | string | Any CSS you would like to add to the page before printing | '#toc{ display: none; }'|
|landscape | boolean | Should printing be done in landscape orientation | false|
|scale | number | Magnification multiplier, default: 1| 1|
|printFormat | string | Format in which output is required, output file has an extension based on this choice. Default is currently 'png', but you can change it by changing (index.js:177) according to your needs. (Supports 'png', 'pdf' and 'mhtml') | 'pdf'|
|margin | object | Specifies page margins for printing, default: { top: '0', right: '0', bottom: '0', left: '0'} | { top: '1in', right: '1in', bottom: '1in', left: '1in'}|


Consult ```example.js``` for working example and printing multiple files. 

### Notes

- Default viewport is ```{ width: 1680, height: 1600}```. Can be customized at index.js:34.
- Suggesstions on improvement? Shoot 'em at me. 


