//weak jquery replacement
function $ (selector, el) {
    if (!el) {
        el = document;
    }
    return el.querySelector(selector);
}

//adds a series to the panel
function addSeries(series){
    var el = $("#serien").appendChild(create(series));

    //series button action
    el.addEventListener('click', function(){
        browser.tabs.create({'url': series.url});
    });

    //"remove" button action
    el.querySelector("#remove").addEventListener('click', function(e){
        //stop click event so the browser doesn't open the watchUrl in a new tab
        e.stopPropagation();

        removeSeries(el);
    });

    //remove the text that is displayed if no series was added
    if($("#noseries")){
        $("#noseries").remove();
    }
}

//create a DOM elemnt out of a HTML string
function html2dom(string){
    var temp = document.createElement("template");
    temp.innerHTML = string;
    return temp.content.firstChild;
}

//create DOM elemnt for a series
function create(series){
    var str = '<div class="series" id="' + series.id + '">' +
        '<div id="remove">Remove</div>' +
        '<img class="titleImg" src="' + series.img + '">'+
        '<div class="seriesText">' +
        '<span class="titleText">' + series.name + '</span><br>' +
        '<span class="episodeNumber">S' + series.season + ' E' + series.episode + '</span><br>' +
        '<span class="episodeTitle">' + series.episodeName + '</span><br>' +
        '<span class="info"><img class="hostIcon" src="' + series.hostIcon + '"><img class="lngIcon" src="' + series.lngIcon + '"></span>' +
        '</div>' +
        '</div>';
    return html2dom(str);
}


//removes a series from the panel and the storage
//also displays a "undo" banner until the panel is closed
function removeSeries(el){
    browser.storage.local.get().then(function (result) {
        var storageSeries = result.series;
        var i;
        for(i=0; i<storageSeries.length; i++){
            if(el.id === storageSeries[i].id.toString()){
                var series = storageSeries[i];
                el.remove();

                //clear old undo message
                if($('#seriesRemoved')){
                    $('#seriesRemoved').remove();
                }

                //add "undo" message
                $('#serien').appendChild(html2dom('<span id="seriesRemoved">Removed ' + series.name + '. <span id="undo">undo</span>'));
                $('#undo').addEventListener('click', function () {
                   $('#seriesRemoved').remove();
                   addSeries(series);
                   storageSeries.push(series);
                   browser.storage.local.set({'series': storageSeries});
                });

                storageSeries.splice(i, 1);
                browser.storage.local.set({'series': storageSeries});

                return;
            }
        }
    });
}


//Get all series from storage and add them to the panel
browser.storage.local.get().then(function (result) {
    var storageSeries = result.series;

    //if  no series are in storage, add text
    if(storageSeries.length === 0){
        $('#serien').appendChild(html2dom('<span>when you watch a episode it will get added automatically'));
        return;
    }

    //add all series from storage to panel
    var i;
    for (i=0; i<storageSeries.length; i++) {
        addSeries(storageSeries[i], i);
    }
});