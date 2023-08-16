import {assert, expect} from '@open-wc/testing';
import {spy} from 'sinon';
import {propertiesObserver} from '../../properties-observer';

describe('Given an instance of PropertiesObserver mixin', () => {
  class A extends propertiesObserver(<any>Object) {
    constructor(private _p1?: string, private _p2?: string) {
      super();
    }
    p1Changed(newValue, oldValue) {
      this._p1 = newValue;
    }
    p2Changed(newValue, oldValue) {
      this._p2 = newValue;
    }

    get p1(): string {
      return this._p1;
    }
    set p1(value: string) {
      const old = this._p1;
      this._p1 = value;
      this['requestUpdate']('p1', old);
    }
    get p2(): string {
      return this._p2;
    }
    set p2(value: string) {
      const old = this._p2;
      this._p2 = value;
      this['requestUpdate']('p2', old);
    }
  }
  it('it should invoke all xxxChanged when changes', () => {
    const a = new A();
    const p1Spy = spy(a, 'p1Changed');
    const p2Spy = spy(a, 'p2Changed');
    a.p1 = 'hello';
    a.p2 = 'bye';
    expect(p1Spy).to.have.been.calledWith('hello', undefined);
    expect(p2Spy).to.have.been.calledWith('bye', undefined);
  });
  it('should invoke only changed properties callbacks', () => {
    const a = new A();
    const p1Spy = spy(a, 'p1Changed');
    const p2Spy = spy(a, 'p2Changed');
    a.p1 = 'hello';
    expect(p1Spy).to.have.been.calledWith('hello', undefined);
    assert(p2Spy.notCalled);
    p1Spy.resetHistory();
    p2Spy.resetHistory();
    a.p2 = 'bye';
    expect(p2Spy).to.have.been.calledWith('bye', undefined);
    assert(p1Spy.notCalled);
  });
  it('should pass old value a second arg', () => {
    const a = new A('old hello', 'old bye');
    const p1Spy = spy(a, 'p1Changed');
    const p2Spy = spy(a, 'p2Changed');
    a.p1 = 'hello';
    a.p2 = 'bye';
    expect(p1Spy).to.have.been.calledWith('hello', 'old hello');
    expect(p2Spy).to.have.been.calledWith('bye', 'old bye');
  });
});
