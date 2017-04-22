var urlEls = document.querySelectorAll("h3.r a");
var urls = []
urlEls.forEach(function(el, index){
  urls.push(el.getAttribute("href"));
})
console.log(urls);


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       console.log(xhttp.responseText);
    }
};
xhttp.open("GET", "https://facebook.com", true);
xhttp.send();
