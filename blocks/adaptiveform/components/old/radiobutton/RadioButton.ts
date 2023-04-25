import FormFieldBase from "../../models/FormFieldBase";
import { Constants } from "../../../constants";
import { getLayoutProperties } from "../../../lib-model";

export default class RadioButton extends FormFieldBase {

    static NS = Constants.NS;
    static IS = "adaptiveFormRadioButton";
    static bemBlock = 'cmp-adaptiveform-radiobutton';
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        widget: `.${RadioButton.bemBlock}__option__widget`,
        label: `.${RadioButton.bemBlock}__label`,
        description: `.${RadioButton.bemBlock}__longdescription`,
        qm: `.${RadioButton.bemBlock}__questionmark`,
        errorDiv: `.${RadioButton.bemBlock}__errormessage`,
        tooltipDiv: `.${RadioButton.bemBlock}__shortdescription`
    };

    constructor(params:any, model: any) {
        super(params, model);
        this.qm = this.element.querySelector(RadioButton.selectors.qm);
    }

    getWidget(): HTMLInputElement | null  {
        return this.element.querySelector(RadioButton.selectors.widget);
    }

    getWidgets(): NodeListOf<HTMLInputElement>  {
        return this.element.querySelectorAll(RadioButton.selectors.widget);
    }

    getDescription(): Element | null {
        return this.element.querySelector(RadioButton.selectors.description);
    }

    getLabel(): HTMLLabelElement | null {
        return this.element.querySelector(RadioButton.selectors.label);
    }

    getQuestionMarkDiv(): Element | null {
        return this.element.querySelector(RadioButton.selectors.qm);
    }

    getTooltipDiv(): Element | null {
        return this.element.querySelector(RadioButton.selectors.tooltipDiv);
    }

    getErrorDiv() {
        return this.element.querySelector(RadioButton.selectors.errorDiv);
    }
    _updateEnum(Enum: any): void {

    }

    _updateEnumNames(enumNames: any): void {
        //todo: remove extra options, fallback to enum if enumNames are not updated.
        document.querySelectorAll('.cmp-adaptiveform-radiobutton__option__label span').forEach((x,i) => {
            x.textContent = enumNames[i]
        })
    }

    _updateValue(modelValue: any) {
        if(modelValue != null) {
            this.getWidgets().forEach((widget: HTMLInputElement) => {
                if (widget.value != null && modelValue.toString() == widget.value.toString()) {
                    widget.checked = true;
                    widget.setAttribute(Constants.HTML_ATTRS.CHECKED, Constants.HTML_ATTRS.CHECKED);
                    widget.setAttribute(Constants.ARIA_CHECKED, true + "");
                } else {
                    widget.checked = false;
                    widget.removeAttribute(Constants.HTML_ATTRS.CHECKED);
                    widget.setAttribute(Constants.ARIA_CHECKED, false + "");
                }
            }, this)
        }
    }

    _updateEnabled(enabled: boolean) {
        this.toggle(enabled, Constants.ARIA_DISABLED, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enabled + "");
        let widgets = this.getWidgets();
        widgets?.forEach(widget => {
            if (enabled === false) {
                widget.setAttribute(Constants.HTML_ATTRS.DISABLED, true + "");
                widget.setAttribute(Constants.ARIA_DISABLED, true + "");
            } else {
                widget.removeAttribute(Constants.HTML_ATTRS.DISABLED);
                widget.removeAttribute(Constants.ARIA_DISABLED);
            }
        });
    }

    addListener(): void {
        this.getWidgets().forEach(widget => {
            widget.addEventListener('change', (e: any) => {
                this._model.value = e.target.value;
            });
        });
    }
    getbemBlock(): string {
        return RadioButton.bemBlock;
    }

    getIS() : string {
        return RadioButton.IS;
    }

    createInputHTML(): Array<Element> {
        let inputs:Array<Element> = [];
        this.state?.enum?.forEach((enumVal:string, index: number) => {
            inputs.push(this.createRadioButton(this, enumVal, this.state?.enumNames?.[index], index))
        })
        return inputs;
    }

    createRadioButton(radioButton: RadioButton, enumValue: string, enumDisplayName: string | undefined, index: number) : Element {
        let div = document.createElement("div");
        div.className = "cmp-adaptiveform-radiobutton__option " + getLayoutProperties(this.state)?.orientation;
        
        let label = document.createElement("label");
        label.className = "cmp-adaptiveform-radiobutton__option__label";
        label.title = radioButton.getTooltipValue();
        label.setAttribute("aria-label", enumDisplayName || enumValue);
        label.setAttribute("aria-describedby", "_desc");

        let input = document.createElement("input");
        input.type = "radio"
        input.name = radioButton.getName();
        input.className = "cmp-adaptiveform-radiobutton__option__widget";
        input.id = radioButton.getId() + "_" + index + "__widget";
        input.value = enumValue;
        input.checked = enumValue == this.getDefault();
        input.setAttribute("aria-describedby", "_desc");
        this.setDisabledAttribute(input);

        let span = document.createElement("span");
        span.textContent = enumDisplayName || enumValue;

        label.appendChild(input);
        label.appendChild(span);
        div.appendChild(label);

        return div;
    }
}