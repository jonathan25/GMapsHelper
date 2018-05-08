function initMap() {
    var latInput = document.getElementById('latitude');
    var lngInput = document.getElementById('longitude');
    var placeIdInput = document.getElementById('placeId');

    var geocoder = new google.maps.Geocoder;

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 28.65, lng: -106.08},
        zoom: 13
    });

    var clickMarker = new google.maps.Marker({
        map: map
    });

    map.addListener('click', function(e) {
        if (e.placeId) {
            e.stop();
            placeIdInput.value = e.placeId;
        } else {
            placeIdInput.value = "";
        }
        latInput.value = e.latLng.lat();
        lngInput.value = e.latLng.lng();

        placeMarker(e.latLng, map);
    });

    function placeMarker(position, map) {
        clickMarker.setMap(null);
        clickMarker = new google.maps.Marker({
            position: position,
            map: map
        });
    }

    $(':input').change(function(e) { 
        if (e.target.id == "placeId" && placeIdInput.value) {
            geocoder.geocode({'placeId': placeIdInput.value}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        var latLng = results[0].geometry.location;

                        map.setZoom(11);
                        map.setCenter(latLng);

                        latInput.value = latLng.lat();
                        lngInput.value = latLng.lng();

                        placeMarker(results[0].geometry.location, map)
                    } else {
                        window.alert('No se encontró este lugar');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        } else {
            if (document.getElementById("form").checkValidity()) {
                var latLng = new google.maps.LatLng(latInput.value, lngInput.value);

                map.setZoom(11);
                map.setCenter(latLng);
                placeMarker(latLng, map);
                geocoder.geocode({'location': latLng}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            placeIdInput.value = results[1].place_id;
                        } else {
                            window.alert('No se encontró este lugar');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });
            }
        }
    }); 

}