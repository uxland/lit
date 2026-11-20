import {IRegion, ViewDefinition, viewFactory} from '../../src';

// declare var global: any;

describe('when invoking `viewFactory` function', () => {
  const region = <IRegion>{};
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  describe('and view supplies `element` property', () => {
    it('should return view `element` property value', async () => {
      const view: ViewDefinition = {
        element: window.document.createElement('div'),
      };
      const element = await viewFactory(view, region, 'myView');
      expect(element).toBe(view.element);
      expect(element.view).toBe(view);
      expect(element.region).toBe(region);
      expect(element.viewKey).toBe('myView');
    });
  });
  describe('and view supplies `factory` method', () => {
    it('should return factory method result', async () => {
      const element = window.document.createElement('my-view');
      const view: ViewDefinition = {factory: () => Promise.resolve(element)};
      const result = await viewFactory(view, region, 'myView');
      expect(result).toBe(element);
      expect(result.view).toBe(view);
      expect(result.region).toBe(region);
      expect(result.viewKey).toBe('myView');
    });
  });
  describe('and view supplies `htmlTag` property', () => {
    it('should create an html element', async () => {
      const spy = jest.spyOn(window.document, 'createElement');
      const view = {htmlTag: 'my-view'};
      const element = await viewFactory(view, region, 'myView');
      expect(spy).toBeCalledWith('my-view');
      expect(element.view).toBe(view);
      expect(element.region).toBe(region);
      expect(element.viewKey).toBe('myView');
    });
    it('should import module if htmlUrl supplied', async () => {
      /* const stub = sinon.stub(importHref, 'importHref');
             stub.returns(Promise.resolve(true));
             const view = {htmlTag: 'my-view', htmlUrl: '../src/my-view.js'};
             const element = await viewFactory(view, region, 'myView');
             assert.isTrue(stub.calledOnceWith('../src/my-view.js'));
             assert.strictEqual(element.view, view);
             assert.strictEqual(element.region, region);
             assert.strictEqual(element.viewKey, 'myView');*/
    });
  });
});
