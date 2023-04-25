
import * as builder from "../../libs/afb-builder.js";
import { subscribe } from "../../libs/afb-interaction.js";
import { DefaultField } from "../defaultInput.js";

export class TextArea extends DefaultField {

     blockName = 'cmp-adaptiveform-textinput'
     
    /**
     * @param {any} state FieldJson
     * @param {string} bemBlock 
     * 
     * @return {Element}
     */
    createInputHTML = () => {
          return builder?.default?.defaultInputRender(this.model?.getState(), this.blockName, "textarea");
     }

    render() {
          this.element = builder?.default?.renderField(this.model, this.blockName, this.createInputHTML)
          this.block.appendChild(this.element);
          this.addListener();
          subscribe(this.model, this.element);
     }
}
export default async function decorate(block, model) {
    let textinput = new TextArea(block, model);
    textinput.render();
}
