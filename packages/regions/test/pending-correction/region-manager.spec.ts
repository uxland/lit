import {assert, expect} from '@open-wc/testing';
import {spy, stub} from 'sinon';
import {IRegion} from '../../src/region';
import {regionManager, RegionManager} from '../../src/region-manager';

const mockRegionName = 'mock-region';
const mockViewName = 'my-view';
describe('Given an instance of RegionManager', () => {
  const mockRegion: IRegion = <any>{
    addView: () => {
      console.log('addview');
    },
  };
  const createMockRegion = () => {
    return <any>{
      addView: () => this,
    };
  };
  beforeEach(() => {
    // jest.restoreAllMocks();
    // jest.resetAllMocks();
  });
  describe('and a region is added', () => {
    it('should store it internally', () => {
      const regionManager = new RegionManager();
      regionManager.add(mockRegionName, mockRegion);
      expect(regionManager.getRegion(mockRegionName)).to.equal(mockRegion);
      const mockRegion2: IRegion = <any>{};
      regionManager.add('my-region2', mockRegion2);
      expect(regionManager.getRegion('my-region2')).to.equal(mockRegion2);
    });
    it('should raise error if already exists a region with the given name', () => {
      const regionManager = new RegionManager();
      regionManager.add(mockRegionName, mockRegion);
      expect(() => regionManager.add(mockRegionName, <any>{})).throws(Error);
    });
  });
  describe('and a region is removed', () => {
    it('should remove a region by name if argument is an string', () => {
      const regionManager = new RegionManager();
      regionManager.add(mockRegionName, mockRegion);
      expect(regionManager.getRegion(mockRegionName)).to.not.be.undefined;
      const result = regionManager.remove(mockRegionName);
      expect(regionManager.getRegion(mockRegionName)).to.be.undefined;
      expect(result).to.equal(mockRegion);
    });
    it('should remove a region if argument is an object', () => {
      const regionManager = new RegionManager();
      regionManager.add(mockRegionName, mockRegion);
      expect(regionManager.getRegion(mockRegionName)).to.not.be.undefined;
      const result = regionManager.remove(mockRegion);
      expect(regionManager.getRegion(mockRegionName)).to.be.undefined;
      expect(result).to.equal(mockRegion);
    });
    it('should return undefined if region does not exist', () => {
      const regionManager = new RegionManager();
      expect(regionManager.remove(mockRegionName)).to.be.undefined;
      expect(regionManager.remove(mockRegion)).to.be.undefined;
    });
    it('should remove region from registry', () => {
      const regionManager = new RegionManager();
      const spyFn = spy(mockRegion, 'addView');
      regionManager.add(mockRegionName, mockRegion);
      regionManager.remove(mockRegion);
      regionManager.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
      assert(spyFn.notCalled);
      regionManager.add(mockRegionName, mockRegion);
      regionManager.remove(mockRegionName);
      assert(spyFn.notCalled);
      (mockRegion.addView as any).restore();
    });
  });
  describe('and a view is added into a region', () => {
    it('should raise error if region does not exist', () => {
      const regionManager = new RegionManager();
      expect(() => regionManager.addViewToRegion(mockRegionName, mockViewName, <any>{})).throws(
        Error
      );
    });
    it('should invoke addView into the target region', () => {
      const spyFn = spy(mockRegion, 'addView');
      const view = <any>{};
      const regionManager = new RegionManager();
      const st = stub(regionManager, 'getRegion').returns(mockRegion);
      const result = regionManager.addViewToRegion(mockRegionName, mockViewName, view);
      expect(spyFn).to.be.calledWith(mockViewName, view);
      expect(result).to.equal(regionManager);
      (regionManager.getRegion as any).restore();
    });
  });
  describe('and a view is registered into a region', () => {
    it('should be added to view registry', () => {
      const view = <any>{};
      const regionManager = new RegionManager();
      const result = regionManager.registerViewWithRegion(mockRegionName, mockViewName, view);
      expect(
        regionManager.getRegisteredViews(mockRegionName).find(v => v.view === view)
      ).to.deep.equal({
        key: mockViewName,
        view,
      });
      expect(
        regionManager.getRegisteredViews(mockRegionName).find(v => v.key === mockViewName)
      ).to.deep.equal({
        key: mockViewName,
        view,
      });
      expect(result).to.deep.equal(regionManager);
    });
    it('should be added to view if region already exists', () => {
      const regionManager1 = new RegionManager();
      const regionManager2 = new RegionManager();
      const region1 = createMockRegion();
      const region2 = createMockRegion();
      const spy1 = spy(region1, 'addView');
      const spy2 = spy(region2, 'addView');
      regionManager1.add(mockRegionName, region1);
      regionManager2.add(mockRegionName, region2);
      const view = <any>{};
      regionManager1.registerViewWithRegion(mockRegionName, mockViewName, view);
      expect(spy1).to.be.calledWith(mockViewName, view);
      expect(spy2).to.be.calledWith(mockViewName, view);
    });
  });
  describe('and `clear` method is invoke', () => {
    it('should remove all regions', () => {
      const regionManager = new RegionManager();
      regionManager.add('region1', createMockRegion());
      regionManager.add('region2', createMockRegion());
      expect(regionManager.getRegion('region1')).to.not.be.undefined;
      expect(regionManager.getRegion('region2')).to.not.be.undefined;
      regionManager.clear();
      expect(regionManager.getRegion('region1')).to.be.undefined;
      expect(regionManager.getRegion('region2')).to.be.undefined;
    });
    it('should unregister regions', () => {
      const regionManager1 = new RegionManager();
      const regionManager2 = new RegionManager();
      const region1 = createMockRegion();
      const region2 = createMockRegion();
      const spy1 = spy(region1, 'addView');
      const spy2 = spy(region2, 'addView');
      regionManager1.add(mockRegionName, region1);
      regionManager2.add(mockRegionName, region2);
      regionManager2.clear();
      regionManager2.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
      assert(spy1.calledOnce);
      assert(spy2.notCalled);
    });
    it('should clear registry if it is main regionManager', () => {
      const regionManager1 = new RegionManager();
      const region1 = createMockRegion();
      const region2 = createMockRegion();
      const spy1 = spy(region1, 'addView');
      const spy2 = spy(region2, 'addView');
      regionManager1.add(mockRegionName, region1);
      regionManager.add(mockRegionName, region2);
      regionManager.clear();
      regionManager1.registerViewWithRegion(mockRegionName, mockViewName, <any>{});
      assert(spy1.notCalled);
      assert(spy2.notCalled);
    });
  });
});
