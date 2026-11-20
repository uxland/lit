import {assert, expect} from '@open-wc/testing';
import {restore, spy, stub} from 'sinon';
import {IRegionAdapter, Region} from '../../src/region';
import {ViewComponent, ViewDefinition} from '../../src/view-definition';

const mockViewName = 'my-view';
const mockReginnName = 'my-region';

const rejection = async (promise: Promise<unknown>): Promise<Error | undefined> => {
  try {
    await promise;
  } catch (error) {
    return error as Error;
  }
  return undefined;
};

/** A valid view definition, which resolves to its own element without any module mocking. */
const createView = (tag = 'my-view'): ViewDefinition => ({element: document.createElement(tag)});

describe('Given an instance of Region', () => {
  let activateView: ReturnType<typeof stub>;
  let deactivateView: ReturnType<typeof stub>;
  let viewAdded: ReturnType<typeof stub>;
  let removeViewFromAdapter: ReturnType<typeof stub>;
  const regionFactory = () =>
    new Region(
      mockReginnName,
      null,
      document.createElement('div') as any,
      <IRegionAdapter>(<any>{
        activateView,
        deactivateView,
        viewAdded,
        removeView: removeViewFromAdapter,
      }),
      {name: mockReginnName, targetId: ''}
    );
  beforeEach(() => {
    activateView = stub().resolves();
    deactivateView = stub().resolves();
    viewAdded = stub().resolves();
    removeViewFromAdapter = stub();
  });
  afterEach(() => restore());

  describe('and a view is added', () => {
    it('should store it internally', async () => {
      const region = regionFactory();
      const view = createView();
      const result = await region.addView(mockViewName, view);
      expect(result).to.be.equal(region);
      expect(region.getView(mockViewName)).to.be.equal(view);
    });
    it('should validate view', async () => {
      const region = regionFactory();
      const error = await rejection(region.addView(mockViewName, {}));
      expect(error?.message).to.contain(
        'One of properties htmlTag, factory or element must be set'
      );
      expect(region.getView(mockViewName)).to.equal(undefined);
    });
    it('should notify adapter', async () => {
      const region = regionFactory();
      const view = createView();
      await region.addView(mockViewName, view);
      assert(viewAdded.calledOnceWith(view));
    });
    it('should not notify adapter if validate view raises', async () => {
      const region = regionFactory();
      const error = await rejection(region.addView(mockViewName, <any>{htmlTag: true}));
      expect(error).to.not.equal(undefined);
      assert(viewAdded.notCalled);
    });
    it('should raise error if a view with same key is already added', async () => {
      const region = regionFactory();
      await region.addView(mockViewName, createView());
      viewAdded.resetHistory();
      const error = await rejection(region.addView(mockViewName, createView()));
      expect(error?.message).to.contain(`Already exists a view with key ${mockViewName}`);
      assert(viewAdded.notCalled);
      await region.addView(`${mockViewName}1`, createView());
      assert(viewAdded.calledOnce);
    });
  });
  describe('and a view is removed', () => {
    it('should remove it from view collection', async () => {
      const region = regionFactory();
      await region.addView(mockViewName, createView());
      await region.removeView(mockViewName);
      expect(region.getView(mockViewName)).to.be.undefined;
    });
    it('should deactivate it', async () => {
      const region = regionFactory();
      await region.addView(mockViewName, createView());
      const spyFn = spy(region, 'deactivate');
      await region.removeView(mockViewName);
      assert(spyFn.calledWith(mockViewName));
    });
    it('should remove it', async () => {
      const region = regionFactory();
      await region.addView(mockViewName, createView());
      const spyFn = spy(region, 'remove');
      await region.removeView(mockViewName);
      assert(spyFn.calledWith(mockViewName));
    });
    it('should ask the adapter to remove its component if it was created', async () => {
      const region = regionFactory();
      const view = createView();
      await region.addView(mockViewName, view);
      await region.activate(mockViewName);
      await region.removeView(mockViewName);
      assert(removeViewFromAdapter.calledOnceWith(view.element));
    });
  });
  describe('and a view is activated', () => {
    describe('by key', () => {
      it('should be added to the active views collection', async () => {
        const region = regionFactory();
        const view = createView();
        await region.addView(mockViewName, view);
        await region.activate(mockViewName);
        expect(region.currentActiveViews).to.deep.equal([view]);
      });
      it('should be added only once', async () => {
        const region = regionFactory();
        const view = createView();
        await region.addView(mockViewName, view);
        await region.activate(mockViewName);
        await region.activate(mockViewName);
        await region.activate(mockViewName);
        expect(region.currentActiveViews.filter(v => v === view).length).to.be.equal(1);
        assert(activateView.calledOnce);
      });
      it('should raise error if region does not contain view', async () => {
        const region = regionFactory();
        await region.addView(mockViewName, createView());
        expect(await region.activate(mockViewName)).to.equal(region);
        const otherViewKey = `${mockViewName}1`;
        const error = await rejection(region.activate(otherViewKey));
        expect(error?.message).to.contain(
          `Region does not contain a view with key ${otherViewKey}`
        );
      });
    });
    describe('by view', () => {
      it('should be added to the active views collection', async () => {
        const region = regionFactory();
        const view = createView();
        await region.addView(mockViewName, view);
        await region.activate(view);
        expect(region.currentActiveViews.some(v => v === view)).to.be.equal(true);
      });
      it('should be added only once', async () => {
        const region = regionFactory();
        const view = createView();
        await region.addView(mockViewName, view);
        await region.activate(view);
        await region.activate(view);
        await region.activate(view);
        expect(region.currentActiveViews.filter(v => v === view).length).to.be.equal(1);
      });
      it('should raise error if region does not contain any view', async () => {
        const region = regionFactory();
        const error = await rejection(region.activate({}));
        expect(error?.message).to.contain('Region does not contain this view');
      });
      // SUSPECTED BUG (src/region.ts, `activate`): when given a view definition, the invariant only
      // checks that the region has *some* view, not that it contains the given one, so activating a
      // foreign view is accepted whenever the region is not empty.
      it.skip('should raise error if region contains other views but not this one', async () => {
        const region = regionFactory();
        await region.addView(mockViewName, createView());
        const error = await rejection(region.activate(createView('other-view')));
        expect(error?.message).to.contain('Region does not contain this view');
      });
    });
    it('should create view component if no created previously', async () => {
      const region = regionFactory();
      const view = createView();
      await region.addView(mockViewName, view);
      await region.activate(mockViewName);
      const component: any = view.element;
      expect(component.view).to.equal(view);
      expect(component.region).to.equal(region);
      expect(component.viewKey).to.equal(mockViewName);
    });
    it('should create the component with the factory only once', async () => {
      const element = document.createElement('my-view');
      const factory = stub().resolves(element);
      const region = regionFactory();
      await region.addView(mockViewName, {factory});
      await region.activate(mockViewName);
      await region.deactivate(mockViewName);
      await region.activate(mockViewName);
      assert(factory.calledOnce);
    });
    it('should set active to true to view component', async () => {
      const region = regionFactory();
      const view = createView();
      await region.addView(mockViewName, view);
      await region.activate(mockViewName);
      expect((view.element as any as ViewComponent).active).to.be.equal(true);
    });
    it('should set the region context to the view component', async () => {
      const region = regionFactory();
      const view = createView();
      const context = {};
      region.context = context;
      await region.addView(mockViewName, view);
      await region.activate(mockViewName);
      expect((view.element as any as ViewComponent).regionContext).to.equal(context);
      const newContext = {};
      region.context = newContext;
      expect((view.element as any as ViewComponent).regionContext).to.equal(newContext);
    });
    it('should notify adapter', async () => {
      const region = regionFactory();
      const view = createView();
      await region.addView(mockViewName, view);
      await region.activate(mockViewName);
      assert(activateView.calledOnceWith(view.element));
    });
  });
  describe('and a view is deactivated', () => {
    const activated = async () => {
      const region = regionFactory();
      const view = createView();
      await region.addView(mockViewName, view);
      await region.activate(mockViewName);
      activateView.resetHistory();
      return {region, view, component: view.element as any as ViewComponent};
    };
    it('should be removed from active views', async () => {
      const {region, view} = await activated();
      expect(region.currentActiveViews).to.deep.equal([view]);
      await region.deactivate(view);
      expect(region.currentActiveViews.indexOf(view)).to.be.equal(-1);
      await region.activate(view);
      expect(region.currentActiveViews).to.deep.equal([view]);
      await region.deactivate(mockViewName);
      expect(region.currentActiveViews.indexOf(view)).to.be.equal(-1);
    });
    it('should deactivate component', async () => {
      const {region, view, component} = await activated();
      await region.deactivate(view);
      expect(component.active).to.be.equal(false);
      await region.activate(view);
      expect(component.active).to.be.equal(true);
      await region.deactivate(mockViewName);
      expect(component.active).to.be.equal(false);
    });
    it('should notify adapter', async () => {
      const {region, view, component} = await activated();
      await region.deactivate(view);
      assert(deactivateView.calledOnceWith(component));
      await region.activate(view);
      deactivateView.resetHistory();
      await region.deactivate(mockViewName);
      assert(deactivateView.calledOnceWith(component));
    });
    it('should not deactivate component neither notify adapter if component related to view not found', async () => {
      const region = regionFactory();
      await region.deactivate({});
      assert(deactivateView.notCalled);
      await region.deactivate(mockViewName);
      assert(deactivateView.notCalled);
    });
  });
  it('contains view test', async () => {
    const region = regionFactory();
    const view = createView();
    await region.addView('my-view', view);
    expect(region.containsView('my-view2')).to.be.equal(false);
    expect(region.containsView(<any>{})).to.be.equal(false);
    expect(region.containsView('my-view')).to.be.equal(true);
    expect(region.containsView(view)).to.be.equal(true);
  });
  describe('getKey', () => {
    it('should return the key a view was added with', async () => {
      const region = regionFactory();
      const view = createView();
      await region.addView(mockViewName, view);
      expect(region.getKey(view)).to.equal(mockViewName);
      expect(region.getKey({})).to.equal(undefined);
    });
  });
  describe('isAtiveView suite', () => {
    it('should raise exception if view does not exists', () => {
      const region = regionFactory();
      expect(() => region.isViewActive('my-view2')).throws(
        `region ${mockReginnName} doest not contain this view`
      );
      expect(() => region.isViewActive({})).throws(
        `region ${mockReginnName} doest not contain this view`
      );
    });
    it('should return true if is in activeView list', async () => {
      const region = regionFactory();
      const view = createView();
      await region.addView(mockViewName, view);
      await region.addView('other', createView());
      await region.activate(mockViewName);
      expect(region.isViewActive(mockViewName)).to.be.equal(true);
      expect(region.isViewActive(view)).to.be.equal(true);
      expect(region.isViewActive('other')).to.be.equal(false);
    });
  });
  describe('toggleViewActive', () => {
    it('should raise exception if view does not exists', async () => {
      const region = regionFactory();
      const error1 = await rejection(region.toggleViewActive('my-view2'));
      expect(error1?.message).to.equal(`region ${mockReginnName} doest not contain this view`);
      const error2 = await rejection(region.toggleViewActive({}));
      expect(error2?.message).to.equal(`region ${mockReginnName} doest not contain this view`);
    });
    it('should call deactivate view if view is active', async () => {
      const region = regionFactory();
      await region.addView(mockViewName, createView());
      await region.activate(mockViewName);
      const activateSpy = spy(region, 'activate');
      const deactivateSpy = spy(region, 'deactivate');

      const result = await region.toggleViewActive(mockViewName);

      expect(result).to.be.equal(false);
      assert(deactivateSpy.calledWith(mockViewName));
      assert(activateSpy.notCalled);
    });
    it('should call activate view if view is not active', async () => {
      const region = regionFactory();
      await region.addView(mockViewName, createView());
      const activateSpy = spy(region, 'activate');
      const deactivateSpy = spy(region, 'deactivate');

      const result = await region.toggleViewActive(mockViewName);

      expect(result).to.be.equal(true);
      assert(activateSpy.calledWith(mockViewName));
      assert(deactivateSpy.notCalled);
    });
  });
  describe('viewRemovedFromDom', () => {
    it('should forget the component so it is created again on next activation', async () => {
      const factory = stub().callsFake(async () => document.createElement('my-view'));
      const region = regionFactory();
      const view: ViewDefinition = {factory};
      await region.addView(mockViewName, view);
      await region.activate(mockViewName);
      await region.deactivate(mockViewName);
      region.viewRemovedFromDom(view);
      await region.activate(mockViewName);
      assert(factory.calledTwice);
    });
  });
});
