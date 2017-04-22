var urlEls = document.querySelectorAll("h3.r a");
var urls = []
urlEls.forEach(function(el, index){
  urls.push(el.getAttribute("href"));
})
console.log(urls);
