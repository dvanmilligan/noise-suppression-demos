import{r as s,c as o,h as i,g as p}from"./index-RhTaIPoL.js";import{t as a}from"./usage-BYFiy2rf-lhiVWKSr.js";import"vite-plugin-node-polyfills/shims/process";import"vite-plugin-node-polyfills/shims/buffer";const n=`:host{display:flex;flex-direction:column}:host .gux-stepper{display:flex;block-size:100%}:host .gux-stepper.gux-stepper-horizontal{flex-direction:row;--stepper-min-inline-size:var(--gse-ui-stepper-step-horizontal-minWidth);--stepper-min-block-size:var(--gse-ui-stepper-step-horizontal-minHeight);--step-gap:var(--gse-ui-stepper-step-gap);--stepper-padding-block:var(--gse-ui-stepper-step-horizontal-gap) 0;--stepper-border-block-start-incomplete:var(
      --gse-ui-stepper-bar-horizontal-height
    )
    var(--gse-ui-stepper-bar-incompleted-foregroundColor) solid;--stepper-border-block-start-completed:var(
      --gse-ui-stepper-bar-horizontal-height
    )
    var(--gse-ui-stepper-icon-completed-selectedForegroundColor) solid;--stepper-border-block-start-error:var(
      --gse-ui-stepper-bar-horizontal-height
    )
    var(--gse-ui-stepper-bar-error-foregroundColor) solid;--stepper-border-block-start-active:var(
      --gse-ui-stepper-bar-horizontal-height
    )
    var(--gse-ui-stepper-bar-active-foregroundColor) solid}:host .gux-stepper.gux-stepper-vertical{flex-direction:column;--step-gap:var(--gse-ui-stepper-step-vertical-gap);--stepper-min-block-size:var(--gse-ui-stepper-step-vertical-minHeight);--stepper-min-inline-size:var(--gse-ui-stepper-step-vertical-minWidth);--stepper-padding-inline:var(--gse-ui-stepper-step-vertical-gap) 0;--stepper-border-inline-start-incomplete:var(
      --gse-ui-stepper-bar-horizontal-height
    )
    var(--gse-ui-stepper-bar-incompleted-foregroundColor) solid;--stepper-border-inline-start-completed:var(
      --gse-ui-stepper-bar-horizontal-height
    )
    var(--gse-ui-stepper-icon-completed-selectedForegroundColor) solid;--stepper-border-inline-start-error:var(
      --gse-ui-stepper-bar-horizontal-height
    )
    var(--gse-ui-stepper-bar-error-foregroundColor) solid;--stepper-border-inline-start-active:var(
      --gse-ui-stepper-bar-horizontal-height
    )
    var(--gse-ui-stepper-bar-active-foregroundColor) solid;--stepper-step-body-margin:var(
    --gse-ui-stepper-step-vertical-body-marginTop
  )}`,l=class{constructor(e){s(this,e),this.guxactivestepchange=o(this,"guxactivestepchange",7),this.orientation="horizontal",this.disabled=!1,this.stepList=[]}onInternalActiveStepChange(e){e.stopPropagation();const t=e==null?void 0:e.detail;this.activateStep(t,this.stepList)}watchActiveStep(e){this.activateStep(e,this.stepList),this.guxactivestepchange.emit(e)}componentWillLoad(){a(this.root)}componentDidLoad(){this.activateStep(this.activeStepId,this.stepList),this.activeStepId&&this.guxactivestepchange.emit(this.activeStepId)}activateStep(e,t){e&&(this.activeStepId=e),t==null||t.forEach(r=>void r.guxSetActive(r.stepId===this.activeStepId))}onSlotChange(){const e=this.root.shadowRoot.querySelector("slot");this.stepList=e.assignedElements()}render(){return i("div",{key:"bfb5af8202e0964682be8a938c275c9bc13d558a",class:{"gux-stepper":!0,[`gux-stepper-${this.orientation}`]:!0}},i("slot",{key:"22dcd7b47d49dc1b769a9a26976f79892dacd278",onSlotchange:this.onSlotChange.bind(this)}))}get root(){return p(this)}static get watchers(){return{activeStepId:["watchActiveStep"]}}};l.style=n;export{l as gux_stepper_beta};
