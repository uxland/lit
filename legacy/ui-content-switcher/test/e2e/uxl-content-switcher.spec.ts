import {expect} from '@open-wc/testing';
import * as puppeteer from 'puppeteer/lib/esm/puppeteer/node/Puppeteer';

describe('uxl-content-switcher', () => {
  describe('Given we want a content switcher', () => {
    describe('When we use component with a children divs', () => {
      let browser;
      before(async () => {
        browser = await puppeteer.launch();
        browser.url('');
        browser.waitForSelector('#test1', 4000);
      });
      describe('And when we set selected as a index, without attrForSelected', () => {
        it('Then the component should show de child according the selected attribute', () => {
          const div = browser.isVisible('#test1 #div1');
          expect(div).to.be.true;
        });
        it(`And the rest of childs shouldn't display`, () => {
          const div2Visible = browser.isVisible('#test1 #div2');
          const div3Visible = browser.isVisible('#test1 #div3');
          expect(div2Visible).to.be.false;
          expect(div3Visible).to.be.false;
        });
        it(`And selected children should have "selected" classifier`, () => {
          const div = browser.getAttribute('#test1 #div1', 'class');
          expect(div).to.be.equal('selected');
        });
        it(`And the rest of childs shouldn't have "selected" classifier`, () => {
          const div1 = browser.getAttribute('#test1 #div2', 'class');
          const div2 = browser.getAttribute('#test1 #div3', 'class');
          expect(div1).to.be.equal('');
          expect(div2).to.be.equal('');
        });
      });
      describe('And when we set selected as a index and attrForSelected', () => {
        before(() => {
          browser.url('');
          browser.waitForSelector('#test2', 4000);
        });
        it(`Then the component should display the child which have attribute name equal "attrForSelected" property value and value for this attribute equal "selected" property value`, () => {
          const div = browser.isVisible('#test2 #div5');
          expect(div).to.be.true;
        });
        it(`And the rest of childs shouldn't display`, () => {
          const div4 = browser.isVisible('#test2 #div4');
          const div6 = browser.isVisible('#test2 #div6');
          expect(div4).to.be.false;
          expect(div6).to.be.false;
        });
        it(`And selected children should have "selected" classifier`, () => {
          const div = browser.getAttribute('#test2 #div5', 'class');
          expect(div).to.be.equal('selected');
        });
        it(`And the rest of childs shouldn't have "selected" classifier`, () => {
          const div4 = browser.getAttribute('#test2 #div4', 'class');
          const div6 = browser.getAttribute('#test2 #div6', 'class');
          expect(div4).to.be.equal('');
          expect(div6).to.be.equal('');
        });
      });
    });
  });
});
