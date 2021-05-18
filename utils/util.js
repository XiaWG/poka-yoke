export const paramsStringify = (params = {}) => {
  const paramsArray = [];
  let values = '';
  Object.keys(params).forEach((k) => {
    switch (typeof params[k]) {
      case 'string':
        values = params[k].trim();
        break;
      case 'undefined':
        values = '';
        break;
      default:
        values = params[k];
        break;
    }
    paramsArray.push(`${k}=${encodeURIComponent(values)}`);
  });
  return paramsArray.join('&');
};


export const getLang = () => {
	const sys = uni.getSystemInfoSync()
	let lang = sys.language.toLowerCase()
	if (lang.startsWith('zh')) {
		return 'zh'
	}
	return 'en'
}

export const debounce = (fn, wait) => {
  var timeout = null
  return function() {
    if(timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}