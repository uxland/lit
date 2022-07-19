import {html, LitElement} from 'lit-element/lit-element.js'
import {region, regionHost, IRegion} from "@uxland/regions"
import React, {FunctionComponent} from 'react'
import ReactDOM from 'react-dom/client'

export const ReactRegionHost = (props: {name: string}) => {
    // Create a Lit-based RegionHost
    const tagName = props.name.toLowerCase() + '-host'
    if (!window.customElements.get(tagName)) {
        class MyHost extends regionHost(LitElement){
            protected createRenderRoot(): Element | ShadowRoot {
                // FIXME: @uxland/regions assumes we always use shadow root, by using the 'shadowRoot' property.
                // It should use the `renderRoot` property instead. For this demo, just hack it up.
                Object.defineProperty(this, 'shadowRoot', {value: this, writable: false})
                // Disable shadow root
                return this
            }
            render() {
                return html `<div class="uxl-region" id="${props.name}"></div>`
            }
            @region({name: props.name, targetId: props.name})
            myRegion: IRegion
        }

        window.customElements.define(tagName, MyHost);
    }

    return React.createElement(tagName, null, null)
}

export function viewify(x: FunctionComponent): HTMLElement {
    const domElement = document.createElement('div')
    ReactDOM.createRoot(domElement).render(React.createElement(x, null, null))
    return domElement
}
