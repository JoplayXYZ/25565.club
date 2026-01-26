import { Client, Account } from "https://cdn.jsdelivr.net/npm/appwrite@21.5.0/+esm";

const loginbtn = document.getElementById('btn-login');
const registerbtn = document.getElementById('btn-register');
const logoutbtn = document.getElementById('logoutbtn');
const tosandprivacy = document.getElementById('agree');
const authstatus = document.getElementById("authstatus");

const client = new Client()
    .setEndpoint('https://appwrite.chjk.xyz/v1')
    .setProject('6908f03d000f465ba099');

export const account = new Account(client);
export let user = null;

try {
  user = await account.get();
} catch (err) {
  console.log("expected error if not logged in:" + err)
}


export async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const invitecode = document.getElementById("invite").value;

    if (!username || !password || !invitecode) return;


    const response = await fetch("https://appwrite.chjk.xyz/v1/functions/690902f6003a85a1ebef/executions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": "6908f03d000f465ba099",
        },
        body: JSON.stringify({
            body: JSON.stringify({
                type: "signup",
                payload: {
                    invite_code: invitecode,
                    username: username,
                    password: password
                }
            })
        })
    });

    const result = await response.json();
    const responseBody = JSON.parse(result.responseBody);
    
    if (responseBody && responseBody.error && authstatus) {
        authstatus.textContent = responseBody.error;
        return;
    }
    
    console.log(result);
    console.log(result.responseBody);

    login("register");
}

export async function login(mode) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) return;

    try {
        const result = await account.createEmailPasswordSession({
            email: `${username}@not-a-real-email.25565.club`,
            password: password
        });
        
        console.log(result);

        if (!mode) {
            window.location.href = "/dash"
        } else if (mode == "register") {
            window.location.href = "/creating-account"
        }
    } catch(err) {
        console.error("Failed to log in: " + err)
    }
}

export async function logout() {
    const result = await account.deleteSession({
        sessionId: 'current'
    });

    console.log(result);
    window.location.href = '/';
}

if (logoutbtn) {
    logoutbtn.addEventListener('click', (e) => {
        e.preventDefault()
        logout();
    });
}

if (loginbtn && authstatus) {
    loginbtn.addEventListener('click', (e) => {
        e.preventDefault()
        login();
    });
}

if (registerbtn && authstatus) {
    registerbtn.addEventListener('click', (e) => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const invitecode = document.getElementById("invite").value;
        e.preventDefault();
        if (tosandprivacy.checked && username && invitecode && password) {
            register();
        } else {
            if (!tosandprivacy.checked) {
                authstatus.textContent = "Please agree to the Terms of Service and Privacy policy!";
            } else if (!username || !password || !invitecode) {
                authstatus.textContent = "Please fill out all fields";
            }
        }
    });
}

console.log("login.js loaded");
