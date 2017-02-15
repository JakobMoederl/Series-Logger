function $ (selector, el) {
    if (!el) {
        el = document;
    }
    return el.querySelector(selector);
}

function addSeries(series, insertAtTop){
    //check if insertAtTop parameter was given (=make it a default parameter)
    if(typeof(insertAtTop) === 'undefined'){
        insertAtTop = true;
    }

    var el;
    //append new div with series to '#serien' panel
    if(insertAtTop) {
        el = $("#serien").insertBefore(create(series), $("#serien").firstChild);
    } else {
        el = $("#serien").appendChild(create(series));
    }

    //series button action
    el.addEventListener('click', function(){
        browser.tabs.create({'url': series.lastEpisode.url});
    });

    //"remove" button action
    el.querySelector("#remove").addEventListener('click', function(e){
        //stop click event so the browser doesn't open the watchUrl in a new tab
        e.stopPropagation();

        removeSeries(el);
    });

    //edit button action
    var season = el.querySelector("#season");
    var episode = el.querySelector("#episode");
    season.addEventListener('click', function(e){e.stopPropagation()});
    episode.addEventListener('click', function(e){e.stopPropagation()});

    el.querySelector("#edit").addEventListener("click", function(e) {
        //stop click event so the browser doesn't open the watchUrl in a new tab
        e.stopPropagation();

        season.removeAttribute("disabled");
        episode.removeAttribute("disabled");
    });
    season.addEventListener('keydown', function(e) {
        //keyCode 13 == enter --> update episode in storage
        if(e.keyCode == 13 && parseInt(season.getAttribute('value')) && parseInt(episode.getAttribute('value'))) {
            season.setAttribute("disabled", "true");
            episode.setAttribute("disabled", "true");
        }
    });
    episode.addEventListener('keydown', function(e) {
        if(e.keyCode == 13 && parseInt(season.getAttribute('value')) && parseInt(episode.getAttribute('value'))) {
            season.setAttribute("disabled", "true");
            episode.setAttribute("disabled", "true");
        }
    });


    //remove the text that is displayed if no series was added
    if($("#noseries")){
        $("#noseries").remove();
    }
}

function html2dom(string){
    var temp = document.createElement("template");
    temp.innerHTML = string;
    return temp.content.firstChild;
}

function create(series){
    var str = '<div class="serie" id="' + series.id + '"><img src="' + series.img + '" class="titleImg"></img>' +
        '<span class="seriesText"><img src="' + series.hosticon + '" class="hostImg"></img><span class="title">' + series.name + '</span><br>' +
        '<span class="status">S</span><input type="text" id="season" disabled="true" size="1" value="' + series.lastEpisode.season +'" />' +
        '<span class="status">E</span><input type="text" id="episode" disabled="true" size="1" value="' + series.lastEpisode.epsiode +'" /><br>' +
        '<img src="' + series.lngImg + '" class="lngImg"></img>' +
        '<span class="edit" id="edit" >Edit</span>' +
        '<span class="remove" id="remove" >Remove</span>' +
        '</span></div>';
    return html2dom(str);
}

function removeSeries(el){
    var i;
    for(i=0; i<storageSeries.length; i++){
        if(el.getAttribute('id') === storageSeries[i].id.toString()){
            break;
        }
    }

    storageSeries.splice(i, 1);
    browser.storage.local.set({'series': storageSeries});

    //Remove div from panel
    el.remove();
    if($('#serien').childNodes.length === 0){
        $('#serien').appendChild(html2dom('<span id="noseries" class="noseries">episodes watched will be added automatically</span>'));
    }
}


//listen to commands from content scripts (update or add series)
browser.runtime.onMessage.addListener(function (message) {
    var i;
    for(i=0; i<storageSeries.length; i++){
        //if series is found, updated existing series
        if(message.seriesURL == storageSeries[i].url){
            $("#" + storageSeries[i].id).querySelector("#season").setAttribute('value', message.season);
            $("#" + storageSeries[i].id).querySelector("#episode").setAttribute('value', message.epsiode);
            storageSeries[i].lastEpisode.season = parseInt(message.season);
            storageSeries[i].lastEpisode.epsiode = parseInt(message.episode);
            storageSeries[i].lastEpisode.url = parseInt(message.watchURL);

            if(storageSeries[i].newestEpisode.season < message.season || (storageSeries[i].newestEpisode.season == message.season  && storageSeries[i].newestEpisode < message.newestEpisode)){
                storageSeries[i].newestEpisode.season = parseInt(message.season);
                storageSeries[i].newestEpisode.epsiode = parseInt(message.episode);
                storageSeries[i].newestEpisode.url = parseInt(message.watchURL);
            }

            browser.storage.local.set({'series': storageSeries});

            return;
        }
    }

    //TODO: no existing series found, creating new one
    var series = {};
    series.id = nextID;
    series.url = message.seriesURL;
    series.img = message.img;
    series.lng = message.lng;
    series.hostImg = message.hostImg;
    series.lastEpisode = {};
    series.lastEpisode.epsiode = message.episode;
    series.lastEpisode.season = message.season;
    series.lastEpisode.url = message.url;
    series.newestEpisode = series.lastEpisode.copy();

    storageSeries.splice(0, 0, series);
    browser.storage.local.set({'series': storageSeries});
    addSeries(series);

});

var storageSeries = [];
var nextID = -1;

var getStorageSeries = browser.storage.local.get();
getStorageSeries.then(function (result) {
    storageSeries = result.series;
    if (!storageSeries) {
        storageSeries = initTestSeries();
        browser.storage.local.set({"series": storageSeries});
    }

    nextID = result.nextID;
    if(typeof(nextID) === 'undefined'){
        nextID = 0;
        browser.storage.local.set({'nextID': 0});
    }
    //add all series from storage to panel
    var i;
    for (i=0; i<storageSeries.length; i++) {
        addSeries(storageSeries[i], false);
    }
});




function initTestSeries(){
    return [
        {
            "id": 1,
            "name": "Reign",
            "url": "http://onwatchseries.to/serie/reign",
            "lastEpisode": {
                "season": 1,
                "epsiode": 2,
                "url": "http://onwatchseries.to/episode/reign_s1_e2.html"
            },
            "newestEpisode": {
                "season": 1,
                "episode": 2,
                "url": "http://onwatchseries.to/episode/reign_s1_e2.html"
            }

        }, {
            "id": 2,
            "name": "Doctor Who",
            "url": "http://onwatchseries.to/serie/doctor_who_2005",
            "lastEpisode": {
                "season": 10,
                "epsiode": 0,
                "url": "http://onwatchseries.to/episode/doctor_who_2005_s10_e0.html"
            },
            "newestEpisode": {
                "season": 10,
                "episode": 0,
                "url": "http://onwatchseries.to/episode/doctor_who_2005_s10_e0.html"
            }
        }
    ];
}