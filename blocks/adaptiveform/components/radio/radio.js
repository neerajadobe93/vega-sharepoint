import {  getLayoutProperties, getTooltipValue, getViewId } from "../../libs/afb-model.js";
import { getWidget, subscribe } from "../../libs/afb-interaction.js";
import { Constants } from "../../libs/constants.js";
import * as builder from "../../libs/afb-builder.js";
import { Checkbox } from "../checkbox/checkbox.js";

export class Radio extends Checkbox {

    blockName = Constants.RADIO;

    updateValue = (element, value) => {
        let widget =  getWidget(element);
        widget.checked = this.model.enum?.[0] == value 
        if (widget.checked) {
            widget.setAttribute(Constants.HTML_ATTRS.CHECKED, Constants.HTML_ATTRS.CHECKED);
            widget.setAttribute(Constants.ARIA_CHECKED, true + "");
        } else {
            widget.removeAttribute(Constants.HTML_ATTRS.CHECKED);
            widget.setAttribute(Constants.ARIA_CHECKED, false + "");
        }
    }
}

export default async function decorate(block, model) {
    let radio = new Radio(block, model);
    radio.render();
}