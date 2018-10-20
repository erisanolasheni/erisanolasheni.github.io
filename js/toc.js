---
layout: null
---
var docstoc = {{ site.data.toc | jsonify }}
alert('Hmmm'+docstoc)
renderNav(docstoc);
