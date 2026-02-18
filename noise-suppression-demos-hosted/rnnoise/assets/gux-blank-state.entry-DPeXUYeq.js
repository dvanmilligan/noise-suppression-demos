import{r as c,h as e,g as u}from"./index-RhTaIPoL.js";import{t as h}from"./usage-BYFiy2rf-lhiVWKSr.js";import{O as b}from"./on-mutation-D5H4nH4U-CeToMEmQ.js";import{h as l}from"./has-slot-qzV3vtOw-D7GdaS0G.js";import"vite-plugin-node-polyfills/shims/process";import"vite-plugin-node-polyfills/shims/buffer";const f=`:host {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  container-type: inline-size;
}

.gux-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--gse-ui-blankState-padding);
  color: var(--gse-ui-blankState-foregroundColor);
}
.gux-container .gux-image {
  padding-block-end: var(--gse-ui-blankState-gapMain);
}
.gux-container .gux-message {
  padding-block-end: var(--gse-ui-blankState-gapMessage);
}
.gux-container .gux-guidance {
  padding-block-end: var(--gse-ui-blankState-gapContent);
}
.gux-container ::slotted(gux-icon) {
  inline-size: var(--gse-ui-blankState-icon-size-lg);
  block-size: var(--gse-ui-blankState-icon-size-lg);
  color: var(--gse-ui-blankState-iconColor);
}
.gux-container slot[name=primary-message] {
  font-family: var(--gse-ui-progressAndLoading-blankState-large-header-fontFamily);
  font-size: var(--gse-ui-progressAndLoading-blankState-large-header-fontSize);
  font-weight: var(--gse-ui-progressAndLoading-blankState-large-header-fontWeight);
  line-height: var(--gse-ui-progressAndLoading-blankState-large-header-lineHeight);
  color: var(--gse-ui-blankState-foregroundColor);
  text-align: center;
}
.gux-container slot[name=additional-guidance] {
  font-family: var(--gse-ui-progressAndLoading-blankState-large-subheader-fontFamily);
  font-size: var(--gse-ui-progressAndLoading-blankState-large-subheader-fontSize);
  font-weight: var(--gse-ui-progressAndLoading-blankState-large-subheader-fontWeight);
  line-height: var(--gse-ui-progressAndLoading-blankState-large-subheader-lineHeight);
  color: var(--gse-ui-blankState-foregroundColor);
  text-align: center;
}

@container (width < 570px) {
  .gux-container ::slotted(gux-icon) {
    inline-size: var(--gse-ui-blankState-icon-size-sm);
    block-size: var(--gse-ui-blankState-icon-size-sm);
  }
  .gux-container slot[name=primary-message] {
    font-family: var(--gse-ui-progressAndLoading-blankState-small-header-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-blankState-small-header-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-blankState-small-header-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-blankState-small-header-lineHeight);
  }
  .gux-container slot[name=additional-guidance] {
    font-family: var(--gse-ui-progressAndLoading-blankState-small-subheader-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-blankState-small-subheader-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-blankState-small-subheader-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-blankState-small-subheader-lineHeight);
  }
}`;var m=function(t,a,i,o){var r=arguments.length,n=r<3?a:o===null?o=Object.getOwnPropertyDescriptor(a,i):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,a,i,o);else for(var g=t.length-1;g>=0;g--)(s=t[g])&&(n=(r<3?s(n):r>3?s(a,i,n):s(a,i))||n);return r>3&&n&&Object.defineProperty(a,i,n),n};const d=class{constructor(t){c(this,t),this.hasCallToAction=!1,this.hasGuidance=!1}onMutation(){this.hasCallToAction=l(this.root,"call-to-action"),this.hasGuidance=l(this.root,"additional-guidance")}renderCallToActionSlot(){if(this.hasCallToAction)return e("gux-button-slot",{accent:"primary"},e("slot",{name:"call-to-action"}))}renderGuidanceSlot(){if(this.hasGuidance)return e("div",{class:"gux-guidance"},e("slot",{name:"additional-guidance"}))}componentWillLoad(){h(this.root),this.hasCallToAction=l(this.root,"call-to-action"),this.hasGuidance=l(this.root,"additional-guidance")}render(){return e("div",{key:"db5dd10eeb4d665fa920a58b95ed223be4e67a1c",class:"gux-container"},e("div",{key:"eaa38b233aa64c6bb3fd1ebc7196b8cc589987e6",class:"gux-image"},e("slot",{key:"eca085bfa12501a4195e97d5b018342c7b66b494",name:"image"})),e("div",{key:"988bea1d9e5a91e81f7461cbab0c5e4ae95ad977",class:"gux-message"},e("slot",{key:"2d24bd404c19768082e6d0087859849b886c92b9",name:"primary-message"})),this.renderGuidanceSlot(),this.renderCallToActionSlot())}get root(){return u(this)}};m([b({childList:!0,subtree:!0})],d.prototype,"onMutation",null);d.style=f;export{d as gux_blank_state};
