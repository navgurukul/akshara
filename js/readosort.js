var urlEls = document.querySelectorAll("h3.r a");
var searchEls = document.querySelectorAll("div.g:not(.kno-kp)");
var urls = [];
var searchResults = [];

searchEls.forEach(function(el, index) {
  urls.push([index,el.querySelectorAll("h3.r a")[0].getAttribute("href")]);
  var att = document.createAttribute("id");       
  att.value = "myIndex"+index;                     
  el.setAttributeNode(att);
  var att = document.createAttribute("readabilityIndex");
  readability(el.querySelectorAll("h3.r a")[0].getAttribute("href"), el);
  console.log("Loading results. Please wait ..");
  att.value= att.value = Math.floor(Math.random() * 6) + 1;
  //FIXME: A delay has been inserted since the API rejects back to back requests. It expects min 5 second delay
  var start = new Date().getTime();
  for (var i = 0; i < 1e9; i++) {
    if ((new Date().getTime() - start) > 9000){
      break;
    }
  }
  el.setAttributeNode(att);
})


var nodesArray = Array.prototype.slice.call(document.querySelectorAll("div.g:not(.kno-kp)"));

function bubbleSort(nodesArray)
 {
     var swapped;
     do {
         swapped = false;
         for (var i=0; i < nodesArray.length-1; i++) {
            console.log(nodesArray[i]);
            var temp = i+1;
            console.log(nodesArray[temp]);
            var isLesserVal = parseInt(document.getElementById("myIndex"+i).getAttribute("readabilityIndex")) < parseInt(document.getElementById("myIndex"+temp).getAttribute("readabilityIndex"));
            console.log(isLesserVal);
             if (isLesserVal) {
                console.log("I need to swap elements here!");
                 swapElements("myIndex"+i, "myIndex"+(i+1));
             }
         }
     } while (swapped);
 }


function score(text){
  return 206.835 - (1.015 * avgWordsSentance(text)) - (84.6 * avgSyllablesWord(text));
}


function gradingLevel(text){
 return ((.39 * avgWordsSentance(text)) + (11.8 * avgSyllablesWord(text)) - 15.59);
}


function avgWordsSentance(text){
 var sentences = text.split(/[.!?][ |\n]/g).length;
 var words = text.split(/ /g).length;
 return words / sentences;
}


function avgSyllablesWord(text){
 var words = text.split(/ /g);
 var syllables = 0;
 for (var i = 0; i < words.length; i++){
 syllables = syllables + countSyllables(words[i]);
 }
 return syllables / words.length;
}


function countSyllables(word){
 word = word.toLowerCase();                                 
 if(word.length <= 3) { return 1; }                            
 word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, ''); 
 word = word.replace(/^y/, '');  
 word = word.replace(/-/g, '');
 if (word.match(/[aeiouy]{1,2}/g))                    
 return word.match(/[aeiouy]{1,2}/g).length; 
 return 1;
}

function readability(myUrl, el) {
  //FIXME: Eliminate the API call and develop an inhouse tool which eliminates html tags from page source and extracts only content
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {     
    if (this.readyState == 4 && this.status == 200) {
         var res = xhttp.responseText; res = res.replace(/\r?\n/g,' '); 
        var finalScore = score(res);
         console.log(finalScore);
   var h3=document.createElement("h3");
   var textnode = document.createTextNode("Readability Score: "+ finalScore);
   h3.appendChild(textnode);
   el.querySelectorAll("h3.r")[0].appendChild(h3);
        }
   };
   
    xhttp.open("GET", "https://boilerpipe-web.appspot.com/extract?url="+myUrl+"&extractor=ArticleExtractor&output=text", true); 
    xhttp.send();
}

//TODO : Sort functionality had issues. Logic works fine. But, there has been an issue in swapping elements when needed!
//bubbleSort(nodesArray);

console.log(urls);
console.log(searchEls);

 function swapElements(idA, idB) {
     console.log("I am swapping");
     console.log(idA + " " + idB);
     var parentDiv = document.getElementsByClassName("srg")[0];
     var divA = document.getElementById(idA);
     var divB = document.getElementById(idB);
     divA.setAttribute("id", "markForDeletion");
     divB.setAttribute("id", "markForDeletion");
     var divAClone = divA.cloneNode(true);
     var divBClone = divB.cloneNode(true);
     var targetDivA = divB.nextSibling;
     var targetDivB = divA.nextSibling;
     if(targetDivB == null) {
         var parentDiv = document.getElementsByClassName("srg")[0];
         parentDiv.append(divAClone);
     } else {
         if(targetDivA == null) {
             var parentDiv = document.getElementsByClassName("srg")[0];
             parentDiv.append(divAClone);
         } else {
             var parentDiv = document.getElementsByClassName("srg")[0];
             parentDiv.insertBefore(divAClone, document.getElementById(idA).nextSibling);
         }
     }
     var parentDiv = document.getElementsByClassName("srg")[0];
     parentDiv.insertBefore(divBClone, document.getElementById(idA).nextSibling);
 }
