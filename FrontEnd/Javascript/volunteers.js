/*To show update form*/
async function showUpdateForm() {
    document.getElementById('button').style.display = 'none';
    document.getElementById('update-info-section').style.display = 'block';
    const res = await fetch('http://localhost:3000/VolunteerData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const info = await res.json();
    const date = info[0].birthdate;
    const birthdate = date.split('T')[0];
    if (
        info[0].gender === 'male' ||
        (info[0].gender === 'Male') | (info[0].gender === 'MALE')
    ) {
        document.getElementById('male').checked = true;
    } else {
        document.getElementById('female').checked = true;
    }
    document.getElementById('username').value = info[0].username;
    document.getElementById('email').value = info[0].email;
    document.getElementById('telephone').value = info[0].telephone;
    document.getElementById('address').value = info[0].address;
    document.getElementById('password').value = info[0].password;
    document.getElementById('firstname').value = info[0].firstname;
    document.getElementById('lastname').value = info[0].lastname;
    document.getElementById('birthdate').value = birthdate;
    document.getElementById('afm').value = info[0].afm;
    document.getElementById('country').value = info[0].country;
    document.getElementById('municipality').value = info[0].municipality;
    document.getElementById('prefecture').value = info[0].prefecture;
    document.getElementById('job').value = info[0].job;
    document.getElementById('height').value = info[0].height;
    document.getElementById('weight').value = info[0].weight;
}

/*Hide Form  */
function HideForm() {
    document.getElementById('update-info-section').style.display = 'none';
    document.getElementById('button').style.display = 'inline';
}

async function Update() {
    event.preventDefault();
    const form = document.getElementById('update_form');
    const formData = new FormData(form);
    console.log(formData);
    let dataObject = {};
    formData.forEach((value, key) => {
        dataObject[key] = value;
    });
    const res = await fetch('http://localhost:3000/UpdateVolunteer', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObject),
    });
    if (res.status !== 200) {
        alert('error while updating your data');
    } else {
        alert('success updating your data');
        window.location.reload();
    }
}

async function LoggedIn() {
    const res = await fetch('http://localhost:3000/GetIncidents', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.status !== 200) {
        window.location.href = '/Html/form.html';
        return;
    }
    const incidents = await res.json();
    const Carousel = document.querySelector(".carousel-inner");
    for (let i = 0; i < incidents.length; i++) {
        const incident = incidents[i];
        const formattedDate = new Date(incident.date).toLocaleString();
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (i === 0) {
            carouselItem.classList.add("active");
        }
        const typeClass = incident.incident_type === "fire"
            ? 'bg-danger text-white'
            : incident.incident_type === "accident"
                ? 'bg-dark text-white'
                : 'bg-secondary text-light';
        const content = `
           <div class="card ${typeClass} d-flex justify-content-center align-items-center" style="height: 300px;">
        <div class="card-body text-center">
            <h5 class="card-title">${incident.incident_type.toUpperCase()} - ${incident.address}</h5>
            ${incident.description ? `<p class="card-text">${incident.description}</p>` : ''}
            <p class="card-text"><strong>Date:</strong> ${formattedDate}</p>
            <button class="btn btn-light" onclick="takePlaceNow(${incident.incident_id})">Take Part Now</button>
        </div>
        </div>
        `;
        carouselItem.innerHTML = content;
        Carousel.appendChild(carouselItem);
    }
}

async function takePlaceNow(incident_id) {
    const res = await fetch('http://localhost:3000/Addparticipant', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ incident_id: incident_id }),
    });

    if (res.status !== 200) {
        alert('Failed to participate');
        return;
    } else {
        alert('Successfully participated');
        window.location.reload();
    }
}



/*Logout from vounteers and go to home */
function home() {
    document.cookie = "volunteer_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";    
    window.location.href = '/Html/Home.html';

}

/*Logout from the volunteers */
function logout() {
    document.cookie = "volunteer_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";    
    window.location.href = '/Html/form.html';

}

