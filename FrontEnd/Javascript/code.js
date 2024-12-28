
/*Function that cheks the two password if they are the same added some ideas extra */
function checkcode() {
	let password1 = document.getElementById("password").value;
	let password2 = document.getElementById("password2").value;
	let message = document.getElementById("message");
	let passwordInput = document.getElementById("password2");
	if (password1 == "" && password2 == "") {
		message.textContent = "❌ Passwords cannot be empty";
		message.style.color = "red";
		passwordInput.setCustomValidity('Passwords cannot be empty');
		return false;
	}
	if (password1 === password2) {
		message.textContent = "✔️ Passwords match";
		message.style.color = "green";
		passwordInput.setCustomValidity('');
	} else {
		message.textContent = "❌ Passwords don't match";
		message.style.color = "red";
		passwordInput.setCustomValidity('Passwords do not match');
	}
	return password1 === password2;
}

/*Function that makes show password from 359 examples*/
function showPass() {
	if (document.getElementById("password").type == "text") {
		document.getElementById("password").type = "password";
		document.getElementById("showpassword").value = "Show Password";
	}
	else {
		document.getElementById("password").type = "text";
		document.getElementById("showpassword").value = "Hide Password";
	}
}
/*Function that shows password2 */
function showPass2() {
	if (document.getElementById("password2").type == "text") {
		document.getElementById("password2").type = "password";
		document.getElementById("showpassword2").value = "Show Password";
	}
	else {
		document.getElementById("password2").type = "text";
		document.getElementById("showpassword2").value = "Hide Password";
	}
}

/*Simple function that shows password strength */
function showstrength() {
	if (document.getElementById("message2").hidden) {
		document.getElementById("strength").value = "Hide Password Strength";
		document.getElementById("message2").hidden = false;
	}
	else {
		document.getElementById("strength").value = "Show Password Strength";
		document.getElementById("message2").hidden = true;
	}


}

/*check for repeated words */
function checkrepeated(str) {
	const len = str.length;
	const max = len / 2;
	for (let i = 0; i < len; i++) {
		let char = str[i];
		let count = 1;
		for (let j = 0; j < len; j++) {
			if (char == str[j] && i != j) {
				count++;
			}
		}
		if (count >= max) {
			return true;
		}
	}
	return false;
}

/*check for how many numbers*/
function countnumbers(str) {
	let countnumbers = 0;
	for (let i = 0; i < str.length; i++) {
		if (!isNaN(str[i])) {
			countnumbers++;
		}
	}
	return countnumbers;
}

/*Check for the allowed words */
function allowedwords(str) {
	var problem = "";
	if (str.includes("fotia")) {
		problem = "fotia";
	}
	else if (str.includes("fire")) {
		problem = "fire";
	}
	else if (str.includes("ethelontis")) {
		problem = "ethelontis";
	}
	else if (str.includes("volunteer")) {
		problem = "volunteer";
	}
	return problem;
}
/*Check for special char*/
function containsSpecialChars(str) {
	const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
	return specialChars.test(str);
}
/*Check for strong of password*/
function checkstrong(str) {
	let check1 = false;
	let check2 = false;
	let check3 = false;
	for (let i = 0; i < str.length; i++) {
		if (!isNaN(str[i])) {
			check1 = true;

		}
		else if (containsSpecialChars(str[i])) {
			check2 = true;
		}
		else if (str[i] === str[i].toUpperCase()) /*Checks fro uppercase this way!! */ {
			check3 = true;
		}
		if (check1 == true && check2 == true && check3 == true) {
			return true;
		}
	}
	return false;
}

/*Check for the password safety added some from assigment 1*/
function passsafety() {
	let password = (document.getElementById("password").value).toLowerCase();
	let numbers = countnumbers(password);
	let repeated = checkrepeated(password);
	let strong = checkstrong(document.getElementById("password").value);
	if (password.length < 8) {
		document.getElementById("message2").textContent = "Password is weak.Password must be 8 characters long!";
		document.getElementById("message2").style.color = "red";
		document.getElementById("password").setCustomValidity('Password is too short');
		return false;
	}
	else if (password.length > 18) {
		document.getElementById("message2").textContent = "Password is weak. Password must be less than 18 characters long!";
		document.getElementById("message2").style.color = "red";
		document.getElementById("password").setCustomValidity('Password is too long');
		return false;
	}
	else if (password.includes("fire") || password.includes("fotia") || password.includes("ethelontis") || password.includes("volunteer")) {
		let problem = allowedwords(password);
		document.getElementById("message2").textContent = "Password is weak.Contains " + problem + " which isn't allowed!";
		document.getElementById("message2").style.color = "red";
		document.getElementById("password").setCustomValidity('Password contains a common password');
		return false;
	}
	else if (numbers >= password.length / 2) {
		document.getElementById("message2").textContent = "Password is weak. Contains too many numbers!";
		document.getElementById("message2").style.color = "red";
		document.getElementById("password").setCustomValidity('Password contains too many numbers');
		return false;
	}
	else if (repeated == true) {
		document.getElementById("message2").textContent = "Password is weak. Contains repeated characters!";
		document.getElementById("message2").style.color = "red";
		document.getElementById("password").setCustomValidity('Password contains repeated characters');
		return false;
	}
	else if (strong == true) {
		document.getElementById("message2").textContent = "Password is strong";
		document.getElementById("message2").style.color = "green";

		document.getElementById("password").setCustomValidity('');
		return true;
	}
	else {
		document.getElementById("message2").textContent = "Password is medium";
		document.getElementById("message2").style.color = "orange";

	}
}

