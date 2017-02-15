var domain=self.options.domain;
var id = self.options.id;

//check if opened web page is a series
if(document.getElementById("backward-episode") != null){
    //add event handler klicking on stream
    document.getElementById("AjaxStream").onclick = function(){
        //emit event episode watched
        self.port.emit("watching", getData());
        //go to the next episode
        $('#backward-episode').trigger("onclick");
    };


    //add event handler to go to the last watched episode
    self.port.on("retSeries", function(series){
        if(series){
            $("div.ModuleHead:nth-child(15)").before("<strong>Watched last time: </strong><a href='" + series.last_ep_url + "'>Season " + series.season + " Episode " + series.episode + "</a>");
            
            if(document.URL.indexOf(".html,s") >= 0) {
                window.setTimeout(function () {
                    $('#backward-episode').trigger("onclick");
                }, 400);
            }
        }
    });

    //emit event series openend
    self.port.emit("getSeries", getID());
}


function getID(){
    return id + document.URL.slice(document.URL.indexOf("/Stream/") + 8, document.URL.indexOf(".html"));
}

function getData(){
    var series = {};
    series.id = getID();
    series.title = $("div.leftOpt:nth-child(3) > h1:nth-child(1) > span:nth-child(1)").html();
    series.season = parseInt($("#SeasonSelection").val());
    series.episode = parseInt($("#EpisodeSelection").val());
    series.url = "http://" + domain + "/Stream/" + series.id.slice(5) + ".html";
    series.last_ep_url = series.url + ",s" + series.season + "e" + series.episode;
    series.img = "http://" + domain + $(".Grahpics > >").attr("src");
    series.lngImg = "http://" + domain + $('.Flag > img:nth-child(1)').attr("src");
    series.hosticon = "http://" + domain + "/gr/favicon.ico";

    return series;
}