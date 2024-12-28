function viewLogIncident(){
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

                        <div class="form-group">
                            <div class="rdio2">
                                <div id="DangerRadio">
                                    <label for="TypeOfDanger">Danger:
                                        <input type="radio" class="TypeOfDanger" id="high" name="TypeOfDanger" value="high" />high
                                        <input type="radio" class="TypeOfDanger" id="medium" name="TypeOfDanger" value="medium" />medium
                                        <input type="radio" class="TypeOfDanger" id="low" name="TypeOfDanger" value="low" />low
                                        <input type="radio" class="TypeOfDanger" id="unknown" name="TypeOfDanger" value="unknown" checked/>unknown
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="vehicles" class="form-label">Vehicles:</label>
                            <input type="number" class="form-control" id="vehicles" value="0" min="0">
                        </div>
                        <div class="form-group">
                            <label for="firemen" class="form-label">Firemen:</label>
                            <input type="number" class="form-control" id="firemen" value="0" min="0">
                        </div>
                        <div class="d-grid gap-2">
                            <button type="submit">Incident Logging</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.getElementById("logging_message").innerHTML=message;
    hide_update_message();
    hide_update_running_message();
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("user-messages").innerHTML = "";
    document.getElementById("volunteer-messages").innerHTML = "";
    document.getElementById("History").innerHTML = "";
}

function hideLogIncident(){
    document.getElementById("logging_message").innerHTML="";
}

