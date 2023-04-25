import { DefaultField } from "../defaultInput.js";
import { getWidget, subscribe } from "../../libs/afb-interaction.js";
import { Constants } from "../../libs/constants.js";
import * as builder from "../../libs/afb-builder.js";
import { getLabelValue } from "../../libs/afb-model.js";

export class Checkbox {

    blockName = Constants.CHECKBOX;
    block;
    element;
    model;

    constructor(block, model) {
        this.block = block;
        this.model = model;
    }

    addListener() {
        getWidget(this.element)?.addEventListener("change", () => {
            let widget = getWidget(this.element);
            if(widget?.checked) {
                this.model.value = this.model.enum?.[0] || true;
            } else {
                this.model.value = this.model.enum?.[1]
            }
        });
    }

    renderField = (model) => {
        let state = model?.getState();

        let element = builder?.default?.createWidgetWrapper(state, this.blockName);
        let label = builder?.default?.createLabel(state, this.blockName);
        let input = builder?.default?.defaultInputRender(state, this.blockName);
        let longDesc = builder?.default?.createLongDescHTML(state, this.blockName);
        let help = builder?.default?.createQuestionMarkHTML(state, this.blockName);
        let error = builder?.default?.createErrorHTML(state, this.blockName);

        let div = document.createElement("div");
        div.className = this.blockName + "-item ";

        let span = document.createElement("span");
        span.textContent = getLabelValue(state)

        label ? label.textContent = "" : null;
        label ? div.appendChild(label) : null;
        input ?  label.append(input): null;
        span ?  label.append(span): null;
    
        div ? element.appendChild(div): null;
        longDesc ?  element.appendChild(longDesc) : null;
        help ? element.appendChild(help) : null;
        error? element.appendChild(error): null;
    
        return element;
    }

    updateValue = (element, value) => {
        let widget = getWidget(element);
        if(widget) {
            widget.checked = this.model.enum?.[0] == value || value === true
        }  
    } 

    render() {
        this.element = this.renderField(this.model)
        this.block.appendChild(this.element);
        this.addListener();
        subscribe(this.model, this.element, {value : this.updateValue});
    }
}

export default async function decorate(block, model) {
    let checkbox = new Checkbox(block, model);
    checkbox.render();
}
