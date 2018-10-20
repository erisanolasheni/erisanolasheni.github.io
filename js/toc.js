---
layout: null
---

var docstoc = {{ site.data.toc | jsonify }}

var collectionsTOC = new Array()
collectionsTOC["library"] = [
  
]


var outputHorzTabs = new Array();
var outputLetNav = new Array();
var totalTopics = 0;
var currentSection;
var sectionToHighlight;



function renderTopicsByTagTable(tagToLookup,divID)
{
  var matchingPages = new Array();
  for (i=0;i<pages.length;i++)
  {
    thisPage = pages[i];
    if (thisPage.keywords)
    {
      var keywordArray = thisPage.keywords.toString().split(",");
      for (n=0;n<keywordArray.length;n++)
      {
        if (keywordArray[n].trim().toLowerCase()==tagToLookup.toLowerCase())
        {
          matchingPages.push(i); // log the id of the page w/matching keyword
        }
      }
    }
  }
  var pagesOutput = new Array();
  if (matchingPages.length > 0)
  {
    pagesOutput.push("<h2>Pages tagged with: " + tagToLookup + "</h2>");
    pagesOutput.push("<table><thead><tr><td>Page</td><td>Description</td></tr></thead><tbody>");
    for(i=0;i<matchingPages.length;i++) {
      thisPage = pages[matchingPages[i]];
      pagesOutput.push("<tr><td><a href='" + thisPage.url + "'>" + thisPage.title + "</a></td><td>" + thisPage.description + "</td></tr>");
    }
    pagesOutput.push("</tbody></table>");
  }
  $("#" + divID).html(pagesOutput.join(""));
}

var tagToLookup;
function renderTagsPage()
{
  if(window.location.pathname.indexOf("/glossary/")>-1 || window.location.pathname.indexOf("/search/")>-1)
  {
    if (window.location.pathname.indexOf("/glossary/")>-1)
    {
      // Get ?term=<value>
      tagToLookup = decodeURI(queryString().term);
      $("#keyword").html(tagToLookup);
    }
    else
    {
      // Get ?q=<value>
      tagToLookup = decodeURI(queryString().q);
    }
    // Get the term and definition
    for (i=0;i<glossary.length;i++)
    {
      if (glossary[i].term.toLowerCase()==tagToLookup.toLowerCase())
      {
        var glossaryOutput = glossary[i].def;
      }
    }
    if (glossaryOutput) {
      $("#glossaryMatch").html("<h2>Definition of: " + tagToLookup + "</h2>" + glossaryOutput);
    }
    renderTopicsByTagTable(tagToLookup,"topicMatch",true);
  }
}


function findMyTopic(tree)
{
  function processBranch(branch)
  {
    for (var k=0;k<branch.length;k++)
    {
      if (branch[k].section) {
        processBranch(branch[k].section);
      } else {
        if (branch[k].path == pageURL && !branch[k].nosync)
        {
          // console.log(branch[k].path + ' was == ' + pageURL)
          thisIsIt = true;
          break;
        } else {
          // console.log(branch[k].path + ' was != ' + pageURL)
        }
      }
    }
  }
  var thisIsIt = false;
  processBranch(tree)
  return thisIsIt;
}
function renderNav(docstoc) {
  for (i=0;i<docstoc.horizontalnav.length;i++)
  {
    if (docstoc.horizontalnav[i].node != "glossary")
    {
      currentSection = docstoc.horizontalnav[i].node;
      // build vertical nav
      var itsHere = findMyTopic(docstoc[docstoc.horizontalnav[i].node]);
      if (itsHere || docstoc.horizontalnav[i].path == pageURL)
      {
        walkTree(docstoc[docstoc.horizontalnav[i].node]);
      }
    }
    // build horizontal nav
    outputHorzTabs.push('<li id="' + docstoc.horizontalnav[i].node + '"');
    if (docstoc.horizontalnav[i].path==pageURL || docstoc.horizontalnav[i].node==sectionToHighlight)
    {
      outputHorzTabs.push(' class="active"');
    }
    outputHorzTabs.push('><a href="'+docstoc.horizontalnav[i].path+'">'+docstoc.horizontalnav[i].title+'</a></li>\n');
  }
  if (outputLetNav.length==0)
  {
    // didn't find the current topic in the standard TOC; maybe it's a collection;
    for (var key in collectionsTOC)
    {
      var itsHere = findMyTopic(collectionsTOC[key]);
      if (itsHere) {
        walkTree(collectionsTOC[key]);
        break;
      }
    }
    // either glossary was true or no left nav has been built; default to glossary
    // show pages tagged with term and highlight term in left nav if applicable
    renderTagsPage()
    for (var i=0;i<glossary.length;i++)
    {
      var highlightGloss = '';
      if (tagToLookup) highlightGloss = (glossary[i].term.toLowerCase()==tagToLookup.toLowerCase()) ? ' class="active currentPage"' : '';
      outputLetNav.push('<li><a'+highlightGloss+' href="/glossary/?term=' + glossary[i].term + '">'+glossary[i].term+'</a></li>');
    }
  }

  // alert(outputLetNav)
  document.getElementById('jsTOCHorizontal').innerHTML = outputHorzTabs.join('');
  document.getElementById('jsTOCLeftNav').innerHTML = outputLetNav.join('');
}
alert(JSON.stringify(docstoc))
renderNav(docstoc);
