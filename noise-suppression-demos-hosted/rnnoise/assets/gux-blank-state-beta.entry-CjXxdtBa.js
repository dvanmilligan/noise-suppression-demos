import{r as c,h as n,g as u}from"./index-RhTaIPoL.js";import{t as h}from"./usage-BYFiy2rf-lhiVWKSr.js";import{O as f}from"./on-mutation-D5H4nH4U-CeToMEmQ.js";import{h as t}from"./has-slot-qzV3vtOw-D7GdaS0G.js";import"vite-plugin-node-polyfills/shims/process";import"vite-plugin-node-polyfills/shims/buffer";const m=`:host {
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
.gux-container.gux-no-padding {
  padding: 0;
}
.gux-container .gux-call-to-actions {
  display: flex;
  flex-direction: column;
  gap: var(--gse-ui-blankState-gapCtaGroup);
  padding-block-start: var(--gse-ui-blankState-gapContent);
}
.gux-container .gux-image {
  padding-block-end: var(--gse-ui-blankState-gapMain);
}
.gux-container .gux-message {
  padding-block-end: var(--gse-ui-blankState-gapMessage);
}
.gux-container .gux-guidance {
  text-align: center;
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
.gux-container.gux-alignment-left {
  align-items: flex-start;
}
.gux-container.gux-alignment-left slot[name=primary-message],
.gux-container.gux-alignment-left slot[name=additional-guidance] {
  text-align: start;
}
.gux-container.gux-alignment-left .gux-guidance {
  text-align: start;
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
}`;var b=function(i,a,o,s){var r=arguments.length,e=r<3?a:s===null?s=Object.getOwnPropertyDescriptor(a,o):s,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(i,a,o,s);else for(var g=i.length-1;g>=0;g--)(l=i[g])&&(e=(r<3?l(e):r>3?l(a,o,e):l(a,o))||e);return r>3&&e&&Object.defineProperty(a,o,e),e};const d=class{constructor(i){c(this,i),this.hasCallToAction=!1,this.hasSecondaryCallToAction=!1,this.hasGuidance=!1,this.alignment="center",this.noPadding=!1}onMutation(){this.hasCallToAction=t(this.root,"call-to-action"),this.hasGuidance=t(this.root,"additional-guidance"),this.hasSecondaryCallToAction=t(this.root,"secondary-call-to-action")}renderImageSlot(){return n("slot",{name:"image"})}renderCallToActions(){if(this.hasCallToAction)return n("div",{class:"gux-call-to-actions"},this.hasCallToAction&&n("gux-button-slot",{accent:"primary"},n("slot",{name:"call-to-action"})),this.hasSecondaryCallToAction&&n("gux-button-slot",{accent:"ghost"},n("slot",{name:"secondary-call-to-action"})))}renderGuidanceSlot(){if(this.hasGuidance)return n("div",{class:"gux-guidance"},n("gux-truncate",{maxLines:3},n("slot",{name:"additional-guidance"})))}componentWillLoad(){h(this.root),this.hasCallToAction=t(this.root,"call-to-action"),this.hasGuidance=t(this.root,"additional-guidance"),this.hasSecondaryCallToAction=t(this.root,"secondary-call-to-action")}render(){return n("div",{key:"76a4a94fdc6424aafb3ce0b926dbb61d7f87a652",class:{"gux-container":!0,"gux-no-padding":this.noPadding,"gux-alignment-left":this.alignment==="left"}},n("div",{key:"f9d5741c1081f19a4c6b30b67dffe018253b7899",class:"gux-image"},this.renderImageSlot()),n("div",{key:"063fbfaba8846d98d2c7fe9b3187921b0a8e0e6c",class:"gux-message"},n("slot",{key:"73441c77dd3b8767d0635044b260b569683a4c13",name:"primary-message"})),this.renderGuidanceSlot(),this.renderCallToActions())}get root(){return u(this)}};b([f({childList:!0,subtree:!0})],d.prototype,"onMutation",null);d.style=m;export{d as gux_blank_state_beta};
