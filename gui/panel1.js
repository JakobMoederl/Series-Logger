self.port.on("add", function(series){
    $("#serien").append(create(series));
    var season = $('#' + series.id + '-season');
    var episode = $('#' + series.id + '-episode');
    $('#' + series.id).click(function(){        //series button
        self.port.emit("openSeries", series.id);
    });
    $('#' + series.id + '-remove').click(function(e){  //"remove" button
        e.stopPropagation();
        $('#' + series.id).remove();
        self.port.emit("remove", series.id);
        if($('#serien').children().length === 0){
            $('#serien').append('<span id="noseries" class="noseries">Wenn sie auf kinox.tv, movie4k.tv, thewatchseries.to oder bs.to eine Serie streamen wird sie automatisch hinzugefügt</span>');
        }
    });
    $('#' + series.id + '-edit').click(function(e) {  //"edit" button
        e.stopPropagation(); //cancle onclick event so the addons dosn't open the series in a new tab

        season.removeAttr("disabled");
        episode.removeAttr("disabled");

        season.click(function(e){
            e.stopPropagation();
        })
        episode.click(function(e){
            e.stopPropagation();
        });
    });
    season.keydown(function(e) {
        if(e.keyCode == 13 && parseInt(season.val()) && parseInt(episode.val())) {
            self.port.emit("update_from_panel", {
                id:series.id,
                season:season.val(),
                episode:episode.val()
            });
            series.season = season.val();
            series.episode = episode.val();

            season.attr("disabled", "true");
            episode.attr("disabled", "true");
            season.click(function(){});
            episode.click(function(){});
        }
    });
    episode.keydown(function(e) {
        if(e.keyCode == 13 && parseInt(season.val()) && parseInt(episode.val())) {
            self.port.emit("update_from_panel", {
                id:series.id,
                season:parseInt(season.val()),
                episode:parseInt(episode.val())
            });

            season.attr("disabled", "true");
            episode.attr("disabled", "true");
            season.click(function(){});
            episode.click(function(){});
        }
    });
    $("#noseries").remove();
});

function create(series){
    var str = '<div class="serie" id="' + series.id + '">' + 
        '<img src="' + series.img + '" class="titleImg"></img>' +
        '<span class="seriesText"><img src="' + series.hosticon + '" class="hostImg"></img><span class="title">' + series.title + '</span><br>' +
        '<span class="status">S</span><input type="text" id="' + series.id + '-season" disabled="true" size="1" value="' + series.season +'" />' +
        '<span class="status">E</span><input type="text" id="' + series.id + '-episode" disabled="true" size="1" value="' + series.episode +'" /><br>' +
        '<img src="' + series.lngImg + '" class="lngImg"></img>' +
        '<span class="edit" id="' + series.id + '-edit" >Edit</span>' +
        '<span class="remove" id="' + series.id + '-remove" >Remove</span>' +
        '</span></div>';
    return str;
}

self.port.on("update", function (series){
    $('#' + series.id + '-season').val(series.season);
    $('#' + series.id + '-episode').val(series.episode);
	$('div#serien > div:first-child').before($('div#' + series.id))
});
