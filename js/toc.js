---
layout: null
---
var docstoc = {{ site.data.toc | jsonify }}
alert(docstoc)
renderNav(docstoc);
