import{r as a,h as e,g as i}from"./index-RhTaIPoL.js";import{t as g}from"./usage-BYFiy2rf-lhiVWKSr.js";import"vite-plugin-node-polyfills/shims/process";import"vite-plugin-node-polyfills/shims/buffer";const r=`:host {
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
  max-inline-size: var(--gse-ui-progressAndLoading-loadingState-large-width);
  color: var(--gse-ui-progressAndLoading-textColor);
  text-align: center;
}

@container (width > 400px) {
  .gux-container .gux-primary-message {
    margin-block-start: var(--gse-ui-progressAndLoading-large-gap);
    font-family: var(--gse-ui-progressAndLoading-loadingState-large-header-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-large-header-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-large-header-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-large-header-lineHeight);
  }
  .gux-container .gux-additional-guidance {
    margin-block-start: var(--gse-ui-progressAndLoading-large-gapText);
    font-family: var(--gse-ui-progressAndLoading-loadingState-large-subheader-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-large-subheader-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-large-subheader-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-large-subheader-lineHeight);
  }
}
@container (width > 200px) and (width <=400px) {
  .gux-container .gux-primary-message {
    margin-block-start: var(--gse-ui-progressAndLoading-medium-gap);
    font-family: var(--gse-ui-progressAndLoading-loadingState-medium-header-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-medium-header-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-medium-header-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-medium-header-lineHeight);
  }
  .gux-container .gux-additional-guidance {
    margin-block-start: var(--gse-ui-progressAndLoading-medium-gapText);
    font-family: var(--gse-ui-progressAndLoading-loadingState-medium-subheader-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-medium-subheader-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-medium-subheader-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-medium-subheader-lineHeight);
  }
}
@container (width <=200px) {
  .gux-container .gux-primary-message {
    margin-block-start: var(--gse-ui-progressAndLoading-small-gap);
    font-family: var(--gse-ui-progressAndLoading-loadingState-small-header-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-small-header-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-small-header-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-small-header-lineHeight);
  }
  .gux-container .gux-additional-guidance {
    margin-block-start: var(--gse-ui-progressAndLoading-small-gapText);
    font-family: var(--gse-ui-progressAndLoading-loadingState-small-subheader-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-small-subheader-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-small-subheader-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-small-subheader-lineHeight);
  }
}`,t=class{constructor(n){a(this,n)}componentWillLoad(){g(this.root)}render(){return e("div",{key:"13e9f3460fb15f49b2cad5e2e06042aa5ce277ac",class:"gux-container",role:"alert","aria-live":"assertive"},e("div",{key:"21ab3bf2c141147e6ad07ca33f275b8bfbbfbaca",class:"gux-progress"},e("slot",{key:"0199e680c356fb39752258ca839d6e9b1243a2a7",name:"progress"})),e("div",{key:"343f047a10681da9b721f279fd3f8bc08cc6d5ff",class:"gux-primary-message"},e("slot",{key:"e2402ab19c251795b618e3c0d71bb0644d69344e",name:"primary-message"})),e("div",{key:"a6fb8dc206582347872bbd4291ee23c7da83b7be",class:"gux-additional-guidance"},e("slot",{key:"13a9d18303109926ea5a4c3ec3dbfbd2aa541d21",name:"additional-guidance"})))}get root(){return i(this)}};t.style=r;export{t as gux_loading_message};
