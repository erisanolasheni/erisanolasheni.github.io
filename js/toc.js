---
layout: null
---
var docstoc = {{ site.data.toc | jsonify }}

// console.log(renderNav);


document.getElementById('jsTOCLeftNav').innerHTML = JSON.strigify(docstoc);
	
