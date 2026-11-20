import {expect} from '@open-wc/testing';
import {restore, spy, stub} from 'sinon';
import {IRegion, IRegionBehavior} from '../../../src';
import {AdapterBase} from '../../../src/adapters';
import {defaultBehaviorRegistry} from '../../../src/behaviors/default-registry';

class Behavior1 implements IRegionBehavior {
  constructor(public region: IRegion) {}
  attach(): Promise<void> {
    return Promise.resolve();
  }
  detach() {
    return Promise.resolve();
  }
}

class Behavior2 implements IRegionBehavior {
  constructor(public region: IRegion) {}
  attach(): Promise<void> {
    return Promise.resolve();
  }
  detach() {
    return Promise.resolve();
  }
}

describe('Given an instance of AdapterBase class', () => {
  afterEach(() => restore());

  describe('and behaviors are requested', () => {
    it('should initialize behaviors from default registry', () => {
      const region: any = {};
      stub(defaultBehaviorRegistry, 'behaviors').get(() => [Behavior1, Behavior2]);
      const adapter = new AdapterBase(<any>{uxlRegion: region});
      expect(adapter.behaviors.length).to.equal(2);
      expect(adapter.behaviors[0].constructor).to.equal(Behavior1);
      expect((adapter.behaviors[0] as Behavior1).region).to.equal(region);
      expect(adapter.behaviors[1].constructor).to.equal(Behavior2);
      expect((adapter.behaviors[1] as Behavior2).region).to.equal(region);
    });
    it('should create them lazily, only once, and cache them', () => {
      const getter = stub().returns([Behavior1]);
      stub(defaultBehaviorRegistry, 'behaviors').get(getter);
      const adapter = new AdapterBase(<any>{uxlRegion: {}});
      expect(getter.called).to.equal(false);
      const first = adapter.behaviors;
      const second = adapter.behaviors;
      expect(second).to.equal(first);
      expect(getter.calledOnce).to.equal(true);
    });
  });
  describe('and a view is activated', () => {
    const createHost = (contains: boolean) => ({
      appendChild: stub(),
      contains: stub().returns(contains),
      uxlRegion: {activate: stub(), deactivate: stub(), currentActiveViews: []},
    });
    it('should append view to host', async () => {
      const host = createHost(false);
      const adapter = new AdapterBase(<any>host);
      const view: any = document.createElement('div');
      await adapter.activateView(view);
      expect(host.appendChild.calledWith(view)).to.equal(true);
    });
    it('should not append view if already contained in host', async () => {
      const host = createHost(true);
      const adapter = new AdapterBase(<any>host);
      const view: any = document.createElement('div');
      await adapter.activateView(view);
      expect(host.appendChild.called).to.equal(false);
    });
    it('should set hidden atribute to false', async () => {
      const host = createHost(true);
      const adapter = new AdapterBase(<any>host);
      const view: any = document.createElement('div');
      view.hidden = true;
      await adapter.activateView(view);
      expect(view.hidden).to.equal(false);
    });
  });
  describe('and view is deactivated', () => {
    const createHost = () => ({
      removeChild: stub(),
      appendChild: stub(),
      contains: stub().returns(true),
      uxlRegion: {currentViews: [], viewRemovedFromDom: spy()},
    });
    describe('and view definition removeFromDOMwhenDeactivated` is true', () => {
      it('should remove view from host', async () => {
        const host = createHost();
        const view: any = document.createElement('div');
        view.view = {removeFromDomWhenDeactivated: true};
        await new AdapterBase(<any>host).deactivateView(view);
        expect(host.removeChild.calledWith(view)).to.equal(true);
      });
      it('should notify region', async () => {
        const host = createHost();
        const view: any = document.createElement('div');
        view.view = {removeFromDomWhenDeactivated: true};
        await new AdapterBase(<any>host).deactivateView(view);
        expect(host.uxlRegion.viewRemovedFromDom.calledWith(view.view)).to.equal(true);
      });
    });
    it('should set hidden attribute to true', async () => {
      const host = createHost();
      const view: any = document.createElement('div');
      view.view = {};
      await new AdapterBase(<any>host).deactivateView(view);
      expect(view.hidden).to.equal(true);
      expect(host.removeChild.called).to.equal(false);
    });
  });
});
