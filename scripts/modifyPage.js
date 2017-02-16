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

function watchseries(){
    //link is a link to a episode
    if(document.URL.indexOf("/episode/") >= 0) {
        console.log("appending eventListener on .buttonlink elements");
        for(var el of $$('.buttonlink')) {
            el.addEventListener('click', function () {
                //TODO: get all the information from the seite correctly
                var series = {};

                series.hostId = "watchseries";
                series.seriesId = document.URL.slice(document.URL.indexOf("/episode/") + 9, document.URL.lastIndexOf("_s"));
                series.title = $("span[itemprop='name']").getAttribute('text');
                series.season = parseInt($(".list-top > a:nth-child(1)").getAttribute('text').slice(7));
                series.episode = parseInt(document.URL.slice(document.URL.lastIndexOf("_") + 2, document.URL.indexOf(".html")));
                //series.url = "http://" + document.domain + "/serie/" + series.seriesId;
                series.url = document.URL;
                series.img = $(".img64x95 > img:nth-child(1)").getAttribute('src');
                series.lngImg = browser.extension.getURL("icons/en.png");
                series.hosticon = "http://" + domain + "/templates/default/images/favicon.ico";

                browser.runtime.sendMessage(series);
            });
        }
        console.log("done");
    }
}