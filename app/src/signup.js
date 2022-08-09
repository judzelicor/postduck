import axios from "axios"

let passwordField;
let passwordFieldVerify;
let registerForm;
let firstNameField;
let firstNameFieldErrorMessage;
let registerFormButton;
let lastNameField;
let nicknameField;
let quackAudio;
let emailField;
let emailConfirmationField;
let thereIsError;
let username;
let user;
let errorMessageContainer;


firstNameField = document.getElementById("firstName");
lastNameField = document.getElementById("lastName");
passwordField = document.getElementById("password");
registerForm = document.getElementById("registerForm");
registerFormButton = document.getElementById("submitButton");
nicknameField = document.getElementById("nickname");
quackAudio = new Audio("/audio/quack.mp3")
emailField = document.getElementById("email")
emailConfirmationField = document.getElementById("emailConfirmation")
username = document.getElementById("username")
errorMessageContainer = document.querySelector(".errorMessage")

function verifyRegisterFormSubmission(event) {
    event.preventDefault()

    console.log("clicked!")

    thereIsError = false;

    if (!firstNameField.value) {
        document.querySelector(".firstNameFormField").classList.add("raiseError")
        thereIsError = true
    }

    if (!lastNameField.value) {
        document.querySelector(".lastNameFormField").classList.add("raiseError")
        thereIsError = true
    }

    if (!emailField.value) {
        document.querySelector(".emailFormField").classList.add("raiseError")
        thereIsError = true
    }

    if (!emailConfirmationField.value) {
        document.querySelector(".emailConfirmationFormField").classList.add("raiseError")
        thereIsError = true
    }

    if (!nicknameField.value) {
        document.querySelector(".nicknameFormField").classList.add("raiseError")
        thereIsError = true
    }

    if (!passwordField.value) {
        document.querySelector(".passwordFormField").classList.add("raiseError")
        thereIsError = true
    }

    if (emailField.value !== emailConfirmationField.value) {
        document.querySelector(".emailFormRow").classList.add("raiseErrorEmailMismatch")
        thereIsError = true
    }

    if (!username.value) {
        document.querySelector(".usernameFormField").classList.add("raiseError")
        thereIsError = true
    }

    if (thereIsError) {
        quackAudio.play();

        return
    }

    user = {
        firstName: firstNameField.value,
        lastName: lastNameField.value,
        email: emailField.value,
        username: username.value,
        password: passwordField.value
    }

    axios({
        method: "POST",
        url: "/signup",
        data: user
    }).then(({ data }) => {
      if (!data.success) {
        $(".errorMessage__moH1rR").html(`
            <div class="errorMessageIcon__moH1rR">
                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\">
                    <path fill=\"#ff6174\" d=\"M16 1C7.72 1 1 7.72 1 16s6.72 15 15 15 15-6.72 15-15S24.28 1 16 1zm0 24c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2.29-15.51-.67 8.02c-.07.84-.77 1.49-1.62 1.49s-1.55-.65-1.62-1.49l-.67-8.02C13.6 8.15 14.65 7 16 7a2.3 2.3 0 0 1 2.3 2.3c0 .06 0 .13-.01.19z\"/>\n" +
                </svg>
            </div>
            <p>${ data.message }</p>
        `)

        setTimeout(() => {
            $(".errorMessage__moH1rR").html("")
        }, 2000)
    }

    else {
        $(".errorMessage__moH1rR").html("")
    }

    if (data.success && data.redirect) {
        window.location.href = data.redirect
    }
    })
}

firstNameField.addEventListener("input", () => {
    document.querySelector(".firstNameFormField").classList.remove("raiseError")
})

lastNameField.addEventListener("input", () => {
    document.querySelector(".lastNameFormField").classList.remove("raiseError")
})

registerFormButton.addEventListener("click", verifyRegisterFormSubmission);