async function SubmittedCount() {
    const response = await fetch('http://localhost:3000/getSubmittedCount', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch count submitted");
        return;
    }
    const countSubmitted = await response.json();
    const SubmittedList = document.getElementById("SubmittedList");
    const SubmittedOption = document.getElementById("SubmittedOption");
    SubmittedList.innerHTML = "";

    if (countSubmitted.totalSubmitted === 0) {
        SubmittedOption.style.display = "block"; 
        document.getElementById("SubmittedMenu").disabled = true; 
    } else {
        SubmittedOption.style.display = "none"; 
        document.getElementById("SubmittedMenu").disabled = false;

        const res = await fetch('http://localhost:3000/getSubmittedIncidents', {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            console.error("Failed to fetch submitted incidents");
            return;
        }
        const SubmittedInfo = await res.json();
        SubmittedupdateDropdown(countSubmitted.totalSubmitted, SubmittedInfo);
    }
}

function SubmittedupdateDropdown(totalSubmitted, SubmittedInfo) {
    const submitted_incident = document.getElementById("submitted-incident");
    submitted_incident.textContent = `${totalSubmitted}`;

    const menuList = document.getElementById("SubmittedList");
    menuList.querySelectorAll(".incidents-option").forEach((option) => option.remove());
  
    for (const incidents of SubmittedInfo) {
        const listItem = document.createElement("li");
        listItem.className = "incidents-option d-flex justify-content-between align-items-center";
        const incidentID= document.createElement("span");
        const updateButton = document.createElement("button");
        updateButton.className = "btn btn-primary btn-sm";
        updateButton.textContent = "update";
        incidentID.textContent = `Code ${incidents.incident_id} from ${incidents.user_type}`;

        updateButton.onclick = () => showSubmittedIncidents(incidents);
        listItem.appendChild(incidentID);
        listItem.appendChild(updateButton);
        menuList.insertBefore(listItem, document.getElementById("SubmittedOption"));
    }
}

function showSubmittedIncidents(incidents) {
    document.getElementsByClassName("TypeOfIncidentSubmitted").value = incidents.incident_type;

    view_update_message();
    /*Αναγκαστικά κάτω από το view_update_message γιατί αλλιώς δεν υπάρχουν τα fireSubmitted κλπ*/
    if(incidents.incident_type === "fire"){
        document.getElementById("fireSubmitted").checked = true;
    }else{
        document.getElementById("accidentSubmitted").checked = true;
    }

    document.getElementById("ID").textContent = incidents.incident_id;
    document.getElementById("ID").value = incidents.incident_id;
    document.getElementById("IncidentSubmittedDescription").value = incidents.description;
    document.getElementById("PhoneNumber").value = incidents.user_phone;
    document.getElementById("IncidentSubmittedAddress").value = incidents.address;
    document.getElementById("prefectureSubmitted").value = incidents.prefecture;
    document.getElementById("prefectureSubmitted").selected = incidents.prefecture;
    if(incidents.municipality === "null"){
        document.getElementById("municipalitySubmitted").value = " ";
    }else{
        document.getElementById("municipalitySubmitted").value = incidents.municipality;
    } 
    makeAjaxReqSub();
}

async function RunningCount() {
    const response = await fetch('http://localhost:3000/getRunningCount', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch count running");
        return;
    }
    const countRunning = await response.json();
    const RunningList = document.getElementById("RunningList");
    const RunningOption = document.getElementById("RunningOption");
    RunningList.innerHTML = "";

    if (countRunning.totalRunning === 0) {
        RunningOption.style.display = "block"; 
        document.getElementById("RunningMenu").disabled = true; 
    } else {
        RunningOption.style.display = "none"; 
        document.getElementById("RunningMenu").disabled = false;

        const res = await fetch('http://localhost:3000/getRunningIncidents', {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            console.error("Failed to fetch running incidents");
            return;
        }
        const RunningInfo = await res.json();
        RunningupdateDropdown(countRunning.totalRunning, RunningInfo);
    }
}

function RunningupdateDropdown(totalRunning, RunningInfo) {
    const running_incident = document.getElementById("running-incident");
    running_incident.textContent = `${totalRunning}`;

    const menuList = document.getElementById("RunningList");
    menuList.querySelectorAll(".incidents-option").forEach((option) => option.remove());
  
    for (const incidents of RunningInfo) {
        const listItem = document.createElement("li");
        listItem.className = "incidents-option d-flex justify-content-between align-items-center";
        const incidentID= document.createElement("span");
        const updateButton = document.createElement("button");
        updateButton.className = "btn btn-primary btn-sm";
        updateButton.textContent = "update";
        incidentID.textContent = `Code ${incidents.incident_id} from ${incidents.user_type}`;

        updateButton.onclick = () => showRunningIncidents(incidents);
        listItem.appendChild(incidentID);
        listItem.appendChild(updateButton);
        menuList.insertBefore(listItem, document.getElementById("RunningOption"));
    }
}

async function showRunningIncidents(incidents) {
    view_update_running_message();
    /*Αναγκαστικά κάτω από το view_update_running_message γιατί αλλιώς δεν υπάρχουν τα id κλπ*/
    const IncidentId = incidents.incident_id;
    const response = await fetch(`http://localhost:3000/getCountDriversRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running drivers from base");
        return;
    }
    const CountDrivers = await response.json();

    const response2 = await fetch(`http://localhost:3000/getCountSimplesRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running drivers from base");
        return;
    }
    const CountSimples = await response2.json();
    document.getElementById("TypeOfIncidentRunning").textContent = incidents.incident_type;
    document.getElementById("TypeOfIncidentRunning").value = incidents.incident_type;
    document.getElementById("ID").textContent = incidents.incident_id;
    document.getElementById("RequestVehicles").textContent = incidents.vehicles;
    document.getElementById("RequestFiremen").textContent = incidents.firemen;
    document.getElementById("RunningVehicles").textContent = CountDrivers.totalDrivers;
    document.getElementById("RunningFiremen").textContent = CountSimples.totalSimples;
    document.getElementById("IncidentRunningDescription").value = incidents.description;
    document.getElementById("PhoneNumber").value = incidents.user_phone;
    document.getElementById("IncidentRunningAddress").value = incidents.address;
    document.getElementById("prefectureRunning").value = incidents.prefecture;
    document.getElementById("prefectureRunning").selected = incidents.prefecture;
    if(incidents.municipality === "null"){
        document.getElementById("municipalityRunning").value = " ";
    }else{
        document.getElementById("municipalityRunning").value = incidents.municipality;
    } 
    view_message_running();
    if(incidents.danger === "high"){
        document.getElementById("high").checked = true;
    }else if(incidents.danger === "medium"){
        document.getElementById("medium").checked = true;
    }else if(incidents.danger === "low"){
        document.getElementById("low").checked = true;
    }else if(incidents.danger === "unknown"){
        document.getElementById("unknown").checked = true;
    }
    check_requests();
    makeAjaxReqRun();
}

async function Incident_Logging() {
    const typeOfIncident = document.querySelector('input[name="TypeOfIncident"]:checked').value;
    const typeOfDanger = document.querySelector('input[name="TypeOfDanger"]:checked').value;

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

    const formData = {
        incident_type: typeOfIncident,
        description: document.getElementById("IncidentDescription").value,
        user_phone: "2813407000",
        user_type: "admin",
        address: document.getElementById("IncidentAddress").value,
        lat: position_lat,
        lon: position_lon,
        municipality: document.getElementById("municipality").value,
        prefecture: document.getElementById("prefecture").value,
        start_datetime: now,
        end_datetime: null,
        danger: typeOfDanger,
        status: "running",
        finalResult: "null",
        vehicles: document.getElementById("vehicles").value,
        firemen: document.getElementById("firemen").value
    };

    const res = await fetch("http://localhost:3000/AddAdminIncident", {
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
    ////////////////////////////////////////
    const response = await fetch(`http://localhost:3000/getAdminIncidentID?Description=${document.getElementById("IncidentDescription").value}&Startday=${now}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch get ID");
        return;
    }
    const IncidentID = await response.json();
    Makeparticipants(0,IncidentID[0].incident_id); ///(0) Κάνει φόρμα ο admin και στέλνει και το id του incident
}

function view_update_message(){
    var message = `
        <div id="UpdateSubmittedIncidentForm" class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <form id="Submitted-Incident-Update" onsubmit="Update_Submitted_Incident();return false">
                        <h2 class="card-title">Submitted Incident ID: <span id="ID"></span></h2>
                        <div class="form-group">
                            <div class="rdio">
                                <div id="TypeIncidentSubmittedRadio">
                                    <label for="TypeIncidentRadio"> Type of Incident:
                                        <input type="radio" class="TypeOfIncidentSubmitted" id="fireSubmitted" name="TypeOfIncidentSubmitted" value="fire" />fire
                                        <input type="radio" class="TypeOfIncidentSubmitted" id="accidentSubmitted" name="TypeOfIncidentSubmitted" value="accident" />accident
                                    </label>
                                </div>
                        </div>
                        <div class="form-group">
                            <label for="TypeIncidentSubmittedDescription"> Description:</label>
                            <textarea id="IncidentSubmittedDescription" name="description" maxlength="100" required></textarea>
                        </div>
                        <div class="form-group">
                        <label for="PhoneNumber">Phone Number:</label>
                            <input type="text" class="form-control" id="PhoneNumber" name="PhoneNumber" value="This is a description" readonly style="background-color:rgb(133, 129, 129);color: white;">
                        </div>
                        <div class="form-group">
                            <label for="IncidentSubmittedAddress" class="form-label">Address:</label>
                            <input type="text" class="form-control" id="IncidentSubmittedAddress" maxlength="100" oninput="makeAjaxReqSub()" required>
                        </div>
                        <div class="form-group"></div>
                            <label for="prefecture">Select prefecture Of Crete</label>
                                <select class="form-select" id="prefectureSubmitted" name="prefectureSubmitted" onclick="makeAjaxReqSub()">
                                    <option value="Chania">Chania</option>
                                    <option value="Heraklion">Heraklion</option>
                                    <option value="Lassithi">Lassithi</option>
                                    <option value="Rethimnon">Rethimnon</option>
                                </select>
                        </div>
                        <div class="form-group">
                            <label for="municipality">Municipality:</label>
                            <input type="text" id="municipalitySubmitted" name="municipalitySubmitted" pattern=".{3,30}" title="3-30 letters" oninput="makeAjaxReqSub()" required>
                        </div>

                        <div class="form-group">
                            <span id="errorrequest" style="color: red;"></span>
                            <div hidden id="Map" style="width: 100%; height: 400px; color: black"></div>
                        </div>
                        
                        <div class="form-group">
                            <div class="rdio1">
                                <div id="StatusSubmittedRadio">
                                    <label for="status">Status:
                                        <input type="radio" class="StatusSubmitted" id="fakeSubmitted" name="StatusSubmitted" value="fake" onclick="hide_message()" checked/>fake
                                        <input type="radio" class="StatusSubmitted" id="runningSubmitted" name="StatusSubmitted" value="running" onclick="view_message()"/>real
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div id="real_message"></div>

                        <div class="d-grid gap-2">
                            <button type="submit">Update Incident</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.getElementById("update_message").innerHTML=message;
    hideLogIncident();
    hide_update_running_message();
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("user-messages").innerHTML = "";
    document.getElementById("volunteer-messages").innerHTML = "";
    document.getElementById("History").innerHTML = "";
}

function hide_update_message(){
    document.getElementById("update_message").innerHTML="";
}

function view_update_running_message() {
    var message = `
        <div id="UpdateRunningIncidentForm" class="col-md-8">
            <div class="card">
                <div class="card-body">
                    <form id="Running-Incident-Update" >
                        <h2 class="card-title">Running Incident ID: <span id="ID"></span> <span id="TypeOfIncidentRunning"></span></h2>
                        <h4 class="card-title">Running Vehicles: <span id="RunningVehicles"></span>/<span id="RequestVehicles"></span>  
                        <div class="d-grid gap-2">
                            <button type="button" onclick="View_Drivers()"> View drivers </button>
                        </div>
                        <br>
                        <div id="driversList"></div>
                        </h4>
                        <h4 class="card-title">Running Firemen: <span id="RunningFiremen"></span>/<span id="RequestFiremen"></span>  
                        <div class="d-grid gap-2">
                            <button type="button" onclick="View_Simples()"> View simples </button>
                        </div>
                        <br>
                        <div id="simplesList"></div>
                        </h4>
                        <br>
                        <div class="form-group">
                            <label for="TypeIncidentRunningDescription"> Description:</label>
                            <textarea id="IncidentRunningDescription" name="description" maxlength="100" required></textarea>
                        </div>
                        <div class="form-group">
                        <label for="PhoneNumber">Phone Number:</label>
                            <input type="text" class="form-control" id="PhoneNumber" name="PhoneNumber" readonly style="background-color:rgb(133, 129, 129);color: white;">
                        </div>
                        <div class="form-group">
                            <label for="IncidentRunningAddress" class="form-label">Address:</label>
                            <input type="text" class="form-control" id="IncidentRunningAddress" readonly style="background-color:rgb(133, 129, 129);color: white;">
                        </div>
                        <div class="form-group">
                            <label for="prefecture">Prefecture Of Crete</label>
                            <input type="text" class="form-control" id="prefectureRunning" name="prefectureRunning" readonly style="background-color:rgb(133, 129, 129);color: white;">
                        </div>
                        <div class="form-group">
                            <label for="municipality">Municipality:</label>
                            <input type="text" class="form-control" id="municipalityRunning" name="municipalityRunning" readonly style="background-color:rgb(133, 129, 129);color: white;">
                        </div>

                        <div class="form-group">
                            <span id="errorrequest" style="color: red;"></span>
                            <div hidden id="Map" style="width: 100%; height: 400px; color: black"></div>
                        </div>

                        <div class="form-group">
                            <div class="rdio1">
                                <div id="StatusRunningRadio">
                                    <label for="status">Status:
                                        <input type="radio" class="StatusRunning" id="running" name="StatusRunning" value="running" onclick="view_message_running()" checked/>running
                                        <input type="radio" class="StatusRunning" id="finished" name="StatusRunning" value="finished" onclick="hide_message_running()"/>finished
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div id="running_message"></div>

                        <div class="d-grid gap-2" id="running_update"></div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.getElementById("update_running_message").innerHTML = message;
    hideLogIncident();
    hide_update_message();
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("user-messages").innerHTML = "";
    document.getElementById("volunteer-messages").innerHTML = "";
    document.getElementById("History").innerHTML = "";
    
}

function hide_update_running_message(){
    document.getElementById("update_running_message").innerHTML="";
}

async function View_Drivers(){
    const IncidentId = document.getElementById("ID").textContent.trim();
    const response = await fetch(`http://localhost:3000/getCountDriversRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running drivers from base");
        return;
    }
    const CountDrivers = await response.json();

    const response2 = await fetch(`http://localhost:3000/getDriversRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running drivers from base");
        return;
    }
    const Drivers = await response2.json();

    const driversList = document.getElementById('driversList');

    if (driversList.style.display === 'block') {
        driversList.style.display = 'none';
        driversList.innerHTML = ''; 
        return;
    }

    driversList.style.display = 'block';

    for (var i = 0; i < CountDrivers.totalDrivers; i++) {
        const driver = Drivers[i];
        const VolunteerUsername = driver.volunteer_username;
        const res = await fetch(`http://localhost:3000/getVolunteerDetails?VolunteerUsername=${VolunteerUsername}`, {
            method: 'GET',
            credentials: 'include'
        });
    
        if (!response.ok) {
            console.error("Failed to fetch get volunteer details");
            return;
        }
        const VolunteerDetails = await res.json(); 

        const driverElement = document.createElement('p');
        driverElement.textContent = `${driver.volunteer_username}`;

        const button = document.createElement('button');
        button.textContent = 'View Details';
    
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            var go = 0;
        
            let details = driverElement.querySelector('.details');
            if (details) {
                go = 0;
                details.remove();
                button.textContent = 'View Details'; 
            } else {
                go = 1;
                details = document.createElement('div');
                details.classList.add('details');
                details.innerHTML = `
                    <label for="email">Email:</label>
                    <input type="text" class="form-control" id="email" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="firstname">Firstname:</label>
                    <input type="text" class="form-control" id="firstname" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="lastname">Lastname:</label>
                    <input type="text" class="form-control" id="lastname" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="height">Height:</label>
                    <input type="text" class="form-control" id="height" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="weight">Weight:</label>
                    <input type="text" class="form-control" id="weight" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="address">Address:</label>
                    <input type="text" class="form-control" id="address" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="job">Job:</label>
                    <input type="text" class="form-control" id="job" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="telephone">Telephone:</label>
                    <input type="text" class="form-control" id="telephone" readonly style="background-color:rgb(133, 129, 129); color: white;">
                `;
                driverElement.appendChild(details); 
                button.textContent = 'Hide Details';
            }
            if(go === 1){
                document.getElementById("email").value = VolunteerDetails[0].email;
                document.getElementById("firstname").value = VolunteerDetails[0].firstname;
                document.getElementById("lastname").value = VolunteerDetails[0].lastname;
                document.getElementById("height").value = VolunteerDetails[0].height;
                document.getElementById("weight").value = VolunteerDetails[0].weight;
                document.getElementById("address").value = VolunteerDetails[0].address;
                document.getElementById("job").value = VolunteerDetails[0].job;
                document.getElementById("telephone").value = VolunteerDetails[0].telephone;
            }
        });
        driversList.appendChild(driverElement);
        driversList.appendChild(button);
    }
}

