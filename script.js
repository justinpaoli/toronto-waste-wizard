//Declare global variables
var data; //API data object
var isFavourite; //Array of booleans, each of which will correspond to an item in the database
var parser; //DOM parser for converting the SGML stored as plaintext in the API to HTML tags

$(document).ready(function() {

    //Initialize DOM Parser
    parser = new DOMParser();

    //Initialize and set parameters for GET request
    var request = new XMLHttpRequest();
    var url = "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000";

    //Function to run when state of query changes
    request.onreadystatechange = function() {
        
        //If query is finished, parse JSON into JS object
        if(this.readyState == 4 && this.status == 200) {
        
            data = JSON.parse(this.responseText);
            if(data == null) {

                //Alert user if database fails to load
                alert("Error: Failed to load Toronto Waste Wizard Catalogue");

            } else { 
                
                //Initialize array filled with false
                isFavourite = new Array(data.length).fill(false);

                //If localStorage object "favourites" exists, parse the stringified list into the boolean array
                if(localStorage.getItem("favourites") != null) {

                    //Load the comma-delimited strings into an array
                    var tempFavourites = localStorage.getItem("favourites").split(",");

                    //Iterate through the array converting strings to boolean values
                    for(var i = 0; i < tempFavourites.length; i++) {

                        isFavourite[i] = tempFavourites[i] === "true";

                    }

                    //Update favourites table
                    renderFavourites();

                }

            }

        }

    };

    //Send GET Request
    request.open("GET", url, true);
    request.send();

    //Send search on button click or enter press
    $("#submit").click(search);
    $("#query").keypress(function(e) {

        //Keycode for ENTER is 13
        if(e.which == 13) {

            search();
            return false;

        }

    }); 

});

//Function to search the loaded data and render all match results
function search() {

    //Retrieve query and convert it to lowercase for comparison purposes
    var query = $("#query").val().toLowerCase();
        
    //Prepare empty string for HTML injection
    var result = "";

    //Only search the database if the query is not an empty string
    if(query) {

        //Loop through database searching for items that match query
        for(var i = 0; i < data.length; i++) {

            if(data[i].title.toLowerCase().includes(query)) {
                
                //Button which when clicked will pass the index of the corresponding element in the database to the updateFavourite() function
                result += "<tr><td class='button-container'><span class='favourite-button " + i.toString() +"' onclick='updateFavourite(" + i.toString() + ")'>&#9733;</span></td>";
                
                //Cell containing the title of the item
                result += "<td class='name'>" + data[i].title + "</td>"
                
                //Cell containing the parsed contents of the body of the item
                result += "<td class='body'>" + parser.parseFromString(data[i].body, "text/html").body.textContent + "</td></tr>";

            }

        }

    }
    
    //Update table of results
    $("#results").html(result);

    //Update the favourites table and buttons
    renderFavourites();

}

//Function called whenever a favourite toggle button is pressed
function updateFavourite(index) {
    
    //Toggle the favourite status of the given index and update the localStorage variable
    isFavourite[index] = !isFavourite[index]
    localStorage.setItem("favourites", JSON.stringify(isFavourite));

    //Update the favourites table and buttons
    renderFavourites();

}

//Updates the favourites table and the color of favourite buttons
function renderFavourites() {

    //Loop through elements in array searching for ones marked as favourite
    var result = "";
    for(var i = 0; i < data.length; i++) {
        
        if(isFavourite[i]) {

            //Button which when clicked will pass the index of the corresponding element in the database to the updateFavourite() function
            result += "<tr><td class='button-container'><span class='favourite-button favourite " + i.toString() +"' onclick='updateFavourite(" + i.toString() + ")'>&#9733;</span></td>";
            
            //Cell containing the title of the item
            result += "<td class='name'>" + data[i].title + "</td>"
            
            //Cell containing the parsed contents of the body of the item
            result += "<td class='body'>" + parser.parseFromString(data[i].body, "text/html").body.textContent + "</td></tr>";

        } 

    }
    
    //Update table of favourites
    $("#favourites").html(result);

    //Update the color of each button
    for(var i = 0; i < data.length; i++) {

        if(isFavourite[i]) {
                
            //Add the "favourite" class, which turns the button green
            $("." + i.toString()).addClass("favourite");

        } else {
        
            //Remove the "favourite" class, which turns the button grey
            $("." + i.toString()).removeClass("favourite");

        }

    }

}