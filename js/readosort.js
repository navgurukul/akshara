var urlEls = document.querySelectorAll("h3.r a");
var searchEls = document.querySelectorAll("div.g:not(.kno-kp)");
var urls = [];
var searchResults = [];
//FIXME - the count should be dynamic?
var count = 10;
var pagesDone = 0;

searchEls.forEach(function(el, index) {
    urls.push([index, el.querySelectorAll("h3.r a")[0].getAttribute("href")]);
    var att = document.createAttribute("id");
    att.value = "myIndex" + index;
    el.setAttributeNode(att);
    var att = document.createAttribute("readabilityIndex");
    readability(el.querySelectorAll("h3.r a")[0].getAttribute("href"), el);
    el.setAttributeNode(att);
})

function compFun(a, b) {
    //change this code to search for the particular class in the children tree
    new_a = parseInt(a.children[0].children[0].children[0].children[1].innerHTML);
    new_b = parseInt(b.children[0].children[0].children[0].children[1].innerHTML);
    
    return new_b - new_a;
}

function getScoreOfText(text) {
    //More the score the better
    //Can we normalise the code here?
    var score = 206.835 - (1.015 * avgWordsSentence(text)) - (84.6 * avgSyllablesWord(text));
//    console.log(avgWordsSentence(text), avgSyllablesWord(text), score);
    score = Math.floor(score);
    return score;
}


function gradingLevel(text) {
    return ((.39 * avgWordsSentence(text)) + (11.8 * avgSyllablesWord(text)) - 15.59);
}


function avgWordsSentence(text) {
    var sentences = text.split(/[.!?][ |\n]/g).length;
    var words = text.split(/ /g).length;
    return words / sentences;
}


function avgSyllablesWord(text) {
    var words = text.split(/ /g);
    var syllables = 0;
    for (var i = 0; i < words.length; i++) {
        syllables = syllables + countSyllables(words[i]);
    }
    return syllables / words.length;
}


function countSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) {
        return 1;
    }
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    word = word.replace(/-/g, '');
    if (word.match(/[aeiouy]{1,2}/g))
        return word.match(/[aeiouy]{1,2}/g).length;
    return 1;
}

function readability(myUrl, el) {
//    if (myUrl.indexOf("http://") > -1) {
//        console.log(myUrl);
//        return;
//    }
    myUrl = myUrl.replace("http:", "https:")
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        if (this.readyState == 4) {
            pagesDone += 1;
            
            if (this.status == 200) {
                var resHTML = xhttp.responseText;
                //from resHTML get res
                var parser = new DOMParser();
                var doc = parser.parseFromString(resHTML, "text/html");
                var pageText = "";

                eles = doc.getElementsByTagName("p");
                for (var i=0; i< eles.length; i++) {
                    var eleText = eles[i].textContent.replace(/\s\s+/g, ' ').replace(/\.{2,}/g, '.');
                    var lastIndex = eleText.length - 1;

                    //Only process if the length of sentence inside is greater than 15 characters.
                    //Also, discard sentences ending with period but having less than 5 characters So... isn't a valid sentence either

                    if (eleText.length > 5 && (eleText.length > 15 || eleText[lastIndex] == '.')) {
                        if ( eleText[lastIndex] == '.') {
                            pageText = pageText + eleText + " ";
                        } else {
                            pageText = pageText + eleText + '. ';
                        }
                    }
                }

                pageText = pageText.replace(/\r?\n/g, ' ');
                var finalScore = getScoreOfText(pageText);
                console.log(finalScore);

                var h3 = document.createElement("h3");
                var textnode = document.createTextNode("" + finalScore);
                h3.classList.add("readabilityScore");
                h3.classList.add(getClassFromScore(finalScore));
                h3.appendChild(textnode);
                el.querySelectorAll("h3.r")[0].appendChild(h3);
            }
        }

        console.log("HI", pagesDone);
        if (pagesDone==count) {
            console.log("DONE!");
            var nodesArray = Array.prototype.slice.call(document.querySelectorAll("div.g:not(.kno-kp)"));
            nodesArray.sort(compFun);
            
            var parentDiv = document.getElementsByClassName("srg")[0];
            while (parentDiv.hasChildNodes()) {
                parentDiv.removeChild(parentDiv.lastChild);
            }
            
            for (i=0; i<nodesArray.length; i++) {
                parentDiv.appendChild(nodesArray[i]);
            }
            
        }
    };

    xhttp.open("GET", myUrl, true);
    xhttp.send();
}

function getClassFromScore(finalScore) {
    if (finalScore >= 100) {
        return "level1";
    } else if (finalScore >= 80) {
        return "level2"
    } else if (finalScore >= 65) {
        return "level3"
    } else if (finalScore >= 50) {
        return "level4"
    } else {
        return "level5"
    }
}