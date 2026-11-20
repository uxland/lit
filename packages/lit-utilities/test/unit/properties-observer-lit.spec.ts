import {expect, fixture, html} from '@open-wc/testing';
import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {spy} from 'sinon';
import {listen} from '../../src/listen';
import {propertiesObserver} from '../../src/properties-observer';

class ObservedElement extends propertiesObserver(LitElement) {
  @property()
  name: string;

  @property({
    hasChanged: (value: string, old: string) => value?.toLowerCase() !== old?.toLowerCase(),
  })
  caseInsensitive: string;

  nameChanged(_current: string, _previous: string) {}
  caseInsensitiveChanged(_current: string, _previous: string) {}
}
customElements.define('observed-element', ObservedElement);

class ListeningElement extends LitElement {
  clicks = 0;
  render() {
    return html`<button id="btn">click</button>`;
  }
  @listen('click', '#btn')
  onClick() {
    this.clicks++;
  }
}
customElements.define('listening-element', ListeningElement);

describe('propertiesObserver on a LitElement', () => {
  it('calls <prop>Changed when a reactive property changes', async () => {
    const el = await fixture<ObservedElement>(html`<observed-element></observed-element>`);
    const changed = spy(el, 'nameChanged');
    el.name = 'a';
    el.name = 'b';
    el.name = 'b';
    expect(changed.args).to.deep.equal([
      ['a', undefined],
      ['b', 'a'],
    ]);
  });

  it("honours the property's own hasChanged", async () => {
    const el = await fixture<ObservedElement>(html`<observed-element></observed-element>`);
    const changed = spy(el, 'caseInsensitiveChanged');
    el.caseInsensitive = 'Hello';
    el.caseInsensitive = 'HELLO';
    expect(changed.args).to.deep.equal([['Hello', undefined]]);
  });
});

describe('listen on a LitElement', () => {
  it('subscribes the handler to elements of the shadow root', async () => {
    const el = await fixture<ListeningElement>(html`<listening-element></listening-element>`);
    el.shadowRoot.querySelector<HTMLButtonElement>('#btn').click();
    expect(el.clicks).to.equal(1);
  });
});
