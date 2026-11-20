import {expect} from '@open-wc/testing';
import {restore, spy} from 'sinon';
import {IRegion, ViewDefinition, viewFactory} from '../../src';

describe('when invoking `viewFactory` function', () => {
  const region = <IRegion>{};
  afterEach(() => restore());
  describe('and view supplies `element` property', () => {
    it('should return view `element` property value', async () => {
      const view: ViewDefinition = {
        element: window.document.createElement('div'),
      };
      const element = await viewFactory(view, region, 'myView');
      expect(element).to.equal(view.element);
      expect(element.view).to.equal(view);
      expect(element.region).to.equal(region);
      expect(element.viewKey).to.equal('myView');
    });
  });
  describe('and view supplies `factory` method', () => {
    it('should return factory method result', async () => {
      const element = window.document.createElement('my-view');
      const view: ViewDefinition = {factory: () => Promise.resolve(element)};
      const result = await viewFactory(view, region, 'myView');
      expect(result).to.equal(element);
      expect(result.view).to.equal(view);
      expect(result.region).to.equal(region);
      expect(result.viewKey).to.equal('myView');
    });
  });
  describe('and view supplies `htmlTag` property', () => {
    it('should create an html element', async () => {
      const createElement = spy(window.document, 'createElement');
      const view = {htmlTag: 'my-view'};
      const element = await viewFactory(view, region, 'myView');
      expect(createElement.calledWith('my-view')).to.equal(true);
      expect(element.localName).to.equal('my-view');
      expect(element.view).to.equal(view);
      expect(element.region).to.equal(region);
      expect(element.viewKey).to.equal('myView');
    });
    it('should import module if htmlUrl supplied', async () => {
      const view = {
        htmlTag: 'my-imported-view',
        htmlUrl: new URL('./fixtures/view-module.js', import.meta.url).href,
      };
      const element = await viewFactory(view, region, 'myView');
      expect(element.localName).to.equal('my-imported-view');
      expect((window as any).__viewModuleLoaded).to.equal(true);
    });
  });
});
