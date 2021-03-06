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

//returns all matches instead of just the first like $
function $$ (selector, el) {
    if (!el) {
        el = document;
    }
    return el.querySelectorAll(selector);
}


//get domains and match the current one
var domainNames = [];
browser.storage.local.get().then(function (result) {
    domainNames = result[0].domainNames;
    checkDomainName();
});

//match the current domain and call the corresponding function
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


//gets a DOM elemnt of type <tagName> with the attribute <attribute> set to <value>
function getElement(tagName, attribute, value){
    for(var element of document.getElementsByTagName(tagName)){
        if(element.getAttribute(attribute) === value){
            return element;
        }
    }

}


//function for watchseries domain (onwatchseries.to)
function watchseries(){

    //update function gather all information from the site and sends it to the background script
    var update = function () {
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
        series.episodeName = $('.list-top').innerHTML.match(/<a href.*>.*<\/a> Episode \d+ - (.*)/)[1];


        browser.runtime.sendMessage({'series': series});
    };

    //link is a link to a episode
    if(document.URL.indexOf("/episode/") >= 0) {
        for(var el of $$('.buttonlink')) {
            el.addEventListener('click', update);
        }
    }
}



//function for burning series domain (bs.to)
function bs(){

    //update function gather all information from the site and sends it to the background script
    var update = function () {
        var regExp = /serie\/([^\/]+)\/(\d+)\/(\d+)/;
        var urlObjs = document.URL.match(regExp);

        var series = {};
        series.id = hash("bs:" + urlObjs[1]);
        series.name = $('h2').innerHTML.slice(0, $('h2').innerHTML.search(/<small.*>/));
        series.season = parseInt(urlObjs[2]);
        series.episode = parseInt(urlObjs[3]);
        series.url = document.URL;
        series.img = "http://" + document.domain + $('#sp_right').firstElementChild.getAttribute('src');
        if ($('#titleGerman').innerHTML.search(/\W*<small/) === 0) {
            series.lngIcon = browser.extension.getURL("icons/en_de.png");
        } else {
            series.lngIcon = browser.extension.getURL("icons/de.png");
        }
        series.hostIcon = "https://" + document.domain + "/favicon.ico";

        var episodeName = $('#titleGerman').innerHTML.match(/(\W*(\w.*)\W*)?<small.*>\W*(\w.*)<\/small>/);
        series.episodeName = typeof(episodeName[1]) === 'string' && episodeName[1].length > 0 ? episodeName[1] : episodeName[3];
        browser.runtime.sendMessage({'series': series});
    };

    //url is to a series (maybe switch to regex for better detection)
    if(document.URL.indexOf('/serie/') >= 0){
        if($('.hoster-player').firstElementChild.tagName === "IFRAME") {
            update();
        } else {
            $('.hoster-player').addEventListener('click', update);
        }
    }
}


//create a (almost certainly) UUID by hashing a string
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