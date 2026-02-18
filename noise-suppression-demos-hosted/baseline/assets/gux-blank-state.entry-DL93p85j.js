import{r as c,h as e,g as u}from"./index-d9wy7qxQ.js";import{t as f}from"./usage-6129fffe-6kP8_2TX.js";import{O as b}from"./on-mutation-1355c534-BWobL9kd.js";import{h as g}from"./has-slot-f24a46a6-D7GdaS0G.js";import"vite-plugin-node-polyfills/shims/process";import"vite-plugin-node-polyfills/shims/buffer";const h=`:host {
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
  background-color: var(--gse-ui-blankState-backgroundColor);
  border-radius: var(--gse-ui-blankState-borderRadius);
}
.gux-container .gux-image {
  padding-bottom: var(--gse-ui-blankState-gapMain);
}
.gux-container .gux-message {
  padding-bottom: var(--gse-ui-blankState-gapMessage);
}
.gux-container .gux-guidance {
  padding-bottom: var(--gse-ui-blankState-gapContent);
}
.gux-container ::slotted(gux-icon) {
  width: var(--gse-ui-blankState-icon-size-lg);
  height: var(--gse-ui-blankState-icon-size-lg);
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
    width: var(--gse-ui-blankState-icon-size-sm);
    height: var(--gse-ui-blankState-icon-size-sm);
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
}`,m=h;var p=function(t,a,o,i){var r=arguments.length,n=r<3?a:i===null?i=Object.getOwnPropertyDescriptor(a,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(t,a,o,i);else for(var l=t.length-1;l>=0;l--)(s=t[l])&&(n=(r<3?s(n):r>3?s(a,o,n):s(a,o))||n);return r>3&&n&&Object.defineProperty(a,o,n),n};const d=class{constructor(t){c(this,t),this.hasCallToAction=!1}onMutation(){this.hasCallToAction=g(this.root,"call-to-action")}renderCallToActionSlot(){if(this.hasCallToAction)return e("gux-button-slot",{accent:"primary"},e("slot",{name:"call-to-action"}))}componentWillLoad(){f(this.root),this.hasCallToAction=g(this.root,"call-to-action")}render(){return e("div",{key:"575ca29cba9f2d617b8b2c65bb054204e7aa411c",class:"gux-container"},e("div",{key:"6e327d20d21eef32f6f24bb63473340091e3deab",class:"gux-image"},e("slot",{key:"7b5d67578ea392eac4a5ff9c18939cdc790f42a7",name:"image"})),e("div",{key:"d932ec19493d5a7507f664427250ee7118ecfa16",class:"gux-message"},e("slot",{key:"eced123b60f15a4fa026f7d15a42ef623aeb22e1",name:"primary-message"})),e("div",{key:"813c7f55583a0d75473f7a2c0d6b8a7cec08a4f0",class:"gux-guidance"},e("slot",{key:"eb2a777a3cdfad4ca6d32f3641fb601df3184664",name:"additional-guidance"})),this.renderCallToActionSlot())}get root(){return u(this)}};p([b({childList:!0,subtree:!0})],d.prototype,"onMutation",null);d.style=m;export{d as gux_blank_state};
