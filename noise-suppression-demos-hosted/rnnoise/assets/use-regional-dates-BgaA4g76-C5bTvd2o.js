const a=()=>!!document.cookie.split("; ").find(e=>e.startsWith("spark-enable-regional-dates")),n=()=>!!window.GUX_OPTIONS_enableRegionalDates;function t(){return!!a()||!!n()}export{t as u};
