/**
 * Created by jakob on 2/15/17.
 */

//get domains
var domainNames = []
var getDomains = browser.sotrage.local.get('domainNames');
getDomains.then(function (result) {
    domainNames = result.domainNames;

    checkDomainName();
})

function checkDomainName(){
    var domain = document.domain;

    var i;
    for(i=0; i<domainNames.length; i++){
        if(domain in domainNames[i].domain){
            //found domain, insert content script
            window.alert("found domain " + domainNames[i].name);
        }
    }
}