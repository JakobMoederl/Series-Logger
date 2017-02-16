/**
 * Created by jakob on 2/15/17.
 */

//weak jquery replacement
function $ (selector, el) {
    if (!el) {
        el = document;
    }
    return el.querySelector(selector);
}

function $$ (selector, el) {
    if (!el) {
        el = document;
    }
    return el.querySelectorAll(selector);
}
//get domains
var domainNames = [];
var getDomains = browser.storage.local.get();
getDomains.then(function (result) {
    domainNames = result[0].domainNames;

    checkDomainName();
});

function checkDomainName(){
    var thisDomain = document.domain;

    for(var element of domainNames){
        for(var expression of element.domain) {
            if (thisDomain.match(expression)) {
                //found domain, insert content script
                var script;
                if(element.name === "watchseries"){
                    watchseries();
                } else if(element.name === "kinox"){
                    kinox();
                } else if(element.name === "movie4k"){
                    movie4k();
                } else if(element.name === "bs"){
                    bs();
                }
            }
        }
    }
}

function getElement(tagName, attribute, value){
    for(var element of document.getElementsByTagName(tagName)){
        if(element.getAttribute(attribute) === value){
            return element;
        }
    }

}

function watchseries(){
    //link is a link to a episode
    if(document.URL.indexOf("/episode/") >= 0) {
        console.log("appending eventListener on .buttonlink elements");
        for(var el of $$('.buttonlink')) {
            el.addEventListener('click', function () {
                var series = {};

                series.id = hash("watchseries" + document.URL.slice(document.URL.indexOf("/episode/") + 9, document.URL.lastIndexOf("_s")));
                series.name = getElement("span", "itemprop", "name").innerHTML;
                series.season = parseInt(document.URL.slice(document.URL.lastIndexOf('_s') + 2, document.URL.lastIndexOf('_e')));
                series.episode = parseInt(document.URL.slice(document.URL.lastIndexOf("_e") + 2, document.URL.lastIndexOf(".html")));
                //series.url = "http://" + document.domain + "/serie/" + series.seriesId;
                series.url = document.URL;
                series.img = $(".img64x95").firstElementChild.getAttribute("src");
                series.lngIcon = browser.extension.getURL("icons/en.png");
                series.hostIcon = "http://" + document.domain + "/templates/default/images/favicon.ico";

                browser.runtime.sendMessage(series);
            });
        }
        console.log("done");
    }
}

function hash(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}