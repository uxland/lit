import {assert, expect} from '@open-wc/testing';
import {stub} from 'sinon';
import {IRegionHost, RegionAdapterRegistry, regionFactory} from '../../src';
const regionName = 'region';

describe('when invoking `regionFactory` method', () => {
  beforeEach(() => {
    // jest.resetAllMocks();
    // jest.restoreAllMocks();
  });
  it('should create a new Region and add it to the regionManager', async () => {
    const regionManager: any = {add: stub()};
    const adapter = {};
    const registry = new RegionAdapterRegistry();
    const adapterFactory = stub().returns(adapter);
    stub(registry, 'getAdapterFactory').returns(adapterFactory);
    const target: IRegionHost = <any>document.createElement('div');
    const regionDefinition = {name: regionName, targetId: 'regionId'};
    const fn = stub();
    fn.withArgs('#regionId').returns(target);
    const host: any = {shadowRoot: {querySelector: fn}};

    const region = await regionFactory(regionDefinition, host, regionManager, registry);
    expect(region.name).to.equal(regionName);
    expect(region.regionManager).to.equal(regionManager);
    expect(region.host).to.equal(target);
    expect(target.uxlRegion).to.equal(region);
    expect(region.adapter).to.equal(adapter);
    assert(adapterFactory.calledWith(regionDefinition, target));
    assert(regionManager.add.calledWith(regionName, region));
  });
  it('should create a new RegionManager if scoped and add region to the scoped RegionManager', async () => {
    const scopedRegionManager = {add: stub()};
    const regionManager: any = {
      createRegionManager: stub().returns(scopedRegionManager),
    };
    const adapter = {};
    const registry = new RegionAdapterRegistry();
    const adapterFactory = stub().returns(adapter);
    stub(registry, 'getAdapterFactory').returns(adapterFactory);
    const target: IRegionHost = <any>document.createElement('div');
    const regionDefinition = {
      name: regionName,
      targetId: 'regionId',
      scoped: true,
    };
    const fn = stub();
    fn.withArgs('#regionId').returns(target);

    const host: any = {shadowRoot: {querySelector: fn}};
    const region = await regionFactory(regionDefinition, host, regionManager, registry);
    expect(region.regionManager).to.be.equal(scopedRegionManager);
    assert(scopedRegionManager.add.calledWith(regionName, region));
  });
  /* it('should raise error if no adapter factory for host', () => {
    const regionManager: any = {};
    const registry = new RegionAdapterRegistry();
    jest.spyOn(registry, 'getAdapterFactory').mockReturnValue(null);
    const target: IRegionHost = <any>document.createElement('div');
    const regionDefinition = { name: regionName, targetId: 'regionId' };
    const fn = jest.fn();
    when(fn)
      .calledWith('regionId')
      .mockReturnValue(target);
    const host: any = { shadowRoot: { querySelector: fn } };
    expect(() => regionFactory(regionDefinition, host, regionManager, registry)).toThrow('No region adapter factory found for the host');
  });
  it('should raise error if no adapter', () => {
    const regionManager: any = {};
    const registry = new RegionAdapterRegistry();
    //Adapter factory returns null
    const adapterFactory = jest.fn().mockReturnValue(null);
    jest.spyOn(registry, 'getAdapterFactory').mockReturnValue(adapterFactory);
    const target: IRegionHost = <any>document.createElement('div');
    const regionDefinition = { name: regionName, targetId: 'regionId' };
    const fn = jest.fn();
    when(fn)
      .calledWith('regionId')
      .mockReturnValue(target);

    const host: any = { shadowRoot: { querySelector: fn } };
    expect(() => regionFactory(regionDefinition, host, regionManager, registry)).toThrow('No region adapter found for the host');
  }); */
});
