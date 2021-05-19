import {html, LitElement} from 'lit';
import {stub} from 'sinon';
import {customElement, query} from '../../../../node_modules/lit/decorators';
import connect from '../../src/connect';
import {watch} from '../../src/watch';
import {configureStore} from '../utilities/mock-store';

const mockStore = configureStore([])();
const defaultComponentName = 'custom-element';
const getComponentName = (nameBase: string) => {
  let counter = 0;
  return () => `${nameBase}${++counter}`;
};
const getDefaultComponentName = getComponentName(defaultComponentName);

interface DefaultTestComponent {
  myProperty: string;
  header: HTMLHeadElement;
}
const propertySelector = stub(() => 'Hello from redux state');
const delay = () => new Promise(resolve => setTimeout(resolve, 300));
// @ts-ignore
const createDefaultComponent: (selector?: (state) => any) => DefaultTestComponent & LitElement = (
  selector = propertySelector
) => {
  const componentName = getDefaultComponentName();

  // @ts-ignore
  @customElement(componentName)
  class Component extends connect(mockStore)(LitElement) implements DefaultTestComponent {
    render() {
      return html`<h1 id="header">${this.myProperty}</h1>`;
    }
    @watch(selector, {store: mockStore})
    myProperty: string;
    @query('#header') header: any;
  }
  return componentName;
};

describe('connect mixin test suite', () => {
  afterEach(() => {
    //propertySelector.mockReset();
  });
  it('properties should be set when the component is created', async () => {
    // let componentName = createDefaultComponent();
    // const component = mount(`<${componentName}></${componentName}>`).node;
    // await delay();
    // assert(propertySelector.calledOnce);
    // await component.updateComplete;
    // expect(component.header.innerText).to.equal("Hello from redux state");
  });
});