async function View_Simples(){
    const IncidentId = document.getElementById("ID").textContent.trim();
    const response = await fetch(`http://localhost:3000/getCountSimplesRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running simple from base");
        return;
    }
    const CountSimples = await response.json();

    const response2 = await fetch(`http://localhost:3000/getSimplesRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running simple from base");
        return;
    }
    const Simples = await response2.json();

    const simplesList = document.getElementById('simplesList');

    if (simplesList.style.display === 'block') {
        simplesList.style.display = 'none';
        simplesList.innerHTML = ''; 
        return;
    }

    simplesList.style.display = 'block';
    for (var i = 0; i < CountSimples.totalSimples; i++) {
        const simple = Simples[i];
        const VolunteerUsername = simple.volunteer_username;
        const res = await fetch(`http://localhost:3000/getVolunteerDetails?VolunteerUsername=${VolunteerUsername}`, {
            method: 'GET',
            credentials: 'include'
        });
    
        if (!response.ok) {
            console.error("Failed to fetch get volunteer details");
            return;
        }
        const VolunteerDetails = await res.json(); 

        const simpleElement = document.createElement('p');
        simpleElement.textContent = `${simple.volunteer_username}`;

        const button = document.createElement('button');
        button.textContent = 'View Details';
    
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            var go = 0;
        
            let details = simpleElement.querySelector('.details');
            if (details) {
                go = 0;
                details.remove();
                button.textContent = 'View Details'; 
            } else {
                go = 1;
                details = document.createElement('div');
                details.classList.add('details');
                details.innerHTML = `
                    <label for="email2">Email:</label>
                    <input type="text" class="form-control" id="email2" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="firstname2">Firstname:</label>
                    <input type="text" class="form-control" id="firstname2" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="lastname2">Lastname:</label>
                    <input type="text" class="form-control" id="lastname2" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="height2">Height:</label>
                    <input type="text" class="form-control" id="height2" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="weight2">Weight:</label>
                    <input type="text" class="form-control" id="weight2" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="address2">Address:</label>
                    <input type="text" class="form-control" id="address2" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="job2">Job:</label>
                    <input type="text" class="form-control" id="job2" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="telephone2">Telephone:</label>
                    <input type="text" class="form-control" id="telephone2" readonly style="background-color:rgb(133, 129, 129); color: white;">
                `;
                simpleElement.appendChild(details); 
                button.textContent = 'Hide Details';
            }
            if(go === 1){
                document.getElementById("email2").value = VolunteerDetails[0].email;
                document.getElementById("firstname2").value = VolunteerDetails[0].firstname;
                document.getElementById("lastname2").value = VolunteerDetails[0].lastname;
                document.getElementById("height2").value = VolunteerDetails[0].height;
                document.getElementById("weight2").value = VolunteerDetails[0].weight;
                document.getElementById("address2").value = VolunteerDetails[0].address;
                document.getElementById("job2").value = VolunteerDetails[0].job;
                document.getElementById("telephone2").value = VolunteerDetails[0].telephone;
            }
        });
        simplesList.appendChild(simpleElement);
        simplesList.appendChild(button);
    }
}

function view_message(){
    var message = `
        <div class="form-group">
            <div class="rdio2">
                <div id="DangerRadio">
                    <label for="danger">Danger:
                        <input type="radio" class="TypeOfDangerSubmitted" id="high" name="TypeOfDangerSubmitted" value="high" />high
                        <input type="radio" class="TypeOfDangerSubmitted" id="medium" name="TypeOfDangerSubmitted" value="medium" />medium
                        <input type="radio" class="TypeOfDangerSubmitted" id="low" name="TypeOfDangerSubmitted" value="low" />low
                        <input type="radio" class="TypeOfDangerSubmitted" id="unknown" name="TypeOfDangerSubmitted" value="unknown"/>unknown
                    </label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="vehicles" class="form-label">Vehicles:</label>
            <input type="number" class="form-control" id="vehicles" value="0" min="0">
        </div>
        <div class="form-group">
            <label for="firemen" class="form-label">Firemen:</label>
            <input type="number" class="form-control" id="firemen" value="0" min="0">
        </div>
    `;
    document.getElementById("real_message").innerHTML=message;
}

function hide_message(){
    document.getElementById("real_message").innerHTML="";
}

function view_message_running(){
    var message2 = `
        <button type="submit" onclick="Update_Running_Incident()">Update Running</button>
    `;
    document.getElementById("running_update").innerHTML=message2;

    var message = `
        <div class="form-group">
            <div class="rdio2">
                <div id="DangerRadio">
                    <label for="danger">Danger:
                        <input type="radio" class="TypeOfDangerRunning" id="high" name="TypeOfDangerRunning" value="high" />high
                        <input type="radio" class="TypeOfDangerRunning" id="medium" name="TypeOfDangerRunning" value="medium" />medium
                        <input type="radio" class="TypeOfDangerRunning" id="low" name="TypeOfDangerRunning" value="low" />low
                        <input type="radio" class="TypeOfDangerRunning" id="unknown" name="TypeOfDangerRunning" value="unknown"/>unknown
                    </label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="vehicles" class="form-label">Vehicles:</label>
            <input type="number" class="form-control" id="vehicles" value="0" min="0">
        </div>
        <div class="form-group">
            <label for="firemen" class="form-label">Firemen:</label>
            <input type="number" class="form-control" id="firemen" value="0" min="0">
        </div>

        <h4 class="card-title">Request Vehicles: <span id="RequestVehiclesWithVol"></span>  
        <div class="d-grid gap-2">
            <button type="button" onclick="View_Request_Drivers();"> View drivers requests</button>
        </div>
        <br>
        <div id="driversRequestList"></div>
        </h4>

        <h4 class="card-title">Request Firemen: <span id="RequestFiremenWithVol"></span>  
        <div class="d-grid gap-2">
            <button type="button" onclick="View_Request_Simples()"> View simples requests</button>
        </div>
        <br>

        <div class="form-group">
            <h4>Share this Incident:</h4>
            <div class="d-grid gap-2">
                <a href="#" id="facebook-share" class="btn btn-primary" target="_blank">Share on Facebook</a>
                <a href="#" id="twitter-share" class="btn btn-info" target="_blank">Share on Twitter</a>
                <a href="https://www.instagram.com/" id="instagram-share" class="btn btn-danger" target="_blank">Share on Instagram</a>
            </div>
        </div>
        <div id="simplesRequestList"></div>
        </h4>
    `;
    document.getElementById("running_message").innerHTML=message;

    
    // Ενημέρωση των URLs για τα social media
    const incidentId = document.getElementById("ID") ? document.getElementById("ID").innerText : "unknown";
    const incidentDescription = document.getElementById("IncidentRunningDescription") ? document.getElementById("IncidentRunningDescription").value : "No description provided";
    const shareUrl = `https://example.com/incidents/${incidentId}`;
    
    document.getElementById("facebook-share").href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    document.getElementById("twitter-share").href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(incidentDescription)}&url=${encodeURIComponent(shareUrl)}`;

    
}

function hide_message_running(){
    document.getElementById("running_update").innerHTML="";
    var message = `
        <h4 class="card-title"> Drivers:</h4>
        <div id="Vehicles1"></div>

        <h4 class="card-title"> Simples:</h4>
        <div id="Simples1"></div>
        <br>
        <label for="finalResult">Final Result:</label>
        <input type="text" class="form-control" id="finalResult" required style="background-color:rgb(234, 190, 190);" oninput="validateAllFields()">

        <div id="SubmitEnd"></div>
    `;
    document.getElementById("running_message").innerHTML=message;
    Finished_Drivers();
    Finished_Simples();
}

async function Finished_Drivers(){
    const IncidentId = document.getElementById("ID").textContent.trim();
    const response = await fetch(`http://localhost:3000/getCountDriversRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running drivers from base");
        return;
    }
    const CountDrivers = await response.json();

    const response2 = await fetch(`http://localhost:3000/getDriversRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running drivers from base");
        return;
    }
    const Drivers = await response2.json();

    const driversList = document.getElementById('Vehicles1');

    if (driversList.style.display === 'block') {
        driversList.style.display = 'none';
        driversList.innerHTML = ''; 
        return;
    }

    driversList.style.display = 'block';

    for (var i = 0; i < CountDrivers.totalDrivers; i++) {
        const driver = Drivers[i];
        const VolunteerUsername = driver.volunteer_username;
        const res = await fetch(`http://localhost:3000/getVolunteerDetails?VolunteerUsername=${VolunteerUsername}`, {
            method: 'GET',
            credentials: 'include'
        });
    
        if (!response.ok) {
            console.error("Failed to fetch get volunteer details");
            return;
        }
        const VolunteerDetails = await res.json(); 

        const driverElement = document.createElement('p');
        driverElement.textContent = `${driver.volunteer_username}`;

        const details = document.createElement('div');
        details.classList.add('details');
        details.innerHTML = `
            <label for="comment">Comment:</label>
            <input type="text" class="form-control" id="comment" oninput="validateAllFields()" required>
        `;

        driverElement.appendChild(details);
        driversList.appendChild(driverElement);
    }
}

async function Finished_Simples(){
    const IncidentId = document.getElementById("ID").textContent.trim();
    const response = await fetch(`http://localhost:3000/getCountSimplesRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running simple from base");
        return;
    }
    const CountSimples = await response.json();

    const response2 = await fetch(`http://localhost:3000/getSimplesRunning?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch running simple from base");
        return;
    }
    const Simples = await response2.json();

    const simplesList = document.getElementById('Simples1');

    if (simplesList.style.display === 'block') {
        simplesList.style.display = 'none';
        simplesList.innerHTML = ''; 
        return;
    }

    simplesList.style.display = 'block';
    for (var i = 0; i < CountSimples.totalSimples; i++) {
        const simple = Simples[i];
        const VolunteerUsername = simple.volunteer_username;
        const res = await fetch(`http://localhost:3000/getVolunteerDetails?VolunteerUsername=${VolunteerUsername}`, {
            method: 'GET',
            credentials: 'include'
        });
    
        if (!response.ok) {
            console.error("Failed to fetch get volunteer details");
            return;
        }
        const VolunteerDetails = await res.json(); 

        const simpleElement = document.createElement('p');
        simpleElement.textContent = `${simple.volunteer_username}`;

        const details = document.createElement('div');
        details.classList.add('details');
        details.innerHTML = `
            <label for="comment">Comment:</label>
            <input type="text" class="form-control" id="comment" oninput="validateAllFields()" required>
        `;
        simpleElement.appendChild(details);
        simplesList.appendChild(simpleElement);
    }
}

