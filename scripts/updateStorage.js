/**
 * Created by jakob on 2/13/17.
 */


//on startup update Domain Names from github page
var request = new XMLHttpRequest();
request.onreadystatechange = setDomainNames;
request.open('GET', 'https://raw.githubusercontent.com/JakobMoederl/Series-Logger/master/domain-names.json')
request.send();

function setDomainNames(){
    if(request.readyState === XMLHttpRequest.DONE){
        if(request.status === 200){
            var domainNames = JSON.parse(request.responseText);
            chrome.storage.local.set(domainNames);
        }
    }
}


//initialize series array to catch later (undefined).length exceptions
chrome.storage.local.get(function (result) {
    if(!result.series){
        chrome.storage.local.set({'series':[]});
    }
});



//listen for episode updates
chrome.runtime.onMessage.addListener(function (message) {
    if(message.series) {
        chrome.storage.local.get(function (result) {
            var storageSeries = result.series;
            var series = message.series;
            //check if series is already in list
            for (var i = 0; i < storageSeries.length; i++) {
                //if series is found, delete it (will be added later again with updated info as first element of the array
                if (series.id === storageSeries[i].id) {
                    storageSeries.splice(i, 1);
                    break;
                }
            }
            //Add to storageSeries array and to storage area
            storageSeries.splice(0, 0, series);
            chrome.storage.local.set({'series': storageSeries});
        });
    }
});