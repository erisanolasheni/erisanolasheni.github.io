alert('toc.js')

---
layout: null
---
var docstoc = {{ site.data.toc | jsonify }}
renderNav(docstoc);
