const {JSDOM} = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html lang="ca"><body></body></html>', {
  url: 'http://localhost',
});
//@ts-ignore
const {window} = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}
//@ts-ignore
global.window = window;
//@ts-ignore
global.document = window.document;
//@ts-ignore
global.navigator = {
  userAgent: 'node.js',
};

const raf = require('raf');
raf.polyfill(window);
raf.polyfill(global);

copyProps(window, global);

const mo = require('mutation-observer');
window['MutationObserver'] = mo;
//@ts-ignore
global.MutationObserver = mo;