function validateAllFields() {
    const finalResult = document.getElementById("finalResult").value.trim();
    const comments = document.querySelectorAll('#comment');

    for (const comment of comments) {
        if (!comment.value.trim()) {
            document.getElementById("SubmitEnd").innerHTML="";
            return;
        }
    }
    
    if (!finalResult) {
        document.getElementById("SubmitEnd").innerHTML="";
        return;
    }else{
        var message = `
        <button type="submit" onclick="End_Incident()" id="submitButton"> Incident End</button>
        `;
        document.getElementById("SubmitEnd").innerHTML=message;
    }
}

async function End_Incident() {
    const finalResult = document.getElementById("finalResult").value.trim();

    const driversList = document.getElementById("Vehicles1").children;
    const simplesList = document.getElementById("Simples1").children;

    const commentsData = [];
    
    for (let i = 0; i < driversList.length; i++) {
        const driverElement = driversList[i];
        const username = driverElement.textContent.split('\n')[0].trim();
        const commentElement = driverElement.querySelector('#comment');
        
        if (commentElement) {
            commentsData.push({
                username,
                comment: commentElement.value.trim(),
                type: "driver"
            });
        }
    }

    for (let i = 0; i < simplesList.length; i++) {
        const simpleElement = simplesList[i];
        const username = simpleElement.textContent.split('\n')[0].trim();
        const commentElement = simpleElement.querySelector('#comment');
        
        if (commentElement) {
            commentsData.push({
                username,
                comment: commentElement.value.trim(),
                type: "simple"
            });
        }
    }


    
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

    const IncidentId = document.getElementById("ID").textContent.trim();
    const response = await fetch(`http://localhost:3000/EndIncident?IncidentID=${IncidentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            end_datetime: now,
            status: "finished",
            finalResult: finalResult,
            incident_id: IncidentId
        })
    });
    if (!response.ok) {
        console.error("Failed Incident data saved to database");
        return;
    }

    for (let i = 0; i < commentsData.length; i++) {
        const response2 = await fetch(`http://localhost:3000/EndParticipants?IncidentID=${IncidentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                status: "finished",
                success: "YES",
                comment: commentsData[i].comment,
                volunteer_username: commentsData[i].username,
                incident_id: IncidentId,
                volunteer_type: commentsData[i].type,   
            })
        });
        if (!response2.ok) {
            console.error("Failed Incident data saved to database");
            return;
        }
    }
    window.location.reload();
}

async function View_Request_Drivers(){
    const IncidentId = document.getElementById("ID").textContent.trim();
    const response = await fetch(`http://localhost:3000/getCountDriversRequest?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch request drivers from base");
        return;
    }
    const CountDrivers = await response.json();

    const response2 = await fetch(`http://localhost:3000/getDriversRequest?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch request drivers from base");
        return;
    }
    const Drivers = await response2.json();

    const driversRequestList = document.getElementById('driversRequestList');

    if (driversRequestList.style.display === 'block') {
        driversRequestList.style.display = 'none';
        driversRequestList.innerHTML = ''; 
        return;
    }

    driversRequestList.style.display = 'block';
    for (var i = 0; i < CountDrivers.totalRequestDrivers; i++) {
        const driver = Drivers[i];
        const VolunteerUsername = driver.volunteer_username;
        const res = await fetch(`http://localhost:3000/getVolunteerDetails?VolunteerUsername=${VolunteerUsername}`, {
            method: 'GET',
            credentials: 'include'
        });
    
        if (!res.ok) {
            console.error("Failed to fetch get volunteer details");
            return;
        }
        const VolunteerDetails = await res.json(); 

        const driverRequestElement = document.createElement('p');
        driverRequestElement.textContent = `${driver.volunteer_username}`;

        //////////////////
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.style.backgroundColor = 'green';
        acceptButton.style.color = 'white';
        acceptButton.style.marginLeft = '10px';

        acceptButton.addEventListener('click', async () => {
            const response1 = await fetch(`http://localhost:3000/acceptRequest`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: "accepted",
                    participant_id: driver.participant_id
                })
            });

            if (!response1.ok) {
                console.error("Failed to fetch get volunteer details");
                return;
            }else{
                window.location.reload();
            }
        });

        //Decline Button
        const declineButton = document.createElement('button');
        declineButton.textContent = 'Decline';
        declineButton.style.backgroundColor = 'red';
        declineButton.style.color = 'white';
        declineButton.style.marginLeft = '5px';

        declineButton.addEventListener('click', async () => {
            const response2 = await fetch(`http://localhost:3000/declineRequest`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    volunteer_username: "null",
                    participant_id: driver.participant_id
                })
            });

            if (!response2.ok) {
                console.error("Failed to fetch get volunteer details");
                return;
            }else{
                window.location.reload();
            }
        });
        //////////////////

        const button = document.createElement('button');
        button.style.marginLeft = '5px';
        button.textContent = 'View Details';
    
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            var go = 0;
        
            let details = driverRequestElement.querySelector('.details');
            if (details) {
                go = 0;
                details.remove();
                button.textContent = 'View Details'; 
            } else {
                go = 1;
                details = document.createElement('div');
                details.classList.add('details');
                details.innerHTML = `
                    <label for="email3">Email:</label>
                    <input type="text" class="form-control" id="email3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="firstname3">Firstname:</label>
                    <input type="text" class="form-control" id="firstname3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="lastname3">Lastname:</label>
                    <input type="text" class="form-control" id="lastname3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="height3">Height:</label>
                    <input type="text" class="form-control" id="height3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="weight3">Weight:</label>
                    <input type="text" class="form-control" id="weight3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="address3">Address:</label>
                    <input type="text" class="form-control" id="address3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="job3">Job:</label>
                    <input type="text" class="form-control" id="job3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="telephone3">Telephone:</label>
                    <input type="text" class="form-control" id="telephone3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                `;
                driverRequestElement.appendChild(details); 
                button.textContent = 'Hide Details';
            }
            if(go === 1){
                document.getElementById("email3").value = VolunteerDetails[0].email;
                document.getElementById("firstname3").value = VolunteerDetails[0].firstname;
                document.getElementById("lastname3").value = VolunteerDetails[0].lastname;
                document.getElementById("height3").value = VolunteerDetails[0].height;
                document.getElementById("weight3").value = VolunteerDetails[0].weight;
                document.getElementById("address3").value = VolunteerDetails[0].address;
                document.getElementById("job3").value = VolunteerDetails[0].job;
                document.getElementById("telephone3").value = VolunteerDetails[0].telephone;
            }
        });
        driversRequestList.appendChild(driverRequestElement);
        driversRequestList.appendChild(acceptButton);
        driversRequestList.appendChild(declineButton);
        driversRequestList.appendChild(button);
    }
}

async function View_Request_Simples(){
    const IncidentId = document.getElementById("ID").textContent.trim();
    const response = await fetch(`http://localhost:3000/getCountSimplesRequest?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch request drivers from base");
        return;
    }
    const CountSimples = await response.json();

    const response2 = await fetch(`http://localhost:3000/getSimplesRequest?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch request drivers from base");
        return;
    }
    const Simples = await response2.json();

    const simplesRequestList = document.getElementById('simplesRequestList');

    if (simplesRequestList.style.display === 'block') {
        simplesRequestList.style.display = 'none';
        simplesRequestList.innerHTML = ''; 
        return;
    }

    simplesRequestList.style.display = 'block';
    for (var i = 0; i < CountSimples.totalRequestSimples; i++) {
        const simple = Simples[i];
        const VolunteerUsername = simple.volunteer_username;
        const res = await fetch(`http://localhost:3000/getVolunteerDetails?VolunteerUsername=${VolunteerUsername}`, {
            method: 'GET',
            credentials: 'include'
        });
    
        if (!response.ok) {
            console.error("Failed to fetch get volunteer details");
            return;
        }
        const VolunteerDetails = await res.json(); 

        const simpleRequestElement = document.createElement('p');
        simpleRequestElement.textContent = `${simple.volunteer_username}`;

        //////////////////
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.style.backgroundColor = 'green';
        acceptButton.style.color = 'white';
        acceptButton.style.marginLeft = '10px';

        acceptButton.addEventListener('click', async () => {
            const response1 = await fetch(`http://localhost:3000/acceptRequest`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: "accepted",
                    participant_id: simple.participant_id
                })
            });

            if (!response1.ok) {
                console.error("Failed to fetch get volunteer details");
                return;
            }else{
                window.location.reload();
            }
        });

        //Decline Button
        const declineButton = document.createElement('button');
        declineButton.textContent = 'Decline';
        declineButton.style.backgroundColor = 'red';
        declineButton.style.color = 'white';
        declineButton.style.marginLeft = '5px';

        declineButton.addEventListener('click', async () => {
            const response2 = await fetch(`http://localhost:3000/declineRequest`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    volunteer_username: "null",
                    participant_id: simple.participant_id
                })
            });

            if (!response2.ok) {
                console.error("Failed to fetch get volunteer details");
                return;
            }else{
                window.location.reload();
            }
        });
        //////////////////

        const button = document.createElement('button');
        button.textContent = 'View Details';
    
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            var go = 0;
        
            let details = simpleRequestElement.querySelector('.details');
            if (details) {
                go = 0;
                details.remove();
                button.textContent = 'View Details'; 
            } else {
                go = 1;
                details = document.createElement('div');
                details.classList.add('details');
                details.innerHTML = `
                    <label for="email3">Email:</label>
                    <input type="text" class="form-control" id="email3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="firstname3">Firstname:</label>
                    <input type="text" class="form-control" id="firstname3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="lastname3">Lastname:</label>
                    <input type="text" class="form-control" id="lastname3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="height3">Height:</label>
                    <input type="text" class="form-control" id="height3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="weight3">Weight:</label>
                    <input type="text" class="form-control" id="weight3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="address3">Address:</label>
                    <input type="text" class="form-control" id="address3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="job3">Job:</label>
                    <input type="text" class="form-control" id="job3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                    <label for="telephone3">Telephone:</label>
                    <input type="text" class="form-control" id="telephone3" readonly style="background-color:rgb(133, 129, 129); color: white;">
                `;
                simpleRequestElement.appendChild(details); 
                button.textContent = 'Hide Details';
            }
            if(go === 1){
                document.getElementById("email3").value = VolunteerDetails[0].email;
                document.getElementById("firstname3").value = VolunteerDetails[0].firstname;
                document.getElementById("lastname3").value = VolunteerDetails[0].lastname;
                document.getElementById("height3").value = VolunteerDetails[0].height;
                document.getElementById("weight3").value = VolunteerDetails[0].weight;
                document.getElementById("address3").value = VolunteerDetails[0].address;
                document.getElementById("job3").value = VolunteerDetails[0].job;
                document.getElementById("telephone3").value = VolunteerDetails[0].telephone;
            }
        });
        simplesRequestList.appendChild(simpleRequestElement);
        simplesRequestList.appendChild(acceptButton);
        simplesRequestList.appendChild(declineButton);
        simplesRequestList.appendChild(button);
    }
}

