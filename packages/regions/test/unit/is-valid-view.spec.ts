import {expect} from '@open-wc/testing';
import {validateView} from '../../src/validate-view';

describe('when invoking `validate view` function', () => {
  it('should return true if htmlTag is supplied', () => {
    expect(validateView({htmlTag: 'div'})).to.be.true;
  });
  it('should return true if factory is supplied', () => {
    expect(validateView({factory: () => <any>{}})).to.be.true;
  });
  it('should return true if element is supplied', () => {
    expect(validateView({element: window.document.createElement('div')})).to.be.true;
  });
  it('should raise error if no htmlTag an no element and no factory supplied', () => {
    expect(() => validateView({})).throws(
      'One of properties htmlTag, factory or element must be set'
    );
  });
  it('should raise error if htmlTag is not an string', () => {
    expect(() => validateView({htmlTag: <any>true})).throws('htmlTag property must be an string');
  });
  it('should raise error if factory is not a function', () => {
    expect(() => validateView({factory: <any>true})).throws('factory property must be a function');
  });
  it('should raise error if element is not an html element', () => {
    expect(() => validateView({element: <any>true})).throws(
      'element property must be an HTMLElement'
    );
  });
});
