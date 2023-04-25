import { getWidget, setActive } from "../../libs/afb-interaction.js";
import { DefaultField } from "../defaultInput.js";
import * as builder from "../../libs/afb-builder.js";

export class Range extends DefaultField {

    blockName = 'cmp-adaptiveform-textinput'
     
    addListener() {
        if(this.element) {
            let widget = getWidget(this.block);

            widget?.addEventListener('change', (e) => {
                let hover = this.element.querySelector(`.${this.blockName}__widget-value`);
                let state = this.model?.getState();

                this.model.value = e.target.value;
                this.element && setActive(this.element, false);
                this.#updateView(state, hover, e.target);
            });

            widget?.addEventListener('focus', (e) => {
                this.element && setActive(this.element, true);    
            });
        }
    }

    #getFormattedValue(state, value) {
        return state?.displayFormat ? state?.displayFormat.replace("{}", value) : value;
    }

    /**
     * updates the hover as per widget value and style the hover accordingly.
     * @param {*} state
     * @param {HTMLSpanElement} hover 
     * @param {HTMLInputElement} widget 
     */
    #updateView(state, hover, widget) {
        try {
            let min = Number(widget.min) || 0;
            let max = Number(widget.max) || 1;
            let value = Number(widget.value) || 0;
            let step = Number(widget.step) || 1;
    
            let totalSteps = Math.ceil((max - min)/step);
            let currStep = Math.ceil((value - min)/step);
    
            if(hover) {
                hover.textContent = this.#getFormattedValue(state, value);
                hover.style.left = `calc(${currStep}*(100%/${totalSteps + 1}))`;
            }
            widget.setAttribute("style", "background-image: linear-gradient(to right, #78be20 " + 100*(currStep/totalSteps) + "%, #C5C5C5 " + 100*(currStep/totalSteps) + "%)");
        } catch(err) {
            console.error(err);
        }
    }

    renderInput(state, bemBlock) {
        let input =  builder?.default?.defaultInputRender(state, bemBlock);

        let div = document.createElement("div");
        div.className = `${bemBlock}__widget-wrapper`;

        let hover = document.createElement("span");
        hover.className = `${bemBlock}__widget-value`;
        this.#updateView(state, hover, input);

        let min = document.createElement("span");
        min.className = `${bemBlock}__widget-min`;
        min.textContent = this.#getFormattedValue(state, input.min);

        let max = document.createElement("span");
        max.className = `${bemBlock}__widget-max`;
        max.textContent = this.#getFormattedValue(state, input.max);
        
        div.append(hover, input, min, max);
        return div;
    }

    renderElement() {
        return builder?.default?.renderField(this.model, this.blockName, this.renderInput.bind(this));
    }
}

export default async function decorate(block, model) {
    let range = new Range(block, model);
    range.render();
}
