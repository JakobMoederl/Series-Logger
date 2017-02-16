/**
 * Created by jakob on 2/13/17.
 */


//on startup update Domain Names
var request = new XMLHttpRequest();

request.onreadystatechange = setDomainNames;
request.open('GET', 'https://raw.githubusercontent.com/JakobMoederl/Series-Logger/master/domain-names.json')
request.send();

function setDomainNames(){
    if(request.readyState === XMLHttpRequest.DONE){
        if(request.status === 200){
            var domainNames = JSON.parse(request.responseText);
            browser.storage.local.set(domainNames);
        }
    }
}

//listen for episode updates
browser.runtime.onMessage.addListener(function (message) {
    browser.storage.local.get().then(function (result) {
        var storageSeries = result.series;

        //check if series is already in list
        var i;
        for(i=0; i<storageSeries.length; i++){

            //if series is found, updated existing series
            if(message.id === storageSeries[i].id){
                storageSeries[i].lastEpisode.season = message.season;
                storageSeries[i].lastEpisode.epsiode = message.episode;
                storageSeries[i].lastEpisode.url = message.url;

                //is it not only the last watched episode but also newest episode?
                if(storageSeries[i].newestEpisode.season < message.season || (storageSeries[i].newestEpisode.season == message.season  && storageSeries[i].newestEpisode < message.newestEpisode)){
                    storageSeries[i].newestEpisode = storageSeries[i].lastEpisode;
                }

                //update storage
                browser.storage.local.set({'series': storageSeries});

                //update completed, exit now
                return;
            }
        }

        //series not in list ==> create new series
        var series = {};
        series.id = message.id;
        series.name = message.name;
        series.url = message.seriesURL;
        series.img = message.img;
        series.lngIcon = message.lngIcon;
        series.hostIcon = message.hostIcon;
        series.lastEpisode = {};
        series.lastEpisode.epsiode = message.episode;
        series.lastEpisode.season = message.season;
        series.lastEpisode.url = message.url;
        series.newestEpisode = series.lastEpisode;

        //Add to storageSeries array and to storage area
        storageSeries.splice(0, 0, series);
        browser.storage.local.set({'series': storageSeries});
    });
});

/*
// dummy initialization
if(browser.storage.local.get('domainNames') == null) {
    var domainNames = [
        {
            "id": 1,
            "url": ["onwatchseries.to"],
            'name': "watchseries"
        }
    ]
    browser.storage.local.set({'domainNames': domainNames});
}
*/