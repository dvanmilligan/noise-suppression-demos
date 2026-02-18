function a(r,t,n){const l=t.currentTarget;let e=t.target;for(;e!==l&&e!==null;){if(e.matches(r))return n(e);e=e.parentElement}return null}export{a as w};
