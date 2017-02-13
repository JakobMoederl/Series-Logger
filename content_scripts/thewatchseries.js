var domain = self.options.domain;
var id = self.options.id;
var lng_icon = self.options.lng_en;

//link is a link to a episode
if(document.URL.indexOf("/episode/") >= 0) {
    $(".buttonlink").click(function(){
        self.port.emit("watching", getData());
    });
}

if(document.URL.indexOf("/serie/") >= 0){
    self.port.on("retSeries", function(series){
        if(series){
            $(".latest-episode > center:nth-child(1)").after("<center><strong>Watched last time: </strong><a href='" + series.last_ep_url + "'>"
                + "Season " + series.season + " Episode " + series.episode + "</a></center>");
        }
    });

    self.port.emit("getSeries", getID_Series())
}

function getID_Episode(){
    return id + document.URL.slice(document.URL.indexOf("/episode/") + 9, document.URL.lastIndexOf("_s"));
}

function getID_Series(){
    return id + document.URL.slice(document.URL.indexOf("/serie/") + 7);
}

function getData(){
    var series = {};

    series.id = getID_Episode();
    series.title = $("span[itemprop='name']").html();
    series.season = parseInt($(".list-top > a:nth-child(1)").html().slice(7));
    series.episode = parseInt(document.URL.slice(document.URL.lastIndexOf("_") + 2, document.URL.indexOf(".html")));
    series.url = "http://" + domain + "/serie/" + series.id.slice(5);
    series.last_ep_url = document.URL;
    series.img = $(".img64x95 > img:nth-child(1)").attr("src");
    series.lngImg = lng_icon;
    series.hosticon = "http://" + domain + "/templates/default/images/favicon.ico";

    return series;
}