/**
 * Created by jakob on 2/13/17.
 */

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