function setPosition(lat, lon) {
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
	const address = document.getElementById("address").value;
	const country = document.getElementById("country").value;
	const error = document.getElementById("errorrequest");
	error.textContent = "";
	if (address.length == 0) {
		error.textContent = "Please enter an address and not empty!";
		error.style.color = "red";
		document.getElementById("Map").hidden = true;
		validMap = false;
		return;
	}
	if (municipality.length == 0) {
		error.textContent = "Please enter an municipality and not empty!";
		error.style.color = "red";
		document.getElementById("Map").hidden = true;
		validMap = false;
		return;
	}
	if (country != "GR") {
		error.textContent = "Do not support out of Greece and Creta !";
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
					{
						lat: response[0].lat,
						lon: response[0].lon
					}
				];
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

	var real_address = address + " " + municipality + " " + prefecture + " " + country;
	xhr.open('GET', 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=' + real_address + '&format=json&addressdetails=1&namedetails=0&accept-language=en&limit=5&bounded=0&polygon_text=0&polygon_svg=0&polygon_kml=0&polygon_geojson=0&polygon_threshold=0.0');
	xhr.setRequestHeader('x-rapidapi-key', 'e2d91023d5msha641cdd4d08a4aep155edbjsnfd9940f26994');
	xhr.setRequestHeader('x-rapidapi-host', 'forward-reverse-geocoding.p.rapidapi.com');
	xhr.send(null);
	console.log(xhr.responseText);
}

var checkUserName = false;
var checkemail = false;
var CheckPhoneNumber = false;

async function CheckUsername() {
	var username = document.getElementById("username").value;
	if (username === "") {
		return;
	}
	const res = await fetch("http://localhost:3000/CheckUserName?Username=" + username, {
		method: "GET",
		credentials: "include",
	});
	if (res.status === 200) {
		checkUserName = false;
		document.getElementById("usernameExists").style.color = "red";
		document.getElementById("usernameExists").textContent = "User with that Username exist in database Volunteers";
	}
	else {
		checkUserName = true;
		document.getElementById("usernameExists").textContent = "";
	}

}



async function CheckEmail() {
	var email = document.getElementById("email").value;
	if (email === "") {
		return;
	}
	const res = await fetch("http://localhost:3000/CheckEmail?Email=" + email, {
		method: "GET",
		credentials: "include",
	});
	if (res.status === 200) {
		checkemail = false;
		document.getElementById("emailExists").style.color = "red";
		document.getElementById("emailExists").textContent = "User with that email exist in database Volunteers";
	}
	else {
		checkemail = true;
		document.getElementById("emailExists").textContent = "";
	}

}


async function CheckPhone() {
	var telephone = document.getElementById("telephone").value;
	if (telephone === "") {
		return;
	}
	const res = await fetch("http://localhost:3000/CheckPhone?PhoneNumber=" + telephone, {
		method: "GET",
		credentials: "include",
	});
	if (res.status === 200) {
		CheckPhoneNumber = false;
		document.getElementById("telephoneExist").style.color = "red";
		document.getElementById("telephoneExist").textContent = "User with that telephone exist in database Volunteers";
	}
	else {
		CheckPhoneNumber = true;
		document.getElementById("telephoneExist").textContent = "";
	}


}




async function onlist() {
	event.preventDefault();
	if (checkcode() === true && passsafety() === true && validMap === true && checkemail === true && checkUserName === true && CheckPhoneNumber === true) {
		const form = document.getElementById("form");
		var name;

		const formData = new FormData(form);
		let dataObject = {};
		formData.forEach((value, key) => {
			dataObject[key] = value;
		});
		dataObject.lon = positions[0].lon;
		dataObject.lat = positions[0].lat;
		const jsonString = JSON.stringify(dataObject, null, 2);
		document.getElementById("output").textContent = jsonString;
		const res = await fetch("http://localhost:3000/AddVolunteer", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dataObject),
			credentials: "include",
		});
		if (res.status !== 200) {
			return false;
		}
		window.location.href = "Volunteers.html";
	}
	else {
		document.getElementById("output").textContent = "You have errors in your sumbitting form.";
		return false;
	}

}

