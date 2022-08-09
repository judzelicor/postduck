import axios from "axios";
import $, { data } from "jquery";

let loginForm;
let loginFormSubmitButton;
let username;
let email;
let password;
let errorMessage;

loginForm = $("#loginForm")
loginFormSubmitButton = $("#loginFormSubmitButton")
errorMessage = $(".errorMessage")

loginFormSubmitButton.on("click", (event) => {
  event.preventDefault();

  username = $(".usernameField").val();
  email = $(".emailField").val();
  password = $(".passwordField").val();

  const user = {username, password}

  axios({
    method: "POST",
    url: "/login",
    data: user,
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(({ data }) => {
    const { success, redirect } = data;

    if (success && redirect) {
      window.location.href = redirect;
    }
  })
  .catch(error => {
    console.log(error)
  })
})
