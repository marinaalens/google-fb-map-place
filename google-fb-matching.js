/**
 * Created by Marina on 21/10/2017.
 */

function trimPlaceName(name) {
    var placeName = name;
    var subStrRemove = ['ApS', 'aps', 'A/S', 'IVS'];
    subStrRemove.forEach(function (s) {
        if (placeName.indexOf(s) >= 0) {
            placeName = placeName.replace(s, "");
        }
    });
    // if the place name contains two words or more, only use the first two, to allow for more variations when searching the graph API.
    var nameArray = placeName.split(' ');
    if (nameArray.length > 1) {
        placeName = nameArray[0] + ' ' + nameArray[1];
    }
    return placeName;
}

/**
 * Calls the Graph API for a given place
 * @param place
 * @param callback
 */
function callGraphApi(place, callback) {
    request({
        url: 'https://graph.facebook.com/v2.6/search?fields=name,about,price_range,description,cover',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN,
            type: 'place',
            q: trimPlaceName(place.name),
            center: place.latlng.lat + "," + place.latlng.lng,
            distance: '10'
        },
        method: 'GET'
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            if (data) {
                callback(data.data[0]);
            } else {
                callback(data);
            }
        } else {
            console.error("Unable to send message.");
            console.error(body.error.message);
        }
    });
}