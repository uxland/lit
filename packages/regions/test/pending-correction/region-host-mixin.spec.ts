class Base {
  disconnectedCallback() {
    console.log('disconnectedCallback');
  }
  shadowRoot = {
    querySelector: () => ({}),
  };
}

const regionManager = {add: () => this};
const adapterRegistry: any = {};
describe('Given a component that extends RegionHostMixin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it('should create defined regions', () => {
    /*class Component extends RegionHostMixin<Base>(<any>regionManager, adapterRegistry)(Base) {
        }

        const firstRegion = {name: 'region1', targetId: 'region#1'};
        const secondRegion = {name: 'region2', targetId: 'region#2'};
        Component[regionsProperty] = {firstRegion, secondRegion};
        const target1 = document.createElement('div');
        const target2 = document.createElement('div');

        const region1 = {};
        const region2 = {};

        let c = new Component();
        let regionFactoryStub = sinon.stub(regionFactory, 'regionFactory').withArgs(firstRegion, c, regionManager, adapterRegistry).returns(region1)
            .withArgs(secondRegion, c, regionManager, adapterRegistry).returns(region2);
        sinon.stub((<any>c).shadowRoot, 'querySelector').withArgs('region#1').returns(target1).withArgs('region#2').returns(target2);
        (c as Base).connectedCallback();
        expect(regionFactoryStub.calledOnceWith(firstRegion, target1, regionManager, adapterRegistry));
        expect(regionFactoryStub.calledOnceWith(secondRegion, target2, regionManager, adapterRegistry));
        expect(c['firstRegion']).to.be.equal(region1);
        expect(c['secondRegion']).to.be.equal(region2);*/
  });
  it('should attach behaviors if any', () => {
    /* class Component extends RegionHostMixin<Base>(<any>regionManager, adapterRegistry)(Base) {
        }
        const firstRegion = {name: 'region1', targetId: 'region#1'};
        const behaviors = [{attach: sinon.stub()}, {attach: sinon.stub()}];
        Component[regionsProperty] = {firstRegion};
        const region1 = {adapter: {behaviors}};
        sinon.stub(regionFactory, 'regionFactory').returns(region1);
        let c = new Component();
        (c as Base).connectedCallback();
        behaviors.forEach(b => expect(b.attach.calledOnce).to.be.true);*/
  });
  it('should remove region from region on disconnected', () => {
    // class Component extends regionHostMixin(
    //   <any>regionManager,
    //   adapterRegistry
    // )(<any>Base) {}
    // const firstRegion = { name: "region1", targetId: "region#1" };
    // const secondRegion = { name: "region2", targetId: "region#2" };
    // Component[regionsProperty] = { firstRegion, secondRegion };
    // let c: any = new Component();
    // c.firstRegion = { regionManager: { remove: jest.fn() } };
    // c.secondRegion = { regionManager: { remove: jest.fn() } };
    // (<Base>c).disconnectedCallback();
    // expect(c.firstRegion.regionManager.remove).toBeCalledTimes(1);
    // expect(c.secondRegion.regionManager.remove).toBeCalledTimes(1);
  });
  it('should dettach behaviors from region on disconnected', () => {
    // const behaviors = [{ detach: jest.fn() }, { detach: jest.fn() }];
    // class Component extends regionHostMixin(
    //   <any>regionManager,
    //   adapterRegistry
    // )(<any>Base) {}
    // const firstRegion = { name: "region1", targetId: "region#1" };
    // Component[regionsProperty] = { firstRegion };
    // let c: any = new Component();
    // c.firstRegion = {
    //   regionManager: { remove: jest.fn() },
    //   adapter: { behaviors },
    // };
    // (<Base>c).disconnectedCallback();
    // behaviors.forEach((b) => expect(b.detach).toBeCalledTimes(1));
  });
});