async function Update_Submitted_Incident() {
    const typeOfIncident = document.querySelector('input[name="TypeOfIncidentSubmitted"]:checked').value;
    const StatusSubmitted = document.querySelector('input[name="StatusSubmitted"]:checked').value;
    var typeOfDanger;
    if(StatusSubmitted === "running"){
        typeOfDanger = document.querySelector('input[name="TypeOfDangerSubmitted"]:checked').value;
    }
    

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

    if(StatusSubmitted === "running"){
        const formData = {
            incident_id: document.getElementById("ID").value,
            incident_type: typeOfIncident,
            description: document.getElementById("IncidentSubmittedDescription").value,
            address: document.getElementById("IncidentSubmittedAddress").value,
            lat: position_lat,
            lon: position_lon,
            municipality: document.getElementById("municipalitySubmitted").value,
            prefecture: document.getElementById("prefectureSubmitted").value,
            start_datetime: now,
            danger: typeOfDanger,
            status: "running",
            vehicles: document.getElementById("vehicles").value,
            firemen: document.getElementById("firemen").value
        };

        const res2 = await fetch("http://localhost:3000/AdminUpdateSubmittedIncident", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        
        if (res2.status != 200) {
            alert("Error in database. ");
            return false;
        }
        Makeparticipants(1,0); ///(1) Κάνει update φόρμα ο admin πχ submitted ή running και δεν στέλνει το id του incident έχουμε άλλον τρόπο.
    }else if(StatusSubmitted === "fake"){
        const formData = {
            incident_id: document.getElementById("ID").value,
            status: "fake",
        };

        const res2 = await fetch("http://localhost:3000/AdminFakeIncident", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        
        if (res2.status != 200) {
            alert("Error in database. ");
            return false;
        }
        window.location.reload();
    }
}

async function Update_Running_Incident() {
    const StatusRunning = document.querySelector('input[name="StatusRunning"]:checked').value;
    var typeOfDanger;
    if(StatusRunning === "running"){
        typeOfDanger = document.querySelector('input[name="TypeOfDangerRunning"]:checked').value;
    }

    if (StatusRunning === "running") {
        const IncidentID = document.getElementById("ID").textContent;
        const response = await fetch(`http://localhost:3000/getVechiclesAndFiremen?IncidentID=${IncidentID}`, {
            method: 'GET',
            credentials: 'include'
        });
    
        if (!response.ok) {
            console.error("Failed to fetch Vehicles and Firemen");
            return;
        }
        const VechiclesAndFiremen = await response.json();
        
        const currentVehicles = parseInt(document.getElementById("vehicles").value);
        const currentFiremen = parseInt(document.getElementById("firemen").value);
        
        const NewVechicles = parseInt(VechiclesAndFiremen[0].vehicles) + currentVehicles;
        const NewFiremen = parseInt(VechiclesAndFiremen[0].firemen) + currentFiremen;

        var makevehicles = document.getElementById("vehicles").value;
        var makefiremen = document.getElementById("firemen").value;
        

        const formData = {
            incident_id: document.getElementById("ID").textContent,
            description: document.getElementById("IncidentRunningDescription").value,
            danger: typeOfDanger,
            vehicles: NewVechicles,
            firemen: NewFiremen,
            createvehicles: makevehicles,
            createfiremen: makefiremen
        };

        const res2 = await fetch("http://localhost:3000/AdminUpdateRunningIncident", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    }
}

async function Makeparticipants(what_form, Incident_Id){
    var vehicles = document.getElementById("vehicles").value;
    var firemen = document.getElementById("firemen").value;
    var incidentId ;
    if(what_form === 0){
        incidentId = Incident_Id;
    }else{
        incidentId = document.getElementById("ID").textContent;
    }

    for(var i=0; i<vehicles; i++){
        const formData = {
            incident_id: incidentId,
        };
        const res = await fetch("http://localhost:3000/CreateDriverParticipant", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        
        if (res.status != 200) {
            alert("Error in database. ");
            return false;
        }
    }

    for(var i=0; i<firemen; i++){
        const formData = {
            incident_id: incidentId,
        };
        const res = await fetch("http://localhost:3000/CreateSimpleParticipant", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        
        if (res.status != 200) {
            alert("Error in database. ");
            return false;
        }
    }
    window.location.reload();
}

async function check_requests(){
    const IncidentId = document.getElementById("ID").textContent.trim();
    const response = await fetch(`http://localhost:3000/getCountDriversRequest?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch request drivers from base");
        return;
    }
    const CountDrivers = await response.json();

    const response2 = await fetch(`http://localhost:3000/getCountSimplesRequest?IncidentID=${IncidentId}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response2.ok) {
        console.error("Failed to fetch request drivers from base");
        return;
    }
    const CountSimples = await response2.json();

    document.getElementById("RequestVehiclesWithVol").textContent = CountDrivers.totalRequestDrivers;
    document.getElementById("RequestFiremenWithVol").textContent = CountSimples.totalRequestSimples;
}

////////Statistics
async function pites(){

    const res = await fetch('http://localhost:3000/getCountRunningFireIncidents', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) {
        console.error("Failed to fetch count fire incidents");
        return;
    }
    const CountRunningFire = await res.json();

    const res2 = await fetch('http://localhost:3000/getCountRunningAccidentIncidents', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res2.ok) {
        console.error("Failed to fetch count accident incidents");
        return;
    }
    const CountRunningAccident = await res2.json();

    const res3 = await fetch('http://localhost:3000/getCountFinishedFireIncidents', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res3.ok) {
        console.error("Failed to fetch count fire incidents");
        return;
    }
    const CountFinishedFire = await res3.json();

    const res4 = await fetch('http://localhost:3000/getCountFinishedAccidentIncidents', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res4.ok) {
        console.error("Failed to fetch count accident incidents");
        return;
    }
    const CountFinishedAccident = await res4.json();

  /*pita*/
    document.getElementById('cycle').style.display = 'block';
    
    const ctx1 = document.getElementById('revenueChart1').getContext('2d');
    const ctx2 = document.getElementById('revenueChart2').getContext('2d');
    const revenueChart1 = new Chart(ctx1, {
        type: 'pie',
        data: {
            labels: ['FIRES', 'ACCIDENTS'],
            datasets: [{
                data: [CountRunningFire.totalRunningFires, CountRunningAccident.totalRunningAccidents], 
                backgroundColor: ['#ff5733', '#6c757d'], 
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    const revenueChart2 = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['FIRES', 'ACCIDENTS'],
            datasets: [{
                data: [CountFinishedFire.totalFinishedFires, CountFinishedAccident.totalFinishedAccidents], 
                backgroundColor: ['#ff5733', '#6c757d'], 
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

async function columns(){
    const res = await fetch('http://localhost:3000/getCountUsers', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) {
        console.error("Failed to fetch count users");
        return;
    }
    const CountUsers = await res.json();

    const res2 = await fetch('http://localhost:3000/getCountVolunteers', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res2.ok) {
        console.error("Failed to fetch count volunteers");
        return;
    }
    const CountVolunteers = await res2.json();
    CountUsers.totalUsers = CountUsers.totalUsers - 1 ;
    const ctx = document.getElementById('columnChart1').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Registers'],
            datasets: [
                {
                    label: 'Users',
                    data: [CountUsers.totalUsers], 
                    backgroundColor: 'rgba(13, 110, 253, 0.5)', 
                    borderColor: '#0d6efd', 
                    borderWidth: 1
                },
                {
                    label: 'Volunteers',
                    data: [CountVolunteers.totalVolunteers], 
                    backgroundColor: 'rgba(255, 193, 7, 0.5)', 
                    borderColor: '#ffc107', 
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ffffff' 
                    }
                },
                title: {
                    display: true,
                    text: 'Users and Volunteers',
                    color: '#ffffff',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff' 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' 
                    }
                }
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10
                }
            }
        }
    });    
}

async function RunnningAndFinished_Drivers_Simples(){
    const res = await fetch('http://localhost:3000/getCountRFDrivers', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) {
        console.error("Failed to fetch count RFDrivers");
        return;
    }
    const CountRFDrivers = await res.json();

    const res2 = await fetch('http://localhost:3000/getCountRFSimples', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res2.ok) {
        console.error("Failed to fetch count RFSimples");
        return;
    }
    const CountRFSimples = await res2.json();

    const ctx = document.getElementById('columnChart2').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Volunteers'],
            datasets: [
                {
                    label: 'Drivers',
                    data: [CountRFDrivers.totalRFDrivers], 
                    backgroundColor: 'rgba(0, 123, 255, 0.5)', 
                    borderColor: '#007bff', 
                    borderWidth: 1
                },
                {
                    label: 'Simples (Firefighters)',
                    data: [CountRFSimples.totalRFSimples], 
                    backgroundColor: 'rgba(220, 53, 69, 0.5)', 
                    borderColor: '#dc3545', 
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ffffff' // Λευκά γράμματα στο legend
                    }
                },
                title: {
                    display: true,
                    text: 'Drivers and Simples in Active or End a incident',
                    color: '#ffffff', // Λευκά γράμματα στον τίτλο
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff' // Λευκά γράμματα στον x-axis
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' // Λεπτές γραμμές πλέγματος
                    }
                }
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10
                }
            }
        }
    });    
}

async function Active_Drivers_Simples(){
    const res = await fetch('http://localhost:3000/getCountADrivers', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) {
        console.error("Failed to fetch count RFDrivers");
        return;
    }
    const CountADrivers = await res.json();

    const res2 = await fetch('http://localhost:3000/getCountASimples', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res2.ok) {
        console.error("Failed to fetch count RFSimples");
        return;
    }
    const CountASimples = await res2.json();

    const ctx = document.getElementById('columnChart3').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Volunteers'],
            datasets: [
                {
                    label: 'Drivers',
                    data: [CountADrivers.totalADrivers], 
                    backgroundColor: 'rgba(0, 123, 255, 0.5)', 
                    borderColor: '#007bff', 
                    borderWidth: 1
                },
                {
                    label: 'Simples (Firefighters)',
                    data: [CountASimples.totalASimples], 
                    backgroundColor: 'rgba(220, 53, 69, 0.5)', 
                    borderColor: '#dc3545', 
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ffffff' // Λευκά γράμματα στο legend
                    }
                },
                title: {
                    display: true,
                    text: 'Drivers and Simples in Active',
                    color: '#ffffff', // Λευκά γράμματα στον τίτλο
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ffffff' // Λευκά γράμματα στον x-axis
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' // Λεπτές γραμμές πλέγματος
                    }
                }
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10
                }
            }
        }
    });    
}

