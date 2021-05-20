import {assert, expect} from '@open-wc/testing';
import {spy, stub} from 'sinon';
import {IRegionAdapter, Region} from '../../src/region';
import * as validateView from '../../src/validate-view';
import {ViewComponent} from '../../src/view-definition';
import * as viewFactory from '../../src/view-factory';

const mockViewName = 'my-view';
const mockReginnName = 'my-region';
describe('Given an instance of Region', () => {
  const validateViewStub: any;
  const activateView = stub();
  const deactivateView = stub();
  const viewAdded = stub();
  const adapterFactory: () => IRegionAdapter = () =>
    <any>{
      activateView,
      deactivateView,
      viewAdded,
    };
  const regionFactory = () =>
    new Region(mockReginnName, null, document.createElement('div') as any, adapterFactory(), {
      name: mockReginnName,
      targetId: '',
    });
  afterEach(() => {
    // activateView.restore();
    // deactivateView.restore();
    // viewAdded.restore();
    activateView = stub();
    deactivateView = stub();
    viewAdded = stub();
    validateViewStub = stub(validateView, 'validateView').returns(true);
  });
  describe('and a view is added', () => {
    it('should store it internally', async () => {
      const region = regionFactory();
      const view = {};
      const result = await region.addView(mockViewName, view);
      expect(result).to.be.equal(region);
      expect(region.getView(mockViewName)).to.be.equal(view);
    });
    it('should validate view', async () => {
      const region = regionFactory();
      await region.addView(mockViewName, {});
      assert(validateViewStub.calledOnce);
      //   expect(validateViewStub).toBeCalledTimes(1);
    });
    it('should notify adapter', async () => {
      const region = regionFactory();
      const view = {};
      await region.addView(mockViewName, {});
      assert(viewAdded.calledWith(view));
      //   expect(region.adapter.viewAdded).toBeCalledWith(view);
    });
    it('should raise error if validate view raises', async done => {
      //   expect.assertions(1);
      validateViewStub.throws(new Error());
      //   validateViewStub.mockImplementation(() => {
      //     throw new Error();
      //   });
      const view = {};
      const region = regionFactory();
      //   expect(region.addView(mockViewName, {})).rejects;
      try {
        await region.addView(mockViewName, {});
      } catch (error) {
        expect(error).to.not.be.undefined;
      }
      assert(viewAdded.notCalledWith(view));
      done();
      //   expect(region.adapter.viewAdded).not.toBeCalledWith(view);
    });
    it('should raise error if a view with same key is already added', async done => {
      const region = regionFactory();
      stub(region, 'getView').withArgs(mockViewName).returns({});
      //   when(<any>jest.spyOn(region, "getView"))
      //     .calledWith(mockViewName)
      //     .mockReturnValue({});
      //   await expect(region.addView(mockViewName, {})).rejects.throws(
      //     `Already exists a view with key ${mockViewName}`
      //   );
      try {
        await region.addView(mockViewName, {});
      } catch (error) {
        expect(error).to.equal(`Already exists a view with key ${mockViewName}`);
      }
      assert(viewAdded.notCalled);
      //   expect(region.adapter.viewAdded).not.toBeCalled();
      expect(() => region.addView(mockViewName + '1', {})).not.throws();
      assert(viewAdded.calledOnce);
      //   expect(region.adapter.viewAdded).toBeCalledTimes(1);
      done();
    });
  });
  describe('and a view is removed', () => {
    it('should remove it from view collection', async () => {
      const region = regionFactory();
      spy(region, 'deactivate');
      region['views'] = {[mockViewName]: {}};
      await region.removeView(mockViewName);
      expect(region.getView(mockViewName)).to.be.undefined;
    });
    it('should deactivate it', () => {
      const region = regionFactory();
      const view = {htmlTag: 'div'};
      region['views'] = {[mockViewName]: view};
      const spyFn = spy(region, 'deactivate');
      region.removeView(mockViewName);
      assert(spyFn.calledWith(mockViewName));
    });
    it('should remove it', async () => {
      const region = regionFactory();
      const view = {htmlTag: 'div'};
      region['views'] = {[mockViewName]: view};
      const spyFn = spy(region, 'remove');
      await region.removeView(mockViewName);
      assert(spyFn.calledWith(mockViewName));
    });
  });
  describe('and a view is activated', () => {
    describe('by key', () => {
      it('should be added to the active views collection', async () => {
        const region = regionFactory();
        // jest
        //   .spyOn(viewFactory, "viewFactory")
        //   .mockReturnValue(<any>document.createElement("my-view"));
        stub(viewFactory, 'viewFactory').returns(document.createElement('my-view') as any);
        const view = {};
        region['views'] = {[mockViewName]: view};
        await region.activate(mockViewName);
        expect(region.currentActiveViews.find(v => v === view)).to.not.be.undefined;
      });
      it('should be added only once', async () => {
        const view = {};
        const region = regionFactory();
        stub(region, 'getView').withArgs(mockViewName).returns(view);
        // when(<any>jest.spyOn(region, "getView"))
        //   .calledWith(mockViewName)
        //   .mockReturnValue(view);
        stub(viewFactory, 'viewFactory').returns(document.createElement('my-view') as any);
        // jest
        //   .spyOn(viewFactory, "viewFactory")
        //   .mockReturnValue(<any>document.createElement("my-view"));
        await region.activate(mockViewName);
        await region.activate(mockViewName);
        await region.activate(mockViewName);
        expect(region.currentActiveViews.filter(v => v === view).length).to.be.equal(1);
      });
      it('should raise error if region does not contain view', async done => {
        const region = regionFactory();
        stub(viewFactory, 'viewFactory').returns(document.createElement('my-view') as any);
        // jest
        //   .spyOn(viewFactory, "viewFactory")
        //   .mockReturnValue(<any>document.createElement("my-view"));
        const otherViewKey = `${mockViewName}1`;
        stub(region, 'getView')
          .withArgs(mockViewName)
          .returns({})
          .withArgs(otherViewKey)
          .returns(undefined);
        // when(<any>jest.spyOn(region, "getView"))
        //   .calledWith(mockViewName)
        //   .mockReturnValue({})
        //   .calledWith(otherViewKey)
        //   .mockReturnValue(undefined);
        // const p = region.activate(mockViewName);
        // expect(p).resolves;
        try {
          const p = await region.activate(mockViewName);
          expect(p).to.not.be.undefined;
        } catch (error) {
          console.log(error);
        }
        try {
          const p = await region.activate(otherViewKey);
        } catch (error) {
          expect(error).to.equal(`Region does not contain a view with key ${otherViewKey}`);
        }
        done();
        // await expect(p).rejects.throws(
        //   `Region does not contain a view with key ${otherViewKey}`
        // );
      });
    });
    describe('by view', () => {
      it('should be added to the active views collection', async () => {
        const view = {};
        const region = regionFactory();
        region['views'] = {[mockViewName]: view};
        stub(viewFactory, 'viewFactory').returns(document.createElement('my-view') as any);
        // jest
        //   .spyOn(viewFactory, "viewFactory")
        //   .mockReturnValue(<any>document.createElement("my-view"));
        await region.activate(view);
        expect(region.currentActiveViews.some(v => v === view)).to.be.equal(true);
      });
      it('should be added only once', async () => {
        const view = {};
        const region = regionFactory();
        stub(viewFactory, 'viewFactory').returns(document.createElement('my-view') as any);
        // jest
        //   .spyOn(viewFactory, "viewFactory")
        //   .mockReturnValue(<any>document.createElement("my-view"));
        region['views'] = {[mockViewName]: view};
        await region.activate(view);
        await region.activate(view);
        await region.activate(view);
        expect(region.currentActiveViews.filter(v => v === view).length).to.be.equal(1);
      });
      it('should raise error if region does not contain view', async done => {
        const region = regionFactory();
        // await expect(region.activate({})).rejects.throws(
        //   "Region does not contain this view"
        // );
        try {
          const result = await region.activate({});
        } catch (error) {
          expect(error).to.equal('Region does not contain this view');
          done();
        }
      });
    });
    it('should create view component if no created previously', async () => {
      //   const stub = jest
      //     .spyOn(viewFactory, "viewFactory")
      //     .mockResolvedValue(<any>document.createElement("my-view"));
      const stubFn = stub(viewFactory, 'viewFactory').returns(
        document.createElement('my-view') as any
      );
      const region = regionFactory();
      const view = {};
      //   when(<any>jest.spyOn(region, "getView"))
      //     .calledWith(mockViewName)
      //     .mockReturnValue(view);
      stub(region, 'getView').withArgs(mockViewName).returns(view);
      //   jest.spyOn(region["components"], "has").mockReturnValue(false);
      stub(region['components'], 'has').returns(false);
      await region.activate(mockViewName);
      expect(region.currentActiveViews.indexOf(view) >= 0).to.be.equal(true);
      //   expect(stub).toBeCalledWith(view, region, mockViewName);
      assert(stubFn.calledWith(view, region, mockViewName));
    });
    it('should not create view component if created previously', async () => {
      //   const stub = jest
      //     .spyOn(viewFactory, "viewFactory")
      //     .mockReturnValue(<any>document.createElement("my-view"));
      const stubFn = stub(viewFactory, 'viewFactory').returns(
        document.createElement('my-view') as any
      );
      const region = regionFactory();
      const view = {};
      //   when(<any>jest.spyOn(region, "getView"))
      //     .calledWith(mockViewName)
      //     .mockReturnValue(view);
      stub(region, 'getView').withArgs(mockViewName).returns(view);
      stub(region['components'], 'has').withArgs(view).returns(true);
      //   when(<any>jest.spyOn(region["components"], "has"))
      //     .calledWith(view)
      //     .mockReturnValue(true);
      stub(region['components'], 'get')
        .withArgs(view)
        .returns({} as any);
      //   when(<any>jest.spyOn(region["components"], "get"))
      //     .calledWith(view)
      //     .mockReturnValue(<any>{});
      await region.activate(mockViewName);
      expect(region.currentActiveViews.indexOf(view) >= 0).to.be.equal(true);
      //   expect(stub).not.toBeCalled();
      assert(stubFn.notCalled);
    });
    it('should set activate to true to view component', async () => {
      const region = regionFactory();
      const view = {};
      const component = <ViewComponent>{};
      stub(region['components'], 'has').withArgs(view).returns(true);
      //   when(<any>jest.spyOn(region, "getView"))
      //     .calledWith(mockViewName)
      //     .mockReturnValue(view);
      stub(region, 'getView').withArgs(mockViewName).returns(view);
      //   when(<any>jest.spyOn(region["components"], "has"))
      //     .calledWith(view)
      //     .mockReturnValue(true);
      stub(region['components'], 'get')
        .withArgs(view)
        .returns({} as any);
      //   when(<jest.Mock>jest.spyOn(region["components"], "get"))
      //     .calledWith(view)
      //     .mockReturnValue(<any>component);
      await region.activate(mockViewName);
      expect(component.active).to.be.equal(true);
    });
    it('should notify adapter', async () => {
      const region = regionFactory();
      const view = {};
      const component = <ViewComponent>{};
      //   when(<any>jest.spyOn(region, "getView"))
      //     .calledWith(mockViewName)
      //     .mockReturnValue(view);
      stub(region, 'getView').withArgs(mockViewName).returns(view);
      stub(region['components'], 'has').withArgs(view).returns(true);
      //   when(<any>jest.spyOn(region["components"], "has"))
      //     .calledWith(view)
      //     .mockReturnValue(true);
      stub(region['components'], 'get')
        .withArgs(view)
        .returns({} as any);
      //   when(<jest.Mock>jest.spyOn(region["components"], "get"))
      //     .calledWith(view)
      //     .mockReturnValue(<any>component);
      await region.activate(mockViewName);
      //   expect(region.adapter.activateView).toBeCalledWith(component);
      assert(activateView.calledWith(component));
    });
  });
  describe('and a view is deactivated', () => {
    it('should be removed from active views', () => {
      const region = regionFactory();
      const view = {};
      const component = {};
      region['views'] = {[mockViewName]: view};
      region['activeViews'] = [view];
      expect(region.currentActiveViews).to.equal([view]);
      stub(region['components'], 'get')
        .withArgs(view)
        .returns({} as any);
      //   when(<any>jest.spyOn(region["components"], "get"))
      //     .calledWith(view)
      //     .mockReturnValue(<any>component);
      region.deactivate(view);
      expect(region.currentActiveViews.indexOf(view)).to.be.equal(-1);
      region['activeViews'] = [view];
      expect(region.currentActiveViews).to.equal([view]);
      region.deactivate(mockViewName);
      expect(region.currentActiveViews.indexOf(view)).to.be.equal(-1);
    });
    it('should deactivate component', () => {
      const region = regionFactory();
      const view = {};
      const component = <ViewComponent>{};
      region['views'] = {[mockViewName]: view};
      region['activeViews'] = [view];
      //   when(<any>jest.spyOn(region["components"], "get"))
      //     .calledWith(view)
      //     .mockReturnValue(<any>component);
      stub(region['components'], 'get')
        .withArgs(view)
        .returns(component as any);
      region.deactivate(view);
      expect(component.active).to.be.equal(false);
      region['activeViews'] = [view];
      region.deactivate(mockViewName);
      expect(component.active).to.be.equal(false);
    });
    it('should notify adapter', () => {
      const region = regionFactory();
      const view = {};
      const component = <ViewComponent>{};
      region['views'] = {[mockViewName]: view};
      region['activeViews'] = [view];
      //   when(<any>jest.spyOn(region["components"], "get"))
      //     .calledWith(view)
      //     .mockReturnValue(<any>component);
      stub(region['components'], 'get')
        .withArgs(view)
        .returns(component as any);
      region.deactivate(view);
      //   expect(region.adapter.deactivateView).toBeCalledWith(<any>component);
      assert(deactivateView.calledWith(component));
      region['activeViews'] = [view];
      //   jest.restoreAllMocks();
      region.deactivate(mockViewName);
      //   expect(region.adapter.deactivateView).toBeCalledWith(<any>component);
      assert(deactivateView.calledWith(component));
    });
    it('should not deactivate component neither notify adapter if component related to view not found', () => {
      const region = regionFactory();
      const view = {};
      region.deactivate(view);
      //   expect(region.adapter.deactivateView).not.toBeCalled();
      assert(deactivateView.notCalled);
      region.deactivate(mockViewName);
      //   expect(region.adapter.deactivateView).not.toBeCalled();
      assert(deactivateView.notCalled);
    });
  });
  it('contains view test', () => {
    const region = regionFactory();
    const view = {};
    region['views']['my-view'] = view;
    expect(region.containsView('my-view2')).to.be.equal(false);
    expect(region.containsView(<any>{})).to.be.equal(false);
    expect(region.containsView('my-view')).to.be.equal(true);
    expect(region.containsView(view)).to.be.equal(true);
  });
  describe('isAtiveView suite', () => {
    it('should raise exception if view does not exists', () => {
      const region = regionFactory();
      //   jest.spyOn(region, "containsView").mockReturnValue(false);
      stub(region, 'containsView').returns(false);
      expect(() => region.isViewActive('my-view2')).throws(
        `region ${mockReginnName} doest not contain this view`
      );
      expect(() => region.isViewActive({})).throws(
        `region ${mockReginnName} doest not contain this view`
      );
      //   jest.resetAllMocks();
      //   jest.restoreAllMocks();
      //   jest.spyOn(region, "containsView").mockReturnValue(true);
      stub(region, 'containsView').returns(true);
      expect(() => region.isViewActive('my-view2')).not.throws();
      expect(() => region.isViewActive({})).not.throws();
    });
    it('should return true if is in activeView list', () => {
      const view: any = {};
      const region = regionFactory();
      region['views'] = {[mockViewName]: view};
      region['activeViews'] = [view];
      //   jest.spyOn(region, "containsView").mockReturnValue(true);
      stub(region, 'containsView').returns(true);
      expect(region.isViewActive(mockViewName)).to.be.equal(true);
      expect(region.isViewActive(view)).to.be.equal(true);
      expect(region.isViewActive('my-view-fake')).to.be.equal(false);
      expect(region.isViewActive({})).to.be.equal(false);
    });
  });
  describe('toggleViewActive', () => {
    it('should raise exception if view does not exists', async () => {
      /*const region = regionFactory();
            jest.spyOn(region, 'containsView').mockReturnValue(false);
            expect(async() => await region.toggleViewActive('my-view2')).throws(`region ${mockReginnName} doest not contain this view`);
            expect(async () => await region.toggleViewActive({})).throws(`region ${mockReginnName} doest not contain this view`);
            jest.resetAllMocks();
            jest.restoreAllMocks();
            jest.spyOn(region, 'containsView').mockReturnValue(true);
            jest.spyOn(region, 'activate');
            jest.spyOn(region, 'deactivate');
            expect(async () => await region.toggleViewActive('my-view2')).not.throws(Error);
            expect(async() => await region.toggleViewActive({})).not.throws(Error);*/
    });
    it('should call deactivate view if view is active', async () => {
      const region = regionFactory();
      //   jest.spyOn(region, "containsView").mockReturnValue(true);
      stub(region, 'containsView').returns(true);
      //   jest.spyOn(region, "isViewActive").mockReturnValue(true);
      stub(region, 'isViewActive').returns(true);
      const activateSpy = stub(region, 'activate');
      const deactivateSpy = spy(region, 'deactivate');

      const result = await region.toggleViewActive(mockViewName);

      expect(result).to.be.equal(false);
      //   expect(deactivateSpy).toBeCalledWith(mockViewName);
      assert(deactivateSpy.calledWith(mockViewName));
      //   expect(activateSpy).not.toBeCalled();
      assert(activateSpy.notCalled);
    });
    it('should call activate view if view is not active', async () => {
      /*const region = regionFactory();
            jest.spyOn(region, 'containsView').mockReturnValue(true);
            jest.spyOn(region, 'isViewActive').mockReturnValue(false);
            const activateSpy = jest.spyOn(region, 'activate');
            const deactivateSpy = jest.spyOn(region, 'deactivate');

            const result = await region.toggleViewActive(mockViewName);

            expect(result).to.be.equal(true);
            expect(activateSpy).toBeCalledWith(mockViewName);
            expect(deactivateSpy).not.toBeCalled();*/
    });
  });
});
/**TODO**/
/** Test view is instantiated on activate**/
