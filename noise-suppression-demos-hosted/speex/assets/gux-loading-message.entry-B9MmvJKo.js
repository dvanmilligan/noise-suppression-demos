import{r as a,h as e,g as i}from"./index-CV4KLuUB.js";import{t as g}from"./usage-6129fffe-6kP8_2TX.js";import"vite-plugin-node-polyfills/shims/process";import"vite-plugin-node-polyfills/shims/buffer";const r=`:host {
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
  max-width: var(--gse-ui-progressAndLoading-loadingState-large-width);
  color: var(--gse-ui-progressAndLoading-textColor);
  text-align: center;
}

@container (width > 400px) {
  .gux-container .gux-primary-message {
    margin-top: var(--gse-ui-progressAndLoading-large-gap);
    font-family: var(--gse-ui-progressAndLoading-loadingState-large-header-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-large-header-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-large-header-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-large-header-lineHeight);
  }
  .gux-container .gux-additional-guidance {
    margin-top: var(--gse-ui-progressAndLoading-large-gapText);
    font-family: var(--gse-ui-progressAndLoading-loadingState-large-subheader-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-large-subheader-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-large-subheader-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-large-subheader-lineHeight);
  }
}
@container (width > 200px) and (width <=400px) {
  .gux-container .gux-primary-message {
    margin-top: var(--gse-ui-progressAndLoading-medium-gap);
    font-family: var(--gse-ui-progressAndLoading-loadingState-medium-header-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-medium-header-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-medium-header-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-medium-header-lineHeight);
  }
  .gux-container .gux-additional-guidance {
    margin-top: var(--gse-ui-progressAndLoading-medium-gapText);
    font-family: var(--gse-ui-progressAndLoading-loadingState-medium-subheader-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-medium-subheader-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-medium-subheader-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-medium-subheader-lineHeight);
  }
}
@container (width <=200px) {
  .gux-container .gux-primary-message {
    margin-top: var(--gse-ui-progressAndLoading-small-gap);
    font-family: var(--gse-ui-progressAndLoading-loadingState-small-header-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-small-header-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-small-header-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-small-header-lineHeight);
  }
  .gux-container .gux-additional-guidance {
    margin-top: var(--gse-ui-progressAndLoading-small-gapText);
    font-family: var(--gse-ui-progressAndLoading-loadingState-small-subheader-fontFamily);
    font-size: var(--gse-ui-progressAndLoading-loadingState-small-subheader-fontSize);
    font-weight: var(--gse-ui-progressAndLoading-loadingState-small-subheader-fontWeight);
    line-height: var(--gse-ui-progressAndLoading-loadingState-small-subheader-lineHeight);
  }
}`,t=r,o=class{constructor(n){a(this,n)}componentWillLoad(){g(this.root)}render(){return e("div",{key:"33277af46593927d8973743ddcbded04e4b4783a",class:"gux-container",role:"alert","aria-live":"assertive"},e("div",{key:"68bbcba983f3ac24cf94fcc6605b6dc41dbf5b73",class:"gux-progress"},e("slot",{key:"e3f43dd8df60f685f870c62de67c615276cd52fc",name:"progress"})),e("div",{key:"0c8feb14ba005c1a3805bbf71167d7d7ab155ab1",class:"gux-primary-message"},e("slot",{key:"083bbe256926363be8fc00f094ab8f31e048d717",name:"primary-message"})),e("div",{key:"2852d9fbc9623912ff43259a499d81a14d29bbef",class:"gux-additional-guidance"},e("slot",{key:"3ba735caeb77b462151e71c1652fdfdc064c2a13",name:"additional-guidance"})))}get root(){return i(this)}};o.style=t;export{o as gux_loading_message};