////////Public Message
function viewPublicMessage() {
    var messageApp = `
        <div id="PublicForm">
            <div class="app-header" style="position: relative;">
                <h2>Public Messages</h2>
                <button id="closeButton" class="btn btn-danger" style="position: absolute; right: 0; top: 0;" onclick="closePublicForm()">Χ</button>
            </div>
            <div class="incident-selector">
                <label for="incidentSelect" class="centered-label" style="color:black">Select Incident:</label>
                <select id="incidentSelect" onchange="filterMessagesByIncident()" class="compact-select"></select>
            </div>
            <div class="messages-list" id="messages-list">
                <!-- Μηνύματα -->
            </div>
            <div class="message-input">
                <textarea id="messageContent" placeholder="Type your message..." rows="1" required></textarea>
                <button id="sendButton" class="btn btn-danger btn-custom" onclick="sendMessage('admin')">Send</button>
            </div>
        </div>
    `;
    document.getElementById("public-messages").innerHTML = messageApp;
    document.getElementById("logging_message").innerHTML="";
    document.getElementById("update_message").innerHTML="";
    document.getElementById("update_running_message").innerHTML="";
    document.getElementById("user-messages").innerHTML = "";
    document.getElementById("volunteer-messages").innerHTML = "";
    document.getElementById("History").innerHTML = "";
    PublicMessage();
}

function closePublicForm() {
    const publicForm = document.getElementById("PublicForm");
    publicForm.style.display = "none"; 
}

async function PublicMessage() {
    const response = await fetch('http://localhost:3000/getPublicMessage', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch public messages");
        return;
    }
    const PublicMessage = await response.json();


    const incidentSelect = document.getElementById("incidentSelect");
    incidentSelect.innerHTML = '<option value="">All Incidents</option>'; 

    const res7 = await fetch('http://localhost:3000/getRunningIncidents', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res7.ok) {
        console.error("Failed to fetch in incident");
        return;
    }
    const incidents = await res7.json();

    for(var i=0; i<incidents.length; i++){
        const option = document.createElement("option");
        option.value = incidents[i].incident_id;
        option.textContent = "Incident " + incidents[i].incident_id;
        incidentSelect.appendChild(option);
    }

    displayPublicMessages(PublicMessage);
}

async function filterMessagesByIncident() {
    const selectedIncident = document.getElementById("incidentSelect").value;

    const response = await fetch('http://localhost:3000/getPublicMessage', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch public messages");
        return;
    }
    const PublicMessage = await response.json();


    const filteredMessages = selectedIncident === "" ? PublicMessage : PublicMessage.filter(message => message.incident_id == selectedIncident);

    displayPublicMessages(filteredMessages);
}

async function displayPublicMessages(messages) {
    const messagesList = document.getElementById("messages-list");
    messagesList.innerHTML = ''; 

    for (const message of messages) {
        const res = await fetch(`http://localhost:3000/IsVolunteer?username=${message.sender}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            console.error("Failed to fetch is volunteer");
            return;
        }
        const IsVolunteer = await res.json();

        const res2 = await fetch(`http://localhost:3000/IsUser?username=${message.sender}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res2.ok) {
            console.error("Failed to fetch is user");
            return;
        }
        const IsUser = await res2.json();

        let is = "admin";
        if (IsUser.length === 0) {
            is = "volunteer";
        } else if (IsVolunteer.length === 0) {
            is = "user";
        }

        // Έλεγχος για τον τύπο του χρήστη (admin, volunteer, user)
        let messageClass = "";
        let buttonClass = "";

        if (message.sender === "admin") {
            messageClass = "admin-message";
            buttonClass = "btn-danger"; 
        } else {
            if (is === "user") {
                messageClass = "user-message";
                buttonClass = "btn-primary"; 
            } else if (is === "volunteer") {
                messageClass = "volunteer-message";
                buttonClass = "btn-warning"; 
            }
        }

        const newMessage = document.createElement("div");
        newMessage.classList.add("message-item", messageClass);
        newMessage.innerHTML = `
            <span class="author">${message.sender} for incident ${message.incident_id}</span>
            <p>${message.message}</p>
            <span class="time">${message.date_time}</span>
        `;

        messagesList.appendChild(newMessage);
    }
}

async function sendMessage(userType) {
    const messageContent = document.getElementById("messageContent").value.trim();
    const selectedIncident = document.getElementById("incidentSelect").value;

    if (!selectedIncident) {
        alert("Please select an incident!");
        return;
    }

    if (messageContent === "") {
        alert("Message cannot be empty!");
        return;
    }

    const messagesList = document.getElementById("messages-list");

    let messageClass = "";
    let buttonClass = "";

    if (userType === "admin") {
        messageClass = "admin-message";
        buttonClass = "btn-danger"; 
    }

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

    const newMessage = document.createElement("div");
    newMessage.classList.add("message-item", messageClass);
    newMessage.innerHTML = `
        <span class="author">${userType.charAt(0).toUpperCase() + userType.slice(1)}</span>
        <p>${messageContent}</p>
        <span class="time">${now}</span>
    `;

    messagesList.appendChild(newMessage);
    document.getElementById("messageContent").value = "";
    messagesList.scrollTop = messagesList.scrollHeight;

    const sendButton = document.getElementById("sendButton");
    sendButton.classList.remove("btn-danger");
    sendButton.classList.add(buttonClass);

    const res5 = await fetch("http://localhost:3000/AddMessage", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            incident_id: selectedIncident,
            message: messageContent,
            sender: "admin",
            recipient: "public",
            date_time: now
        }),
    });

    if (!res5.ok) {
        console.error("Failed to send message");
    }
    const audio = new Audio('/Sources/mixkit-software-interface-start-2574.wav');
    audio.play();
}

////////User Message
function viewUserMessage() {
    var messageApp = `
        <div id="UserForm">
            <div class="app-header" style="position: relative;">
                <h2>User Messages</h2>
                <button id="closeButton" class="btn btn-danger" style="position: absolute; right: 0; top: 0;" onclick="closeUserForm()">Χ</button>
            </div>
            <div class="selectors">
                <label for="incidentSelect" class="centered-label" style="color:black">Select Incident:</label>
                <select id="incidentSelect" onchange="filterMessages()" class="compact-select"></select>
            </div>
            <div class="selectors">
                <label for="userBarContainer" class="centered-label" style="color:black">Select User:</label>
                <select id="userBarContainer" onchange="filterMessages()" class="compact-select"></select>
            </div>
            <div class="messages-list" id="messages-list">
                <!-- Μηνύματα -->
            </div>
            <div class="message-input">
                <textarea id="messageContent" placeholder="Type your message..." rows="1" required></textarea>
                <button id="sendButton" class="btn btn-danger btn-custom" onclick="sendUserMessage('admin')">Send</button>
            </div>
        </div>
    `;
    document.getElementById("user-messages").innerHTML = messageApp;
    document.getElementById("logging_message").innerHTML = "";
    document.getElementById("update_message").innerHTML = "";
    document.getElementById("update_running_message").innerHTML = "";
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("volunteer-messages").innerHTML = "";
    document.getElementById("History").innerHTML = "";
    UsersMessage();
}

function closeUserForm() {
    const UserForm = document.getElementById("UserForm");
    UserForm.style.display = "none"; 
}

async function UsersMessage() {
    const response = await fetch('http://localhost:3000/getUserMessage', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch user messages");
        return;
    }
    const UserMessage = await response.json();


    const incidentSelect = document.getElementById("incidentSelect");
    incidentSelect.innerHTML = '<option value="">All Incidents</option>'; 

    const res7 = await fetch('http://localhost:3000/getRunningIncidents', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res7.ok) {
        console.error("Failed to fetch in incident");
        return;
    }
    const incidents = await res7.json();

    for(var i=0; i<incidents.length; i++){
        const option = document.createElement("option");
        option.value = incidents[i].incident_id;
        option.textContent = "Incident " + incidents[i].incident_id;
        incidentSelect.appendChild(option);
    }

    // Load users
    const userBarContainer = document.getElementById("userBarContainer");
    userBarContainer.innerHTML = '<option value="">All Users</option>'; // Add "All" option

    const res = await fetch('http://localhost:3000/getUsers', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res.ok) {
        console.error("Failed to fetch users");
        return;
    }
    const Users = await res.json();

    Users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.username;
        option.textContent = user.username;
        userBarContainer.appendChild(option);
    });

    // Display all messages initially
    displayUserMessages(UserMessage);
}

