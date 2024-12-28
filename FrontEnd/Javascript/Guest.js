function toggleLogIncident() {
    var incidentForm = document.getElementById("LoggingIncidentForm");

    if (!incidentForm) {
        viewLogIncident();
        incidentForm = document.getElementById("LoggingIncidentForm");
        incidentForm.style.display = "block";
    } else {
        if (incidentForm.style.display === "block") {
            incidentForm.style.display = "none";
        } else {
            incidentForm.style.display = "block";
        }
    }
}

function toggleMap() {
    var mapElement = document.getElementById('MapAll');
    if (mapElement.hidden) {
        mapElement.hidden = false;
        showMapWithFires();
    } else {
        mapElement.hidden = true;
    }
}

function viewLogIncident() {
    var message = `
        <div id="LoggingIncidentForm" class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <form id="Incident-Logging" onsubmit="Incident_Logging();return false">
                        <h2 class="card-title">Incident Logging</h2>
                        <div class="form-group">
                            <div class="rdio">
                             <label for="TypeIncidentRadio"> Type of Incident:
                                <div id="TypeIncidentRadio">
                                        <input type="radio" class="TypeOfIncident" id="fire" name="TypeOfIncident" value="fire" />fire
                                        <input type="radio" class="TypeOfIncident" id="accident" name="TypeOfIncident" value="accident" checked/>accident
                                </div>
                            </label>
                        </div>
                        <div class="form-group">
                            <label for="IncidentDescription"> Description:</label>
                            <textarea id="IncidentDescription" name="description" maxlength="100" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="GuestPhone"> Number Phone:</label>
                            <input type="text" class="form-control" id="GuestPhone" maxlength="10" required>
                        </div>
                        <div class="form-group">
                            <label for="IncidentAddress" class="form-label">Address:</label>
                            <input type="text" class="form-control" id="IncidentAddress" maxlength="100" oninput="makeAjaxReq()" required>
                        </div>
                        <div class="form-group">
                            <label for="prefecture">Select prefecture Of Crete</label>
                                <select class="form-select" id="prefecture" name="prefecture" onclick="makeAjaxReq()">
                                    <option value="Chania">Chania</option>
                                    <option value="Heraklion" selected>Heraklion</option>
                                    <option value="Lassithi">Lassithi</option>
                                    <option value="Rethimnon">Rethimnon</option>
                                </select>
                        </div>

                        <div class="form-group">
                            <label for="municipality">Municipality:</label>
                            <input type="text" id="municipality" placeholder="Heraklion" name="municipality" pattern=".{3,30}" title="3-30 letters" oninput="makeAjaxReq()" required>
                        </div>

                        <div class="form-group">
                            <span id="errorrequest" style="color: red;"></span>
                            <div hidden id="Map" style="width: 100%; height: 400px; color: black"></div>
                        </div>

                        <div class="d-grid gap-2">
                            <button type="submit">Incident Logging</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.getElementById("logging_message").innerHTML = message;
}

async function Incident_Logging() {
    const typeOfIncident = document.querySelector('input[name="TypeOfIncident"]:checked').value;

    var today = new Date();
    today.setDate(today.getDate());
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var now = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    console.log(now);

    console.log("typeOfIncident", typeOfIncident);
    console.log("now", now);

    const formData = {
        incident_type: typeOfIncident,
        description: document.getElementById("IncidentDescription").value,
        user_phone: document.getElementById("GuestPhone").value,
        user_type: "guest",
        address: document.getElementById("IncidentAddress").value,
        lat: position_lat,
        lon: position_lon,
        municipality: document.getElementById("municipality").value,
        prefecture: document.getElementById("prefecture").value,
        start_datetime: now,
        end_datetime: null,
        danger: "unknown",
        status: "submitted",
        finalResult: "null",
        vehicles: 0,
        firemen: 0
    };
    console.log("formData", JSON.stringify(formData));

    const res = await fetch("http://localhost:3000/AddGuestIncident", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if (res.status != 200) {
        alert("Error in database. ");
        return false;
    }
    window.location.reload();
}

function hideLogIncident() {
    document.getElementById("logging_message").innerHTML = "";
}

async function askQuestion(question) {
    let prompt = question;
    if (!question) {
        prompt = document.getElementById('userQuestion').value;
    }

    const res = await fetch('http://localhost:3000/getChat', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    document.getElementById('response').textContent = data;
}


///Map
var position_lat;
var position_lon;
function setPosition(lat, lon) {
    position_lat = lat;
    position_lon = lon;
    var fromProjection = new OpenLayers.Projection("EPSG:4326");
    var toProjection = new OpenLayers.Projection("EPSG:900913");
    var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
    return position;
}

var positions;
var validMap = false;
function handler(position, message) {
    var popup = new OpenLayers.Popup.FramedCloud("Popup",
        position, null,
        message, null,
        true // <-- true if we want a close (X) button, false otherwise
    );
    map.addPopup(popup);
}

function makeAjaxReq() {
    const municipality = document.getElementById("municipality").value;
    const prefecture = document.getElementById("prefecture").value;
    const address = document.getElementById("IncidentAddress").value;
    const error = document.getElementById("errorrequest");
    error.textContent = "";
    if (address.length == 0) {
        error.textContent = "Please enter an address!";
        error.style.color = "red";
        document.getElementById("Map").hidden = true;
        validMap = false;
        return;
    }
    if (municipality.length == 0) {
        error.textContent = "Please enter an municipality!";
        error.style.color = "red";
        document.getElementById("Map").hidden = true;
        validMap = false;
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            const response = JSON.parse(xhr.responseText);
            if (xhr.responseText === '{}') {
                error.textContent = "Address not found";
                error.style.color = "red";
                validMap = false;
                document.getElementById("Map").hidden = true;
            }
            else if (response[0].display_name.includes("Crete") == false) {
                error.textContent = "Address not in Crete";
                error.style.color = "red";
                validMap = false;
                document.getElementById("Map").hidden = true;
            }
            else {
                error.textContent = "";
                validMap = true;
                document.getElementById("Map").removeAttribute("hidden");
                document.getElementById("Map").textContent = " ";
                map = new OpenLayers.Map("Map");
                var mapnik = new OpenLayers.Layer.OSM();
                map.addLayer(mapnik);
                var markers = new OpenLayers.Layer.Markers("Markers");
                map.addLayer(markers);
                var position = setPosition(response[0].lat, response[0].lon);
                positions = setPosition(response[0].lat, response[0].lon);
                var mar = new OpenLayers.Marker(position);
                markers.addMarker(mar);
                mar.events.register('mousedown', mar, function (evt) {
                    handler(position, response[0].display_name);
                }
                );
                const zoom = 10;
                map.setCenter(position, zoom);
            }
        }
    });

    var real_address = address + " " + municipality + " " + prefecture;
    xhr.open('GET', 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=' + real_address + '&format=json&addressdetails=1&namedetails=0&accept-language=en&limit=5&bounded=0&polygon_text=0&polygon_svg=0&polygon_kml=0&polygon_geojson=0&polygon_threshold=0.0');
    xhr.setRequestHeader('x-rapidapi-key', 'e2d91023d5msha641cdd4d08a4aep155edbjsnfd9940f26994');
    xhr.setRequestHeader('x-rapidapi-host', 'forward-reverse-geocoding.p.rapidapi.com');
    xhr.send(null);
    console.log(xhr.responseText);
}

var positions2 = [];
var validMapAll = false;

function createFireIcon() {
    return new OpenLayers.Icon('../Sources/fire.png', new OpenLayers.Size(70, 70), new OpenLayers.Pixel(-16, -16));
}

function createAccidentIcon() {
    return new OpenLayers.Icon('../Sources/accident.png', new OpenLayers.Size(50, 50), new OpenLayers.Pixel(-16, -16));
}

async function showMapWithFires() {
    const error = document.getElementById("errorrequest1");
    error.textContent = "";


    const res = await fetch('http://localhost:3000/getRunningIncidents', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) {
        console.error("Failed to fetch running incidents");
        return;
    }
    const RunningInfo = await res.json();

    const incidents = RunningInfo.map((incident) => ({
        lat: incident.lat,
        lon: incident.lon,
        address: incident.address,
        message: incident.description,
        name: incident.incident_type,
        details: incident.danger
    }));

    if (incidents.length === 0) {
        error.textContent = "No incidents available.";
        error.style.color = "black";
        validMapAll = false;
        document.getElementById("MapAll").hidden = true;
        return;
    }

    validMapAll = true;
    document.getElementById("MapAll").removeAttribute("hidden");
    document.getElementById("MapAll").textContent = " ";

    var map = new OpenLayers.Map("MapAll");
    var mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);

    incidents.forEach(function (incident) {
        var position = new OpenLayers.LonLat(incident.lon, incident.lat)
            .transform(
                new OpenLayers.Projection("EPSG:4326"),
                map.getProjectionObject()
            );

        var marker;
        if (incident.name == "accident") {
            marker = new OpenLayers.Marker(position, createAccidentIcon());
        } else if (incident.name == "fire") {
            marker = new OpenLayers.Marker(position, createFireIcon());
        }
        markers.addMarker(marker);

        marker.events.register('mousedown', marker, function (evt) {
            const popupContent = `
                <strong>Type: ${incident.name}</strong><br>
                <b>Address: ${incident.address}</b>
                <p>Descreption: ${incident.message}</p>
                <p><em>Danger: ${incident.details}</em></p>
            `;

            var popup = new OpenLayers.Popup.FramedCloud(
                "Popup",
                position,
                null,
                popupContent,
                null,
                true
            );
            map.addPopup(popup);

            OpenLayers.Event.stop(evt);
        });
    });


    const zoom = 10;
    var centerPosition = new OpenLayers.LonLat(incidents[0].lon, incidents[0].lat)
        .transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        );
    map.setCenter(centerPosition, zoom);
}
////

const hoverSound = new Audio('/Sources/mixkit-typewriter-soft-click-1125.wav');

// Sound
function playSound() {
    hoverSound.currentTime = 0;
    hoverSound.play();
}


