import { user } from '/scripts/login.js'

let username = null;
let loggedIn = false;

export const loginCheckComplete = (async () => {
    try {
        username = user.email.replace("@not-a-real-email.25565.club", "")
        console.log(username)
        loggedIn = true;
    } catch {
        loggedIn = false;
    }
})();

const pathname = window.location.pathname;

loginCheckComplete.then(() => {

    if (pathname.startsWith('/dash') && loggedIn == false) {
        window.location.href = "/auth/login?loginrequiredmessage=true";
    }
                
    if (pathname.startsWith('/auth') && loggedIn == true && pathname !== '/auth/creating-account') {
        window.location.href = "/dash";
    }
})


if (pathname == '/dash' || pathname == '/dash') {
    const usernameEl = document.getElementById('username')
    if (usernameEl && username) {
        usernameEl.textContent = "@" + username;
    }
}

console.log("checkauthstatus.js loaded")

export default {};

export { username, loggedIn }
