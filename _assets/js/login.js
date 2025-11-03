async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const invitecode = document.getElementById("invite").value;

    const response = await fetch("https://appwrite.chjk.xyz/v1/functions/690902f6003a85a1ebef/executions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": "6908f03d000f465ba099",
        },
        body: JSON.stringify({
            type: "signup",
            payload: {
                invite_code: invitecode,
                username: username,
                password: password
            }
        }),
    });

    const result = await response.json();
    console.log(result);
}
