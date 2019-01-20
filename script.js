var data;
var isFavourite;
var parser;

$(document).ready(function() {

    parser = new DOMParser();

    var request = new XMLHttpRequest();
    var url = "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000";

    request.onreadystatechange = function() {
        
        //If query is finished, parse JSON into JS object
        if(this.readyState == 4 && this.status == 200) {
        
            data = JSON.parse(this.responseText);
            if(data == null) {

                alert("Error: Failed to load Toronto Waste Wizard Catalogue");

            } else {

                isFavourite = new Array(data.length).fill(false);

            }

        }

    };

    request.open("GET", url, true);
    request.send();

    $("#submit").click(function() {
       
        var query = $("#query").val().toLowerCase();
        
        var result = "";
        for(var i = 0; i < data.length; i++) {

            if(data[i].title.toLowerCase().includes(query)) {
                
                result += "<tr><td class='button-container'><span class='favourite-button " + i.toString() +"' onclick='updateFavourite(" + i.toString() + ")'>&#9733;</span></td>";
                result += "<td class='name'>" + data[i].title + "</td>"
                result += "<td class='body'>" + parser.parseFromString(data[i].body, "text/html").body.textContent + "</td></tr>";

            }

        }
        
        $("#results").html(result);

    });

});

function updateFavourite(index) {
    
    isFavourite[index] = !isFavourite[index]

    if(isFavourite[index]) {

        $("." + index.toString()).addClass("favourite");

    } else {

        $("." + index.toString()).removeClass("favourite");

    }

    renderFavourites();

}

function renderFavourites() {

    var result = "";
    for(var i = 0; i < data.length; i++) {

        if(isFavourite[i]) {
            
            result += "<tr><td class='button-container'><span class='favourite-button favourite " + i.toString() +"' onclick='updateFavourite(" + i.toString() + ")'>&#9733;</span></td>";
            result += "<td class='name'>" + data[i].title + "</td>"
            result += "<td class='body'>" + parser.parseFromString(data[i].body, "text/html").body.textContent + "</td></tr>";

        }

    }
    
    $("#favourites").html(result);

}