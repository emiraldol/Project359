function password_view(inputId, eyeId) {
    const input = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeId);

    if (input.type === "password") {
        input.type = "text";
        eyeIcon.src = "/Sources/eye.png";
    } else {
        input.type = "password";
        eyeIcon.src = "/Sources/eye-slash.png";
    }
}

async function submit_form() {
    const Username = document.getElementById("username").value;
    const Password = document.getElementById("password").value;

    if (Username === "admin" && Password === "admiN12@*") {
        document.cookie = "role=admin; expires=" + new Date(Date.now() + 86400000).toUTCString() + "; path=/;";
        window.location.href = "/Html/AdminHome.html";
        return true;
    }else{
        alert("Fail to connect as admin");
        return false;
    }
}

function ReturnHome(){
    window.location.href = "/Html/Home.html";
}