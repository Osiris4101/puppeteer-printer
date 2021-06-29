/*************************************************************
* June 29th, 2021                             M. Adil Umer   *
*                                                            *
* It has been a while since I started development            *
* professionally, thinking of putting bits on GitHub         *
* henceforth - Better late than never :)                     *
*                                                            *
* You may find a lot of 'console.log' lines, I am leaving it *
* like that for two reaseons,                                *
*  1. I like to see where the program is, in execution cycle,*
*     regardless of how tiny it is.                          *
*  2. They currently serve the purpose of comments for the   *
*     reader.                                                *
*************************************************************/


var puppeteer = require('puppeteer');

/* 
As I plan to use it in a server-side app which would always be active,
I declare this variable to prevent constantly opening and closing the 
browser instance when multiple printing jobs are waiting. 
*/
global.waitingURLPrintingTask = false;

var activeBrowser = null;
var viewport = { width: 1680, height: 1600};

async function launchBrowserInstance(){
  var browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: null,
    args: [
      "--proxy-server='direct://'",
      '--proxy-bypass-list=*',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      `--window-size=${viewport.width},${viewport.height}`,
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--enable-features=NetworkService'
    ]
  });

  return browser;
}

async function resetBrowserCache(page){
  var client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await client.send('Network.clearBrowserCache');
  await page.setCacheEnabled(false);
  return new Promise((rs)=>{
    rs(page);
  });
}

function getViewport() {

  var viewPortWidth;
  var viewPortHeight;
 
  var oHeight = document.documentElement.offsetHeight;
  var oWidth = document.documentElement.offsetWidth;
  
  // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  if (typeof window.innerWidth != 'undefined') {
    viewPortWidth = window.innerWidth,
    viewPortHeight = window.innerHeight
  }
 
 // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
  else if (typeof document.documentElement != 'undefined'
  && typeof document.documentElement.clientWidth !=
  'undefined' && document.documentElement.clientWidth != 0) {
     viewPortWidth = document.documentElement.clientWidth,
     viewPortHeight = document.documentElement.clientHeight
  }
 
  // older versions of IE
  else {
    viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
    viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
  }
  return {vp: [viewPortWidth, viewPortHeight], content:{h: oHeight, w: oWidth}};
}

async function checkBrowser(logs){
  if (!activeBrowser) {
    if(logs) console.log('Firing up browser instance as active browser instance is null...');
    try{
      activeBrowser = await launchBrowserInstance();
      await setDisconnectEvent(activeBrowser);
    }catch(err){
      console.log('Launching browser instance failed');
      return false;
    }
    return true;
  }else{
    // Nothing to do here, as browser diconnection would lead to relaunch, still leaving it here if something comes to mind in the next few releases.
  }
}

async function setDisconnectEvent(browser){
  browser.on('disconnected', ()=>{
    // set activeBrowser to null so that it is relaunched on next call.
    activeBrowser = null;
  });
}

async function printPage(options){
  
  var isBrowserActive = await checkBrowser(options.logs);
  if (!isBrowserActive) return null;
  
  if(options.logs) console.log('Opening new page...');
  var page = null;  
  try {
    page = await activeBrowser.newPage();
  }catch (e){
    console.log(e);
    if(activeBrowser) activeBrowser.close();
    return null;
  }
  
  if(options.resetCache) {
    if(options.logs) console.log('Resetting browser cache...');
    page = await resetBrowserCache(page);
  }
  await page.setViewport(viewport);
  
  if(options.logs) {
    console.log('ViewPort Set...');
    console.log('Navigating to', options.targetURL, '...');
  }
  
  await page.goto(options.targetURL, { waitUntil: "networkidle2" });
  
  var dims = await page.evaluate(getViewport);
  if(options.logs) {
    console.log("viewport", dims.vp, "content size", dims.content);
    console.log('Adding custom style(s)...');
  }

  await page.addStyleTag({ content: options.customStyle });
  
  if(options.logs) console.log('Printing', options.output ,'...');

  await page.pdf({
    path: options.output,
    landscape: options.landscape || false,
    scale: options.scale || 1,
    printBackground: options.printBackground == false ? false : true,
    margin: options.margin || { top: '0px', right: '0px', bottom: '0px', left: '0px'},
    width: viewport.width,
    height: dims.content.h*1.18 + "px"
  });

  if(!waitingURLPrintingTask){
    if(options.logs) console.log('No waiting tasks, closing browser instance...');
    await activeBrowser.close();
  }

  return options.output;
}

module.exports = {
  print:printPage
};