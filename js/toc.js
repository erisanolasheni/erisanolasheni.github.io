---
layout: null
---
var docstoc = {{ site.data.toc | jsonify }}

console.log(renderNav(docstoc));
