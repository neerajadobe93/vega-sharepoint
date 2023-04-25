/**
 * @param {any} state FieldJson
 * 
 * @return {boolean}
 */
export const isArrayType = (state) => {
    return state.type == "array" || state?.type?.includes("[]") || false;
}

/**
 * @param {any} state FieldJson
 * 
 * @return {boolean}
 */
 export const isLabelVisible = (state) => {
    return state?.label?.visible === true || state?.label?.visible === undefined;
 }
/**
 * @param {any} state FieldJson
 * 
 * @return {string}
 */
 export const getLabelValue = (state) => {
    return state?.label?.value || "";
 }

 /**
 * @param {any} state FieldJson
 * 
 * @return {boolean}
 */
 export const isTooltipVisible = (state) => {
    return getTooltipValue(state) ? true : false;
 }

 /**
 * @param {any} state FieldJson
 * 
 * @return {string}
 */
 export const getTooltipValue = (state) => {
    //@ts-ignore
    return state?.tooltip;
 }

/**
 * @param {any} state FieldJson
 * @param {string} bemBlock
 * 
 * @return {string}
 */
 export const getViewId = (state, bemBlock) => {
    return bemBlock +"-"+ state?.id;
 }

 
/**
 * @param {any} state FieldJson
 * 
 * @return {any}
 */
 export const getLayoutProperties = (state) => {
    let layoutProperties = {};
    if (state && state.properties && state.properties['afs:layout']) {
        layoutProperties =  state.properties['afs:layout'];
    }
    return layoutProperties;
}