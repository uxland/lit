import {assert, expect} from '@open-wc/testing';
import {restore, stub} from 'sinon';
import {IRegionHost, RegionAdapterRegistry, regionFactory} from '../../src';
import {findRegionTarget} from '../../src/region-factory';
const regionName = 'region';

describe('when invoking `findRegionTarget` function', () => {
  it('should look in the renderRoot first', () => {
    const target = document.createElement('div');
    const renderRoot = {querySelector: stub().withArgs('#regionId').returns(target)};
    const host: any = {renderRoot, shadowRoot: {querySelector: stub()}};
    expect(findRegionTarget(host, 'regionId')).to.equal(target);
    assert(host.shadowRoot.querySelector.notCalled);
  });
  it('should fall back to the shadowRoot', () => {
    const target = document.createElement('div');
    const host: any = {shadowRoot: {querySelector: stub().withArgs('#regionId').returns(target)}};
    expect(findRegionTarget(host, 'regionId')).to.equal(target);
  });
  it('should fall back to the host itself (light DOM)', () => {
    const host = document.createElement('div');
    const target = document.createElement('span');
    target.id = 'regionId';
    host.appendChild(target);
    expect(findRegionTarget(host, 'regionId')).to.equal(target);
  });
  it('should escape the target id', () => {
    const host = document.createElement('div');
    const target = document.createElement('span');
    target.id = 'region:1';
    host.appendChild(target);
    expect(findRegionTarget(host, 'region:1')).to.equal(target);
  });
  it('should return null if not found', () => {
    expect(findRegionTarget(document.createElement('div'), 'nope')).to.equal(null);
  });
});

describe('when invoking `regionFactory` method', () => {
  afterEach(() => restore());
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
  it('should wait for host.updateComplete before looking for the target', async () => {
    const target: IRegionHost = <any>document.createElement('div');
    const regionManager: any = {add: stub()};
    const registry = new RegionAdapterRegistry();
    stub(registry, 'getAdapterFactory').returns(stub().returns({}));
    let rendered = false;
    const host: any = {
      updateComplete: new Promise<void>(resolve =>
        setTimeout(() => {
          rendered = true;
          resolve();
        }, 10)
      ),
      shadowRoot: {querySelector: () => (rendered ? target : null)},
    };
    const region = await regionFactory(
      {name: regionName, targetId: 'id'},
      host,
      regionManager,
      registry
    );
    expect(region).to.not.equal(undefined);
    expect(region.host).to.equal(target);
  });
  it('should use the definition adapterFactory if supplied', async () => {
    const adapter = {};
    const adapterFactory = stub().returns(adapter);
    const registry = new RegionAdapterRegistry();
    const getAdapterFactory = stub(registry, 'getAdapterFactory');
    const target: IRegionHost = <any>document.createElement('div');
    const regionManager: any = {add: stub()};
    const host: any = {shadowRoot: {querySelector: () => target}};
    const definition = {name: regionName, targetId: 'id', adapterFactory};
    const region = await regionFactory(definition, host, regionManager, registry);
    expect(region.adapter).to.equal(adapter);
    assert(adapterFactory.calledWith(definition, target));
    assert(getAdapterFactory.notCalled);
  });
  it('should warn and return undefined if the target is not found', async () => {
    const warn = stub(console, 'warn');
    const regionManager: any = {add: stub()};
    const host: any = {shadowRoot: {querySelector: () => null}};
    const region = await regionFactory(
      {name: regionName, targetId: 'missing'},
      host,
      regionManager,
      new RegionAdapterRegistry()
    );
    expect(region).to.equal(undefined);
    assert(warn.calledOnce);
    assert(regionManager.add.notCalled);
  });
  it('should raise error if no adapter factory for host', async () => {
    const registry = new RegionAdapterRegistry();
    stub(registry, 'getAdapterFactory').returns(null);
    const host: any = {shadowRoot: {querySelector: () => document.createElement('div')}};
    let error: Error | undefined;
    try {
      await regionFactory({name: regionName, targetId: 'id'}, host, <any>{}, registry);
    } catch (e) {
      error = e as Error;
    }
    expect(error?.message).to.contain('No region adapter factory found for the host');
  });
  it('should raise error if no adapter', async () => {
    const registry = new RegionAdapterRegistry();
    stub(registry, 'getAdapterFactory').returns(stub().returns(null));
    const host: any = {shadowRoot: {querySelector: () => document.createElement('div')}};
    let error: Error | undefined;
    try {
      await regionFactory({name: regionName, targetId: 'id'}, host, <any>{}, registry);
    } catch (e) {
      error = e as Error;
    }
    expect(error?.message).to.contain('No region adapter found for the host');
  });
});