/*Show all running incidents */
async function ShowRunningIncidents() {
    var div = document.getElementById("participating");
    div.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "Participating Incidents";
    title.className = "title";
    div.appendChild(title);

    const res = await fetch('http://localhost:3000/GetParticapated', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (res.status !== 200) {
        alert('Error getting incidents');
        return;
    }
    const incidents = await res.json();
    if (!incidents || incidents.length === 0) {
        const noIncidents = document.createElement("p");
        noIncidents.textContent = "No participating incidents found.";
        noIncidents.className = "no-incidents";
        div.appendChild(noIncidents);
        return;
    }
    const incidentsContainer = document.createElement("div");
    incidentsContainer.className = "incidents-container";

    incidents.forEach((incident) => {
        const incidentDiv = document.createElement("div");
        const date = new Date(incident.start_datetime);
        incidentDiv.className = "incident-card";

        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        incidentDiv.innerHTML = `
            <h3>Incident Type: ${incident.incident_type}</h3>
            <p><strong>Address:</strong> ${incident.address}</p>
            <p><strong>Description:</strong> ${incident.description}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
        `;
        incidentsContainer.appendChild(incidentDiv);
    });
    div.appendChild(incidentsContainer);
}


/*Show all finished incidents */
async function ShowFinishedIncidents() {
    var div = document.getElementById("participating");
    div.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "History Of Participated Incidents";
    title.className = "title";
    div.appendChild(title);

    const res = await fetch('http://localhost:3000/GetFinished', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });

    if (res.status !== 200) {
        alert('Error getting incidents');
        return;
    }
    const incidents = await res.json();
    if (!incidents || incidents.length === 0) {
        const noIncidents = document.createElement("p");
        noIncidents.textContent = "No participating incidents found.";
        noIncidents.className = "no-incidents";
        div.appendChild(noIncidents);
        return;
    }
    const incidentsContainer = document.createElement("div");
    incidentsContainer.className = "incidents-container";

    incidents.forEach((incident) => {
        const incidentDiv = document.createElement("div");
        const date = new Date(incident.end_datetime);
        incidentDiv.className = "incident-card";

        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        incidentDiv.innerHTML = `
            <h3>Incident Type: ${incident.incident_type}</h3>
            <p><strong>Address:</strong> ${incident.address}</p>
            <p><strong>Description:</strong> ${incident.description}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Comment By User:</strong> ${incident.comment}</p>
        `;
        incidentsContainer.appendChild(incidentDiv);
    });
    div.appendChild(incidentsContainer);
}


////Public Messages
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
                <button id="sendButton" class="btn btn-warning btn-custom" onclick="sendMessage('volunteer')">Send</button>
            </div>
        </div>
    `;
    document.getElementById("public-messages").innerHTML = messageApp;
    //document.getElementById("user-messages").innerHTML = "";
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

    if (!messageContent) {
        alert("Message cannot be empty!");
        return;
    }

    const messagesList = document.getElementById("messages-list");

    let messageClass = "";
    let buttonClass = "";

    if (userType === "volunteer") {
        messageClass = "volunteer-message";
        buttonClass = "btn-warning"; 
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
    sendButton.classList.remove("btn-warning");
    sendButton.classList.add(buttonClass);

    const res6 = await fetch('http://localhost:3000/VolunteerData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const info = await res6.json();

    const res5 = await fetch("http://localhost:3000/AddMessage", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            incident_id: selectedIncident,
            message: messageContent,
            sender: info[0].username,
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
                <button id="sendButton" class="btn btn-warning btn-custom" onclick="sendVolunteersMessage('volunteer')">Send</button>
            </div>
        </div>
    `;
    document.getElementById("volunteer-messages").innerHTML = messageApp;
    document.getElementById("public-messages").innerHTML = "";
    VolunteersMessage();
}

function closeVolunteerForm() {
    const VolunteerForm = document.getElementById("VolunteerForm");
    VolunteerForm.style.display = "none"; 
}

