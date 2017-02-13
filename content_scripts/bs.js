/**
 * Created by jakob on 31.03.16.
 */
var domain = self.options.domain;
var id = self.options.id;
var lng_de = self.options.lng_de;


//link is a link to a episode
if(document.URL.indexOf("/serie/") >= 0) {
    var data = getData();
    $("img[alt='Video']").click(function(){
        self.port.emit("watching", data.series);
    });


    if(!data.isWatchLink){
        self.port.on("retSeries", function(series){
            if(series){
                $(".pages:first").after("<strong>Watched last time:</strong> <a href='" + series.last_ep_url + "'>Season " + series.season + " Episode " + series.episode + "</a><br />");
            }
        });

        self.port.emit("getSeries", data.series.id);
    }
}


function getData(){
    var str = document.URL.slice(document.URL.indexOf("/serie/") + 7);
    var series = {};
    var isWatchLink = false;

    series.id = id;
    series.season = NaN;
    series.episode = NaN;
    if(str.indexOf("/") >= 0) {
        var str_list = str.split("/");
        series.id = series.id + str_list[0];
        if(str_list.length >= 2){
            series.season = parseInt(str_list[1]);
        }
        if(str_list.length >= 3){
            series.episode = parseInt(str_list[2].slice(0, str_list.indexOf("-")));
        }
        isWatchLink = str_list.length == 4;
    } else {
        series.id += str;
    }
    series.title = $("#sp_left > h2:nth-child(1)").html().slice(0, $("#sp_left > h2:nth-child(1)").html().indexOf("<small>"));
    series.url = "http://" + domain + "/serie/" + series.id.slice(series.id.indexOf("-") + 1);
    series.last_ep_url = document.URL.slice(0, document.URL.lastIndexOf("/"));
    series.img = "http:" + $("img[alt='Cover']").attr("src");
    series.lngImg = lng_de;
    series.hosticon = "https://s.bs.to/favicon.ico";
    return {'series': series, 'isWatchLink': isWatchLink} ;
}