function Home() {
	window.location.href = "Home.html";
}


function login() {
	const existingFormContainer = document.getElementById("form-container");
	if (existingFormContainer) {
		existingFormContainer.remove();
	}
	document.getElementById("footer_go").style.display = "none";
	document.getElementById("welcome").textContent = "Log In Application For Volunteers";
	document.getElementById("output").style.display = "none";
	document.getElementsByClassName("form")[0].style.display = "none";

	const container = document.createElement('div');
	container.id = 'form-container';
	container.style.width = '300px';
	container.style.margin = '50px auto';
	container.style.padding = '20px';
	container.style.border = '1px solid #ccc';
	container.style.borderRadius = '10px';
	container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
	container.style.fontFamily = 'Arial, sans-serif';

	const form = document.createElement('form');
	form.id = 'login-form';
	form.method = 'POST';
	form.setAttribute('onsubmit', 'LoginIn();return false;');

	const usernameLabel = document.createElement('label');
	usernameLabel.htmlFor = 'username';
	usernameLabel.textContent = 'Username:';
	usernameLabel.style.display = 'block';
	usernameLabel.style.marginBottom = '5px';

	const usernameInput = document.createElement('input');
	usernameInput.type = 'text';
	usernameInput.id = 'username';
	usernameInput.name = 'username';
	usernameInput.required = true;
	usernameInput.placeholder = 'Enter your username';
	usernameInput.style.width = '100%';
	usernameInput.style.padding = '10px';
	usernameInput.style.marginBottom = '15px';
	usernameInput.style.border = '1px solid #ccc';
	usernameInput.style.borderRadius = '5px';

	const passwordLabel = document.createElement('label');
	passwordLabel.htmlFor = 'password';
	passwordLabel.textContent = 'Password:';
	passwordLabel.style.display = 'block';
	passwordLabel.style.marginBottom = '5px';

	const passwordInput = document.createElement('input');
	passwordInput.type = 'password';
	passwordInput.id = 'password';
	passwordInput.name = 'password';
	passwordInput.required = true;
	passwordInput.placeholder = 'Enter your password';
	passwordInput.style.width = '100%';
	passwordInput.style.padding = '10px';
	passwordInput.style.marginBottom = '15px';
	passwordInput.style.border = '1px solid #ccc';
	passwordInput.style.borderRadius = '5px';

	/*Login Button*/
	const loginButton = document.createElement('input');
	loginButton.type = 'submit';
	loginButton.id = 'login-btn';
	loginButton.value = 'Log In';
	loginButton.style.width = '100%';
	loginButton.style.padding = '10px';
	loginButton.style.marginBottom = '10px';
	loginButton.style.backgroundColor = '#4CAF50';
	loginButton.style.color = 'white';
	loginButton.style.border = 'none';
	loginButton.style.borderRadius = '5px';
	loginButton.style.cursor = 'pointer';

	/*Sign In Button*/
	const signInButton = document.createElement('button');
	signInButton.type = 'button';
	signInButton.id = 'sign-in-btn';
	signInButton.textContent = 'Sign In';
	signInButton.style.width = '100%';
	signInButton.style.padding = '10px';
	signInButton.style.backgroundColor = '#007BFF';
	signInButton.style.color = 'white';
	signInButton.style.border = 'none';
	signInButton.style.borderRadius = '5px';
	signInButton.style.cursor = 'pointer';
	signInButton.onclick = RegisterAgain;

	const output = document.createElement('span');
	output.id = 'output2';
	output.style.color = 'red';
	form.appendChild(usernameLabel);
	form.appendChild(usernameInput);
	form.appendChild(passwordLabel);
	form.appendChild(passwordInput);
	form.appendChild(loginButton);
	form.appendChild(signInButton);
	container.appendChild(form);
	container.appendChild(output);
	document.body.appendChild(container);
}


/*For Logged In*/
async function LoginIn() {
	event.preventDefault();
	const form = document.getElementById("login-form");
	const formData = new FormData(form);
	let dataObject = {};
	formData.forEach((value, key) => {
		dataObject[key] = value;
	});
	const res = await fetch("http://localhost:3000/loginVolunteers", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(dataObject),
	});
	if (res.status !== 200) {
		document.getElementById("output2").textContent = "Invalid username or password.";
		return false;
	}
	else {
		document.getElementById("output2").textContent = "";
		window.location.href = "Volunteers.html";
	}




}
/*go to register*/
function RegisterAgain() {
	const existingFormContainer = document.getElementById("form-container");
	if (existingFormContainer) {
		existingFormContainer.remove();
	}
	document.getElementById("footer_go").style.display = "block";
	document.getElementById("welcome").textContent = "Sign In Application For Volunteers";
	document.getElementById("output").style.display = "block";
	document.getElementsByClassName("form")[0].style.display = "block";
}