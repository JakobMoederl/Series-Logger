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
        id = 0;
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
        '<span class="seriesText"><img src="' + series.hostIcon + '" class="hostImg"></img><span class="title">' + series.name + '</span><br>' +
        '<span class="status">S</span><input type="text" id="season" disabled="true" size="1" value="' + series.lastEpisode.season +'" />' +
        '<span class="status">E</span><input type="text" id="episode" disabled="true" size="1" value="' + series.lastEpisode.epsiode +'" /><br>' +
        '<img src="' + series.lngIcon + '" class="lngImg"></img>' +
        '<span class="edit" id="edit" >Edit</span>' +
        '<span class="remove" id="remove" >Remove</span>' +
        '</span></div>';
    return html2dom(str);
}

function removeSeries(el){
    browser.storage.local.get().then(function (result) {
        var storageSeries = result.series;
        var i;
        for(i=0; i<storageSeries.length; i++){
            if(el.id === storageSeries[i].id.toString()){

                storageSeries.splice(i, 1);
                var result = browser.storage.local.set({'series': storageSeries});
                result.then(function () {

                }, function (error) {
                    console.log(JSON.stringify(error));
                });
                //Remove div from panel
                el.remove();

                if($('#serien').childElementCount === 0){
                    $('#serien').appendChild(html2dom('<span id="noseries" class="noseries">episodes watched will be added automatically</span>'));
                }

                return;
            }
        }


    });
}


//Get all series from storage and add them to the panel
browser.storage.local.get().then(function (result) {
    var storageSeries = result.series;
    if (!storageSeries) {
        storageSeries = initTestSeries();
        browser.storage.local.set({"series": storageSeries});
    }

    //add all series from storage to panel
    var i;
    for (i=0; i<storageSeries.length; i++) {
        addSeries(storageSeries[i], i);
    }
});




function initTestSeries(){
    return [
        {
            "id": 2,
            "url": "http://onwatchseries.to/serie/reign",
            "img:": "http://static.onwatchseries.to/uploads/thumbs/11/11293-reign.jpg",
            "lngIcon": "../icons/en.png",
            "hostIcon": "http://static.onwatchseries.to/templates/default/images/favicon.ico",
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
            "id": 1,
            "name": "Doctor Who",
            "url": "http://onwatchseries.to/serie/doctor_who_2005",
            "img": "http://static.onwatchseries.to/uploads/thumbs/13/13311-doctor_who_2005.jpg",
            "lngIcon": "../icons/en.png",
            "hostIcon": "http://static.onwatchseries.to/templates/default/images/favicon.ico",
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