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
        for(var el of $$('.buttonlink')) {
            el.addEventListener('click', function () {
                var regExp = /episode\/(.+)_s(\d+)_e(\d+).html$/;
                var urlObjs = document.URL.match(regExp);

                var series = {};

                series.id = hash("watchseries:" + urlObjs[1]);
                series.name = getElement("span", "itemprop", "name").innerHTML;
                series.season = parseInt(urlObjs[2]);
                series.episode = parseInt(urlObjs[3]);
                //series.url = "http://" + document.domain + "/serie/" + series.seriesId;
                series.url = document.URL;
                series.img = $(".img64x95").firstElementChild.getAttribute("src");
                series.lngIcon = browser.extension.getURL("icons/en.png");
                series.hostIcon = "http://" + document.domain + "/templates/default/images/favicon.ico";

                browser.runtime.sendMessage(series);
            });
        }
    }
}



function bs(){
    if(document.URL.indexOf('/serie/') >= 0){
        $('.hoster-player').addEventListener('click', function () {
            var regExp = /serie\/([^\/]+)\/(\d+)\/(\d+)/;
            var urlObjs = document.URL.match(regExp);

            var series = {};
            series.id = hash("bs:" + urlObjs[1]);
            series.name = $('h2').innerHTML.slice(0, $('h2').innerHTML.search(/<small.*>/));
            series.season = parseInt(urlObjs[2]);
            series.episode = parseInt(urlObjs[3]);
            series.url = document.URL;
            series.img = "http://" + document.domain + $('#sp_right').firstElementChild.getAttribute('src');
            if($('#titleGerman').innerHTML.search(/\W*<small/) === 0){
                series.lngIcon = browser.extension.getURL("icons/en_de.png");
            } else {
                series.lngIcon = browser.extension.getURL("icons/de.png");
            }
            series.hostIcon = "https://" + document.domain + "/favicon.ico";

            browser.runtime.sendMessage(series);
        });
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