document
    .getElementById("signin-content")
    .addEventListener("submit", function(e) {

        e.preventDefault()

        const email = document.getElementById("login-email");
        const password = document.getElementById("login-password")
        const remember_me = document.getElementById("remember-me")

        if (remember_me.checked == true) {
            localStorage.setItem("login-email", email.value);
            localStorage.setItem("password-email", password.value);
        }
    }
)

