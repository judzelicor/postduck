import $ from "jquery";

// Check if document is ready to be manipulated
$(() => {
  $("#logInButton").on("click", () => {
    window.location.href = "/login"
  })

  $("#signUpButton").on("click", () => {
    window.location.href = "/signup"
  })
})