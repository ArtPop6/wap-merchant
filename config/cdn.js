
const prod = process.env.NODE_ENV === 'production';

const version = pkg => require(`${pkg}/package.json`).version;
const jsfile = name => (prod ? `${name}.min.js` : `${name}.js`);
const bootcdn = (pkg, url) => `https://cdn.bootcss.com/${pkg}/${version(pkg)}/${url}`;
const ykcdn = (pkg, url) => `//play.yunkai.com/static/${pkg}/${version(pkg)}/${url}`;

const setCDN = (pkg, url) => {
  if (prod) return ykcdn(pkg, url);
  return bootcdn(pkg, url);
};

module.exports = {
  css: [],
  js: [
    '//res.wx.qq.com/open/js/jweixin-1.2.0.js',
    setCDN('vue', jsfile('vue.runtime')),
    setCDN('vuex', jsfile('vuex')),
  ],
};