async function filterMessages() {
    const selectedIncident = document.getElementById("incidentSelect").value;
    const selectedUser = document.getElementById("userBarContainer").value;

    const response = await fetch('http://localhost:3000/getUserMessage', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch user messages");
        return;
    }
    const UserMessage = await response.json();

    let filteredMessages = UserMessage;
    if (selectedIncident !== "") {
        filteredMessages = filteredMessages.filter(message => message.incident_id == selectedIncident);
    }

    if (selectedUser !== "") {
        filteredMessages = filteredMessages.filter(message => 
            message.sender === selectedUser || message.recipient === selectedUser
        );
    }

    filteredMessages.sort((a, b) => {
        if (a.incident_id !== b.incident_id) {
            return a.incident_id - b.incident_id;
        }
        return new Date(a.date_time) - new Date(b.date_time);
    });

    displayUserMessages(filteredMessages);
}

async function displayUserMessages(messages) {
    const messagesList = document.getElementById("messages-list");
    messagesList.innerHTML = ''; 

    for (const message of messages) {
        let messageClass = "";

        // Ελέγχουμε τον τύπο μηνύματος
        if (message.sender === "admin") {
            messageClass = "admin-message";
        } else {
            messageClass = "user-message";
        }

        const newMessage = document.createElement("div");
        newMessage.classList.add("message-item", messageClass);
        newMessage.innerHTML = `
            <span class="author">${message.sender} to ${message.recipient} for Incident ${message.incident_id}</span>
            <p>${message.message}</p>
            <span class="time">${message.date_time}</span>
        `;

        messagesList.appendChild(newMessage);
    }
}

async function sendUserMessage(userType) {
    const messageContent = document.getElementById("messageContent").value.trim();
    const selectedIncident = document.getElementById("incidentSelect").value;
    const selectedUser = document.getElementById("userBarContainer").value; 

    if (messageContent === "") {
        alert("Message cannot be empty!");
        return;
    }

    if (!selectedIncident) {
        alert("Please select an incident!");
        return;
    }

    if (!selectedUser) {
        alert("Please select a user to send the message to!");
        return;
    }

    const messagesList = document.getElementById("messages-list");

    let messageClass = "";
    let buttonClass = "";

    // Ανάλογα με τον τύπο χρήστη, ορίζουμε το μήνυμα
    if (userType === "admin") {
        messageClass = "admin-message";
        buttonClass = "btn-danger"; // Κόκκινο για Admin
    } 

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

    const newMessage = document.createElement("div");
    newMessage.classList.add("message-item", messageClass);
    newMessage.innerHTML = `
        <span class="author">${userType.charAt(0).toUpperCase() + userType.slice(1)} to ${selectedUser}</span>
        <p>${messageContent}</p>
        <span class="time">${now}</span>
    `;

    messagesList.appendChild(newMessage);
    document.getElementById("messageContent").value = "";
    messagesList.scrollTop = messagesList.scrollHeight;

    const sendButton = document.getElementById("sendButton");
    sendButton.classList.remove("btn-danger");
    sendButton.classList.add(buttonClass);

    const res5 = await fetch("http://localhost:3000/AddMessage", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            incident_id: selectedIncident,
            message: messageContent,
            sender: userType,
            recipient: selectedUser,
            date_time: now
        }),
    });
    const audio = new Audio('/Sources/mixkit-software-interface-start-2574.wav');
    audio.play();
}
////////Volunteer Message
function viewVolunteerMessage() {
    var messageApp = `
        <div id="VolunteerForm">
            <div class="app-header" style="position: relative;">
                <h2>Volunteer Messages</h2>
                <button id="closeButton" class="btn btn-danger" style="position: absolute; right: 0; top: 0;" onclick="closeVolunteerForm()">Χ</button>
            </div>
            <div class="selectorsV">
                <label for="incidentSelectV" class="centered-label" style="color:black">Select Incident:</label>
                <select id="incidentSelectV" onchange="filterVolunteerMessages()" class="compact-select"></select>
            </div>
            <div class="selectorsV">
                <label for="volunteerBarContainer" class="centered-label" style="color:black">Select Volunteer:</label>
                <select id="volunteerBarContainer" onchange="filterVolunteerMessages()" class="compact-select"></select>
            </div>
            <div class="messages-list" id="messages-list">
                <!-- Μηνύματα -->
            </div>
            <div class="message-input">
                <textarea id="messageContent" placeholder="Type your message..." rows="1" required></textarea>
                <button id="sendButton" class="btn btn-danger btn-custom" onclick="sendVolunteersMessage('admin')">Send</button>
            </div>
        </div>
    `;
    document.getElementById("volunteer-messages").innerHTML = messageApp;
    document.getElementById("logging_message").innerHTML = "";
    document.getElementById("update_message").innerHTML = "";
    document.getElementById("update_running_message").innerHTML = "";
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("user-messages").innerHTML = "";
    document.getElementById("History").innerHTML = "";
    VolunteersMessage();
}

function closeVolunteerForm() {
    const VolunteerForm = document.getElementById("VolunteerForm");
    VolunteerForm.style.display = "none"; 
}

async function VolunteersMessage() {
    const response = await fetch('http://localhost:3000/getVolunteersMessage', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch volunteers messages");
        return;
    }
    const VolunteerMessage = await response.json();

    // Load incidents
    const incidentSelectV = document.getElementById("incidentSelectV");
    incidentSelectV.innerHTML = '<option value="">All Incidents</option>'; // Add "All" option

    const res7 = await fetch('http://localhost:3000/getRunningIncidents', {
        method: 'GET',
        credentials: 'include'
    });

    if (!res7.ok) {
        console.error("Failed to fetch incidents");
        return;
    }
    const incidents = await res7.json();

    for (var i = 0; i < incidents.length; i++) {
        const option = document.createElement("option");
        option.value = incidents[i].incident_id;
        option.textContent = "Incident " + incidents[i].incident_id;
        incidentSelectV.appendChild(option);
    }

    // Load all volunteers initially
    checkVolunteerOption();
    await updateVolunteersDropdown("");

    // Display all messages initially
    displayVolunteerMessages(VolunteerMessage);
}

