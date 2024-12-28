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

let telephone;
async function getName() {
    const res = await fetch("http://localhost:3000/GetUserName", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (res.status !== 200) {
        console.log("Error in getting name");
        window.location.href = "/Html/UserForm.html";
        return;
    }
    const data = await res.json();
    document.getElementById("name").textContent = "Welcome Back " + data[0].username + " !";
    telephone = data[0].telephone;
}


function Home()
{
    document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
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
                            <input type="text" class="form-control" id="GuestPhone" maxlength="10" value="${telephone}" readonly>
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
    document.getElementById("History").innerHTML = "";
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("user-messages").innerHTML = "";

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

    const formData = {
        incident_type: typeOfIncident,
        description: document.getElementById("IncidentDescription").value,
        user_phone: document.getElementById("GuestPhone").value,
        user_type: "user",
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

    const res = await fetch("http://localhost:3000/AddUserIncident", {
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

// The OpenAI API key (replace with your own)


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

async function CalculateDistance() {
    const res = await fetch('http://localhost:3000/GetLatLonUser', {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) {
        console.error("Failed to fetch user's location");
        return;
    }
    const data = await res.json();

    const res2 = await fetch('http://localhost:3000/GetLatLonIncidents', {
        method: 'GET',
        credentials: 'include'
    });
    if (!res2.ok) {
        console.error("Failed to fetch incident's location");
        return;
    }
    const data2 = await res2.json();
    const userlat = data[0].lat;
    const userlon = data[0].lon;
    for (let i = 0; i < data2.length; i++) {
        const url = `https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${encodeURIComponent(userlat + ',' + userlon)}&destinations=${encodeURIComponent(data2[i].lat + ',' + data2[i].lon)}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': 'e2d91023d5msha641cdd4d08a4aep155edbjsnfd9940f26994',
                'x-rapidapi-host': 'trueway-matrix.p.rapidapi.com'
            }
        };
        /*TODO ADD SOUND EDO!!! */
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            if (result.distances.length >= 1 && result.distances[0] <= 30000) {
                if (data2[i].danger === "high") {
                    alert("HIGH DANGER HERE");
                    const audio = new Audio('/Sources/mixkit-city-alert-siren-loop-1008.wav');
                    audio.play();
                } else if (data2[i].danger === "medium") {
                    alert("MEDIUM DANGER HERE");
                    const audio = new Audio('/Sources/mixkit-facility-alarm-sound-999.wav');
                    audio.play();
                } else if (data2[i].danger === "low") {
                    alert("LOW DANGER HERE");
                    const audio = new Audio('/Sources/mixkit-urgent-digital-alarm-tone-loop-2973.wav');
                    audio.play();
                } else if (data2[i].danger === "unknown") {
                    alert("UNKNOWN DANGER HERE");
                    const audio = new Audio('/Sources/mixkit-urgent-simple-tone-loop-2976.wav');
                    audio.play();
                }
            }
        } catch (error) {
            console.error(error);
        }
    }



}


/////Public Messages
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
                <button id="sendButton" class="btn btn-primary btn-custom" onclick="sendMessage('user')">Send</button>
            </div>
        </div>
    `;
    document.getElementById("public-messages").innerHTML = messageApp;
    document.getElementById("logging_message").innerHTML = "";
    document.getElementById("user-messages").innerHTML = "";
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

    console.log(PublicMessage);

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

    for (var i = 0; i < incidents.length; i++) {
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

    if (!messageContent) {
        alert("Message cannot be empty!");
        return;
    }

    const messagesList = document.getElementById("messages-list");

    let messageClass = "";
    let buttonClass = "";

    if (userType === "user") {
        messageClass = "user-message";
        buttonClass = "btn-primary";
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
    sendButton.classList.remove("btn-primary");
    sendButton.classList.add(buttonClass);

    const res6 = await fetch("http://localhost:3000/GetUserName", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (res6.status !== 200) {
        console.log("Error in getting name");
    }
    const data = await res6.json();

    const res5 = await fetch("http://localhost:3000/AddMessage", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            incident_id: selectedIncident,
            message: messageContent,
            sender: data[0].username,
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

function viewUserMessage() {
    var messageApp = `
        <div id="UserForm">
            <div class="app-header" style="position: relative;">
                <h2>Admin Messages</h2>
                <button id="closeButton" class="btn btn-danger" style="position: absolute; right: 0; top: 0;" onclick="closeUserForm()">Χ</button>
            </div>
            <div class="selectors">
                <label for="incidentSelect" class="centered-label" style="color:black">Select Incident:</label>
                <select id="incidentSelect" onchange="filterMessages()" class="compact-select"></select>
            </div>
            <div class="messages-list" id="messages-list">
                <!-- Μηνύματα -->
            </div>
            <div class="message-input">
                <textarea id="messageContent" placeholder="Type your message..." rows="1" required></textarea>
                <button id="sendButton" class="btn btn-primary btn-custom" onclick="sendUserMessage('user')">Send</button>
            </div>
        </div>
    `;
    document.getElementById("user-messages").innerHTML = messageApp;
    document.getElementById("logging_message").innerHTML = "";
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("History").innerHTML = "";
    UsersMessage();
}

function closeUserForm() {
    const UserForm = document.getElementById("UserForm");
    UserForm.style.display = "none";
}

/////Admin Messages
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

    const res = await fetch('http://localhost:3000/GetUserName', {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        console.error("Failed to fetch current username");
        return;
    }

    const currentUser = await res.json();
    const currentUsername = currentUser[0].username;

    const filteredMessages = UserMessage.filter(message =>
        (message.sender === "admin" && message.recipient === currentUsername) ||
        (message.sender === currentUsername && message.recipient === "admin")
    );

    // Φόρτωσε incidents για το dropdown
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

    for (var i = 0; i < incidents.length; i++) {
        const option = document.createElement("option");
        option.value = incidents[i].incident_id;
        option.textContent = "Incident " + incidents[i].incident_id;
        incidentSelect.appendChild(option);
    }

    displayUserMessages(filteredMessages);
}

async function filterMessages() {
    const selectedIncident = document.getElementById("incidentSelect").value;

    const response = await fetch('http://localhost:3000/getUserMessage', {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch user messages");
        return;
    }

    const UserMessage = await response.json();

    // Λήψη του username του τρέχοντος χρήστη
    const res = await fetch('http://localhost:3000/GetUserName', {
        method: 'GET',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        console.error("Failed to fetch current username");
        return;
    }

    const currentUser = await res.json();
    const currentUsername = currentUser[0].username;

    // Φιλτράρουμε τα μηνύματα μεταξύ admin και του τρέχοντος χρήστη
    let filteredMessages = UserMessage.filter(message =>
        (message.sender === "admin" && message.recipient === currentUsername) ||
        (message.sender === currentUsername && message.recipient === "admin")
    );

    // Αν έχει επιλεγεί περιστατικό, φιλτράρουμε περαιτέρω
    if (selectedIncident !== "") {
        filteredMessages = filteredMessages.filter(message => message.incident_id == selectedIncident);
    }

    displayUserMessages(filteredMessages);
}

async function displayUserMessages(messages) {
    const messagesList = document.getElementById("messages-list");
    messagesList.innerHTML = '';

    for (const message of messages) {
        let messageClass = "";
        let recipientText = "";

        if (message.sender === "admin") {
            messageClass = "admin-message";
            recipientText = ` to You`;
        } else {
            messageClass = "user-message";
            recipientText = ` to admin`;
        }

        const newMessage = document.createElement("div");
        newMessage.classList.add("message-item", messageClass);
        newMessage.innerHTML = `
            <span class="author">${message.sender}${recipientText} for Incident ${message.incident_id}</span>
            <p>${message.message}</p>
            <span class="time">${message.date_time}</span>
        `;

        messagesList.appendChild(newMessage);
    }
}

async function sendUserMessage(userType) {
    const messageContent = document.getElementById("messageContent").value.trim();
    const selectedIncident = document.getElementById("incidentSelect").value;

    if (!messageContent) {
        alert("Message cannot be empty!");
        return;
    }

    if (!selectedIncident) {
        alert("Please select an incident!");
        return;
    }

    const messagesList = document.getElementById("messages-list");

    let messageClass = "";
    let buttonClass = "";

    // Ανάλογα με τον τύπο χρήστη, ορίζουμε το μήνυμα
    if (userType === "user") {
        messageClass = "user-message";
        buttonClass = "btn-primary";
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
        <span class="author">${userType.charAt(0).toUpperCase() + userType.slice(1)} to admin</span>
        <p>${messageContent}</p>
        <span class="time">${now}</span>
    `;

    messagesList.appendChild(newMessage);
    document.getElementById("messageContent").value = "";
    messagesList.scrollTop = messagesList.scrollHeight;

    const sendButton = document.getElementById("sendButton");
    sendButton.classList.remove("btn-primary");
    sendButton.classList.add(buttonClass);

    const res6 = await fetch("http://localhost:3000/GetUserName", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (res6.status !== 200) {
        console.log("Error in getting name");
    }
    const data = await res6.json();

    const res5 = await fetch("http://localhost:3000/AddMessage", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            incident_id: selectedIncident,
            message: messageContent,
            sender: data[0].username,
            recipient: "admin",
            date_time: now
        }),
    });
    const audio = new Audio('/Sources/mixkit-software-interface-start-2574.wav');
    audio.play();
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

                    <div class="form-group">
                        <label>Start Date:</label>
                        <input type="date" id="start_datetime" name="start_datetime" style="color: black;">
                    </div>
                
                    <div class="form-group">
                        <label>End Date:</label>
                        <input type="date" id="end_datetime" name="end_datetime" style="color: black;">
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
    document.getElementById("logging_message").innerHTML = "";
    document.getElementById("public-messages").innerHTML = "";
    document.getElementById("user-messages").innerHTML = "";


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
                positions = [
                    response[0].lat,
                    response[0].lon,
                ]
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

function createHIGHFireIcon() {
    return new OpenLayers.Icon('../Sources/fire.png', new OpenLayers.Size(70, 100), new OpenLayers.Pixel(-16, -16));
}

function createMEDIUMFireIcon() {
    return new OpenLayers.Icon('../Sources/fire.png', new OpenLayers.Size(40, 70), new OpenLayers.Pixel(-16, -16));
}

function createLOWFireIcon() {
    return new OpenLayers.Icon('../Sources/fire.png', new OpenLayers.Size(25, 50), new OpenLayers.Pixel(-16, -16));
}

function createFireIcon() {
    return new OpenLayers.Icon('../Sources/fire.png', new OpenLayers.Size(25, 50), new OpenLayers.Pixel(-16, -16));
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
        if (incident.name === "accident") {
            marker = new OpenLayers.Marker(position, createAccidentIcon());
        } else if (incident.name === "fire") {
            if (incident.details === "high") {
                marker = new OpenLayers.Marker(position, createHIGHFireIcon());
            } else if (incident.details === "medium") {
                marker = new OpenLayers.Marker(position, createMEDIUMFireIcon());
            } else if (incident.details === "low") {
                marker = new OpenLayers.Marker(position, createLOWFireIcon());
            } else {
                marker = new OpenLayers.Marker(position, createFireIcon());
            }
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

window.addEventListener("pageshow", async function (event) {
    await getName();
    await CalculateDistance();
});