async function VolunteersMessage() {
    const res6 = await fetch('http://localhost:3000/VolunteerData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const info = await res6.json();
    var volunteer_username = info[0].username;

    const response = await fetch(`http://localhost:3000/getVolunteersMessagePlus?volunteer_username=${volunteer_username}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch volunteers messages");
        return;
    }
    const VolunteerMessage = await response.json();

    const incidentSelectV = document.getElementById("incidentSelectV");
    incidentSelectV.innerHTML = '<option value="">All Incidents</option>'; 
    const res7 = await fetch(`http://localhost:3000/getRunningIncidentsWhoIsParty?volunteer_username=${volunteer_username}`,
        {method: 'GET',credentials: 'include',}
    );
    
    if (!res7.ok) {
        console.error('Failed to fetch incidents:', res7.statusText); 
        return;
    }
    const incidents = await res7.json();

    for (var i = 0; i < incidents.length; i++) {
        const option = document.createElement("option");
        option.value = incidents[i].incident_id;
        option.textContent = "Incident " + incidents[i].incident_id;
        incidentSelectV.appendChild(option);
    }

    checkVolunteerOption();
    await updateVolunteersDropdown("");

    displayVolunteerMessages(VolunteerMessage);
}

async function updateVolunteersDropdown(incidentId) {
    const volunteerBarContainer = document.getElementById("volunteerBarContainer");
    volunteerBarContainer.innerHTML = '<option value="">All Volunteers</option>'; // Add "All" option
    const res6 = await fetch('http://localhost:3000/VolunteerData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const info = await res6.json();

    if (incidentId === "") {
        // Load all volunteers if no incident is selected
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
            if(info[0].username === volunteer.username){
                option.value = "admin";
                option.textContent = "admin";
            }else{
                option.value = volunteer.username;
                option.textContent = volunteer.username;
            }
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
            if(info[0].username === volunteers[i].volunteer_username){
                option.value = "admin";
                option.textContent = "admin";
            }else{
                option.value = volunteers[i].volunteer_username;
                option.textContent = volunteers[i].volunteer_username;
            }
            volunteerBarContainer.appendChild(option);
        }
    }
}

async function filterVolunteerMessages() {
    const selectedIncident = document.getElementById("incidentSelectV").value;
    const selectedVolunteer = document.getElementById("volunteerBarContainer").value;

    const res6 = await fetch('http://localhost:3000/VolunteerData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const info = await res6.json();
    var volunteer_username = info[0].username;

    const response = await fetch(`http://localhost:3000/getVolunteersMessagePlus?volunteer_username=${volunteer_username}`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        console.error("Failed to fetch volunteers messages");
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
        await filterVolunteerMessages(); 
    });
}

async function sendVolunteersMessage(userType) {
    const messageContent = document.getElementById("messageContent").value.trim();
    const selectedIncidentV = document.getElementById("incidentSelectV").value;
    const selectedVolunteer = document.getElementById("volunteerBarContainer").value;

    const res6 = await fetch('http://localhost:3000/VolunteerData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const info = await res6.json();

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

    if (userType === "volunteer") {
        messageClass = "volunteer-message";
        buttonClass = "btn-warning"; 
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
            <span class="author">${info[0].username.charAt(0).toUpperCase() + info[0].username.slice(1)} to all volunteers</span>
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
                sender: info[0].username,
                recipient: "all volunteers",
                date_time: now
            }),
        });
    } else {

        newMessage.classList.add("message-item", messageClass);
        newMessage.innerHTML = `
            <span class="author">${info[0].username.charAt(0).toUpperCase() + info[0].username.slice(1)} to ${selectedVolunteer}</span>
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
                sender: info[0].username,
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

const hoverSound = new Audio('/Sources/mixkit-typewriter-soft-click-1125.wav');


// Sound
function playSound() {
    hoverSound.currentTime = 0; 
    hoverSound.play();
}

window.addEventListener("pageshow", function (event) {
    LoggedIn();
  });
  