async function updateVolunteersDropdown(incidentId) {
    const volunteerBarContainer = document.getElementById("volunteerBarContainer");
    volunteerBarContainer.innerHTML = '<option value="">All Volunteers</option>'; 
    if (incidentId === "") {
    
        const res = await fetch('http://localhost:3000/getVolunteers', {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            console.error("Failed to fetch volunteers");
            return;
        }
        const volunteers = await res.json();

        volunteers.forEach(volunteer => {
            const option = document.createElement("option");
            option.value = volunteer.username;
            option.textContent = volunteer.username;
            volunteerBarContainer.appendChild(option);
        });
    } else {
        // Load volunteers specific to the incident
        const res2 = await fetch(`http://localhost:3000/getVolunteersByIncident?incidentId=${incidentId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res2.ok) {
            console.error("Failed to fetch volunteers for incident");
            return;
        }
        const volunteers = await res2.json();

        for(var i=0; i<volunteers.length; i++){
            const option = document.createElement("option");
            option.value = volunteers[i].volunteer_username;
            option.textContent = volunteers[i].volunteer_username;
            volunteerBarContainer.appendChild(option);
        }
    }
}

async function filterVolunteerMessages() {
    const selectedIncident = document.getElementById("incidentSelectV").value;
    const selectedVolunteer = document.getElementById("volunteerBarContainer").value;

    const response = await fetch('http://localhost:3000/getVolunteersMessage', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch volunteer messages");
        return;
    }
    const VolunteerMessage = await response.json();

    let filteredMessages = VolunteerMessage;
    if (selectedIncident !== "") {
        filteredMessages = filteredMessages.filter(message => message.incident_id == selectedIncident);
    }

    if (selectedVolunteer !== "") {
        filteredMessages = filteredMessages.filter(message => 
            message.sender === selectedVolunteer || message.recipient === selectedVolunteer
        );
    }

    filteredMessages.sort((a, b) => {
        if (a.incident_id !== b.incident_id) {
            return a.incident_id - b.incident_id;
        }
        return new Date(a.date_time) - new Date(b.date_time);
    });

    displayVolunteerMessages(filteredMessages);
}

async function displayVolunteerMessages(messages) {
    const messagesList = document.getElementById("messages-list");
    messagesList.innerHTML = ''; 

    for (const message of messages) {
        let messageClass = "";

        // Ελέγχουμε τον τύπο μηνύματος
        if (message.sender === "admin") {
            if (message.recipient=== "all volunteers"){
                messageClass = "admin-to-all-message";
            }else{
                messageClass = "admin-message";
            } 
        }else{
            if (message.recipient=== "all volunteers"){
                messageClass = "volunteer-to-all-message";
            }else{
                messageClass = "volunteer-message";
            }
        }

        const newMessage = document.createElement("div");
        newMessage.classList.add("message-item", messageClass);
        newMessage.innerHTML = `
            <span class="author">${message.sender} to ${message.recipient} for Incident ${message.incident_id}</span>
            <p>${message.message}</p>
            <span class="time">${message.date_time}</span>
        `;

        messagesList.appendChild(newMessage);
    }
}

async function checkVolunteerOption() {
    document.getElementById("incidentSelectV").addEventListener("change", async function () {
        const selectedIncident = this.value;
        await updateVolunteersDropdown(selectedIncident);
        await filterVolunteerMessages(); // Φιλτράρει τα μηνύματα με βάση το incident
    });
}

async function sendVolunteersMessage(userType) {
    const messageContent = document.getElementById("messageContent").value.trim();
    const selectedIncidentV = document.getElementById("incidentSelectV").value;
    const selectedVolunteer = document.getElementById("volunteerBarContainer").value;

    if (messageContent === "") {
        alert("Message cannot be empty!");
        return;
    }

    if (!selectedIncidentV) {
        alert("Please select an incident!");
        return;
    }

    const messagesList = document.getElementById("messages-list");

    let messageClass = "";
    let buttonClass = "";

    if (userType === "admin") {
        messageClass = "admin-message";
        buttonClass = "btn-danger"; 
    }

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

    const newMessage = document.createElement("div");

    // Αν έχει επιλεχθεί All Volunteers στείλε μήνυμα σε όλους τους εθελοντές αυτού του incident
    if (selectedVolunteer === "") {

        newMessage.classList.add("message-item", messageClass);
        newMessage.innerHTML = `
            <span class="author">${userType.charAt(0).toUpperCase() + userType.slice(1)} to all volunteers</span>
            <p>${messageContent}</p>
            <span class="time">${now}</span>
        `;
        // Steile mynhma se olous
        const res5 = await fetch("http://localhost:3000/AddMessage", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                incident_id: selectedIncidentV,
                message: messageContent,
                sender: userType,
                recipient: "all volunteers",
                date_time: now
            }),
        });
    } else {

        newMessage.classList.add("message-item", messageClass);
        newMessage.innerHTML = `
            <span class="author">${userType.charAt(0).toUpperCase() + userType.slice(1)} to ${selectedVolunteer}</span>
            <p>${messageContent}</p>
            <span class="time">${now}</span>
        `;
        // Στείλε μήνυμα σε έναν συγκεκριμένο volunteer
        const res7 = await fetch("http://localhost:3000/AddMessage", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                incident_id: selectedIncidentV,
                message: messageContent,
                sender: userType,
                recipient: selectedVolunteer,
                date_time: now
            }),
        });    
    }

    messagesList.appendChild(newMessage);
    document.getElementById("messageContent").value = "";
    messagesList.scrollTop = messagesList.scrollHeight;

    const sendButton = document.getElementById("sendButton");
    sendButton.classList.remove("btn-danger");
    sendButton.classList.add(buttonClass);

    const audio = new Audio('/Sources/mixkit-software-interface-start-2574.wav');
    audio.play();

    await filterVolunteerMessages();
}

////History
async function viewHistory() {
    const message = `
    <div id="filterForm" class="col-md-8">
        <div class="card">
            <div class="card-body">
                <form id="filterFormBody">
                    <h2>Search Finished Incidents</h2>
                    <div class="form-group">
                        <label for="prefecture">Select prefecture of Crete</label>
                        <select class="form-select" id="prefecture" name="prefecture">
                            <option value="">All prefecture</option>
                            <option value="Chania">Chania</option>
                            <option value="Heraklion">Heraklion</option>
                            <option value="Lassithi">Lassithi</option>
                            <option value="Rethimnon">Rethimnon</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <div class="rdio">
                            <label for="IncidentRadio"> Type of Incident:
                                <div id="IncidentRadio">
                                    <input type="radio" class="TypeIncident" id="fire" name="TypeIncident" value="fire" />fire
                                    <input type="radio" class="TypeIncident" id="accident" name="TypeIncident" value="accident"/>accident
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="form-group" style="color:black;">
                        <label>Start Date:</label>
                        <input type="date" id="start_datetime" name="start_datetime">
                    </div>
                
                    <div class="form-group" style="color:black;">
                        <label>End Date:</label>
                        <input type="date" id="end_datetime" name="end_datetime">
                    </div>
                
                    <div class="form-group">
                        <label for="vehicles" class="form-label">Minimum Vehicles:</label>
                        <input type="number" class="form-control" id="vehicles" value="0" min="0">
                    </div>
                    <div class="form-group">
                        <label for="firemen" class="form-label">Minimum Firemen:</label>
                        <input type="number" class="form-control" id="firemen" value="0" min="0">
                    </div>
                
                    <div class="d-grid gap-2">
                        <button type="submit">Search</button>
                    </div>
                </form>
                
                <div id="historyContainer"></div>     
            </div>
        </div>           
    </div>
    `;
    document.getElementById("History").innerHTML = message;
    document.getElementById("volunteer-messages").innerHTML = "";
    document.getElementById("logging_message").innerHTML = "";
    document.getElementById("update_message").innerHTML = "";
    document.getElementById("update_running_message").innerHTML = "";
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("user-messages").innerHTML = "";


    // Προσθήκη listener για την υποβολή της φόρμας
    document.getElementById("filterFormBody").addEventListener("submit", async (e) => {
        e.preventDefault(); 

        const filters = {};
        const prefectureValue = document.getElementById("prefecture").value;
        let typeValue = null;  
        if (document.querySelector('input[name="TypeIncident"]:checked')) {
            typeValue = document.querySelector('input[name="TypeIncident"]:checked').value;
        }
        const startDateValue = document.getElementById("start_datetime").value;
        const endDateValue = document.getElementById("end_datetime").value;
        const vehiclesValue = document.getElementById("vehicles").value;
        const firemenValue = document.getElementById("firemen").value;

        if (prefectureValue != "") filters.prefecture = prefectureValue;
        if (typeValue != null) filters.type = typeValue;
        if (startDateValue) filters.start_datetime = startDateValue;
        if (endDateValue) filters.end_datetime = endDateValue;
        if (vehiclesValue && vehiclesValue !== '0') filters.vehicles = vehiclesValue;
        if (firemenValue && firemenValue !== '0') filters.firemen = firemenValue;

        // Κλήση API με τα φίλτρα
        const queryParams = new URLSearchParams(filters).toString();
        const res = await fetch(`http://localhost:3000/getHistory?${queryParams}`, {
            method: 'GET',
            credentials: 'include',
        });
        
        if (!res.ok) {
            console.error("Failed to fetch incidents");
            const errorDetails = await res.text(); 
            console.error(errorDetails); 
            return;
        }

        const history = await res.json();
        displayHistory(history);
    });
}

function displayHistory(history) {
    const container = document.getElementById("historyContainer");
    container.innerHTML = ''; 

    if (history.length === 0) {
        container.innerHTML = '<p>No incidents found.</p>';
        return;
    }

    history.forEach((incident) => {
        const incidentDiv = document.createElement("div");
        incidentDiv.className = "incident";

        incidentDiv.innerHTML = `
            <h3>Incident ID: ${incident.incident_id}</h3>
            <p>Description: ${incident.description}</p>
            <p>Type: ${incident.incident_type}</p>
            <p>Prefecture: ${incident.prefecture}</p>
            <p>Municipality: ${incident.municipality}</p>
            <p>Address: ${incident.address}</p>
            <p>Start Date: ${incident.start_datetime}</p>
            <p>End Date: ${incident.end_datetime}</p>
            <p>Vehicles: ${incident.vehicles}</p>
            <p>Firemen: ${incident.firemen}</p>
            <p>Details: ${incident.finalResult}</p>
        `;

        container.appendChild(incidentDiv);
    });
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

    var real_address = address+" "+municipality+" "+prefecture; 
    xhr.open('GET', 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=' + real_address + '&format=json&addressdetails=1&namedetails=0&accept-language=en&limit=5&bounded=0&polygon_text=0&polygon_svg=0&polygon_kml=0&polygon_geojson=0&polygon_threshold=0.0');
    xhr.setRequestHeader('x-rapidapi-key', 'e2d91023d5msha641cdd4d08a4aep155edbjsnfd9940f26994');
    xhr.setRequestHeader('x-rapidapi-host', 'forward-reverse-geocoding.p.rapidapi.com');
    xhr.send(null);
}

function makeAjaxReqSub() {
    const municipality = document.getElementById("municipalitySubmitted").value;
    const prefecture = document.getElementById("prefectureSubmitted").value;
    const address = document.getElementById("IncidentSubmittedAddress").value;
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

    var real_address = address+" "+municipality+" "+prefecture; 
    xhr.open('GET', 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=' + real_address + '&format=json&addressdetails=1&namedetails=0&accept-language=en&limit=5&bounded=0&polygon_text=0&polygon_svg=0&polygon_kml=0&polygon_geojson=0&polygon_threshold=0.0');
    xhr.setRequestHeader('x-rapidapi-key', 'e2d91023d5msha641cdd4d08a4aep155edbjsnfd9940f26994');
    xhr.setRequestHeader('x-rapidapi-host', 'forward-reverse-geocoding.p.rapidapi.com');
    xhr.send(null);
}


function makeAjaxReqRun() {
    const municipality = document.getElementById("municipalityRunning").value;
    const prefecture = document.getElementById("prefectureRunning").value;
    const address = document.getElementById("IncidentRunningAddress").value;
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

    var real_address = address+" "+municipality+" "+prefecture; 
    xhr.open('GET', 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=' + real_address + '&format=json&addressdetails=1&namedetails=0&accept-language=en&limit=5&bounded=0&polygon_text=0&polygon_svg=0&polygon_kml=0&polygon_geojson=0&polygon_threshold=0.0');
    xhr.setRequestHeader('x-rapidapi-key', 'e2d91023d5msha641cdd4d08a4aep155edbjsnfd9940f26994');
    xhr.setRequestHeader('x-rapidapi-host', 'forward-reverse-geocoding.p.rapidapi.com');
    xhr.send(null);
}

const hoverSound = new Audio('/Sources/mixkit-typewriter-soft-click-1125.wav');

function playSound() {
    hoverSound.currentTime = 0; 
    hoverSound.play();
}

function Home()
{
    if (!document.cookie.split('; ').find(row => row.startsWith('role=admin'))) {
        window.location.href = "/Html/AdminLogIn.html";
    }
}

function LogOut()
{
    document.cookie = "role=admin; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

window.addEventListener("pageshow", function (incident) {
    Home();
    SubmittedCount();
    RunningCount();
    pites();
    columns();
    RunnningAndFinished_Drivers_Simples();
    Active_Drivers_Simples();
});





