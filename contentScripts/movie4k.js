var domain = self.options.domain;
var id = self.options.id;
var lng_en = self.options.lng_en;
var lng_de = self.options.lng_de;
var lng_en_de = self.options.lng_en_de;


//check if page is tv show
if(document.URL.indexOf("-watch-tvshow-") >= 0 || document.URL.indexOf("-online-serie-") >= 0){
    var series = getData();

    $("#maincontent5 > div:nth-child(1) > iframe:nth-child(8)").click(function(){
       self.port.emit("watching", series);
    });

    $("img[src='/img/click_link.jpg']").click(function(){
        self.port.emit("watching", series);
    });

    self.port.on("retSeries", function(series){
        if(series){
             $("#maincontent5 > div:nth-child(1) > div:nth-child(3)").after("<span><strong>Watched last time:</strong> <a href='" + series.last_ep_url + "'>Season " + series.season + " Episode " + series.episode + "</span></a><br />");
        }
    });

    self.port.emit("getSeries", series.id);
}


function getData(){
    var str = document.URL.slice(document.URL.indexOf(domain) + domain.length + 1);
    var str_list = str.split("-");
    var series = {};
    series.id = id;
    for(var i=0; i < str_list.length - 1; i++){
        if(i != 0){
            series.id += "-";
        }
        series.id += str_list[i];
    }
    series.id = series.id.toLocaleLowerCase();
    if(document.title.indexOf(" online anschauen") >= 0) { //deutsche seite
        series.title = document.title.slice(0, document.title.indexOf(" online anschauen"))
    } else {
        series.title = document.title.slice(6, document.title.indexOf(" online -"));
    }
    series.season = parseInt($("select[name='season']").val());
    series.episode = $("select[name='episode']:first option:selected").text();
    series.episode = parseInt(series.episode.slice(series.episode.indexOf(" ") + 1));
    series.url = document.URL;
    series.last_ep_url = document.URL;
    series.img = $("#maincontent5 > div:nth-child(1) > div:nth-child(2) > a:nth-child(1) > img:nth-child(1)").attr("src");
    series.lngImg = $("#maincontent5 > div:nth-child(1) > div:nth-child(3) > span:nth-child(1) > img:nth-child(2)").attr("src");
    series.hosticon = "http://" + domain + "/favicon.ico";
    return series;
}