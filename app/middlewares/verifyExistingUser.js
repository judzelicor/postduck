// Redirects user to homepage if a user exists. Otherwise, they are redirected to the login page.
const verifyExistingUser = (request, response, next) => {
    if (request.session && request.session.user) {
        return next();
    }

    else {
        return response.redirect("/login")
    }
}

export default verifyExistingUser;