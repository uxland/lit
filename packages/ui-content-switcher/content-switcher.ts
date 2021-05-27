import {css, html, LitElement, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
// import * as animations from './animations';
import {template} from './template';
const styles = `:host {
  display: flex;
  flex: 1;
}
:host > ::slotted(:not(slot):not(.selected)) {
  display: none !important;
}
`;
const isSelected = (item: HTMLElement, attrForSelected: string, selection: string) =>
  item[attrForSelected] === selection ||
  Array.from(item.attributes).some(
    attr => attr.name === attrForSelected && attr.value === selection
  );

/**
 * `uxl-content-switcher`
 * A content switcher with animations component
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

@customElement('uxl-content-switcher')
export class UxlContentSwitcher extends LitElement {
  render() {
    return html` ${template()} `;
  }

  static get styles() {
    return css`
      ${unsafeCSS(styles)}
    `;
  }

  @property()
  selected: any;

  @property()
  attrForSelected: string;

  @property()
  animation = 'fade';

  updated(props): any {
    this.select();
  }

  get items(): HTMLCollection {
    return this.children;
  }

  selectIndex() {
    return this.selected || this.selected == 0
      ? this.attrForSelected
        ? Array.from(this.items).findIndex((item: any) =>
            isSelected(item, this.attrForSelected, this.selected)
          )
        : parseInt(this.selected)
      : -1;
  }

  select() {
    if (this.items.length) {
      const index = this.selectIndex();
      if (index != -1) {
        const items = Array.from(this.items);
        items.forEach(i => i.classList.remove('selected'));
        items[index].classList.add('selected');
        this.doAnimation(items[index]);
      }
    }
  }

  doAnimation(item) {
    switch (this.animation) {
      case 'fade':
        // return animations.fadeInAnimation(item, parseInt(this.duration));
        return item && item.classList.add('fade-in');
      case 'slideDown':
        // return animations.slideDownAnimation(item, parseInt(this.duration));
        return item && item.classList.add('slide-down');
      case 'slideLeft':
        // return animations.slideLeftAnimation(item, parseInt(this.duration));
        return item && item.classList.add('slide-left');
      case 'slideRight':
        // return animations.slideRightAnimation(item, parseInt(this.duration));
        return item && item.classList.add('slide-right');
      case 'disabled':
        return;
      default:
        return item && item.classList.add('fade-in');
      // return animations.fadeInAnimation(item, parseInt(this.duration));
    }
  }
}
