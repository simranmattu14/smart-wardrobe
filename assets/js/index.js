window.addEventListener("load", async () => {
    await Clerk.load({
        ui: {
            ClerkUI: window.__internal_ClerkUICtor
        }
    });

    const guestHome = document.getElementById("guest-home");
    const guestActions = document.getElementById("guest-actions");
    const memberHome = document.getElementById("member-home");
    const memberActions = document.getElementById("member-actions");
    const userName = document.getElementById("user-name");

    if (Clerk.user) {
        guestHome.style.display = "none";
        guestActions.style.display = "none";
        memberHome.style.display = "block";
        memberActions.style.display = "flex";

        if (userName && Clerk.user.fullName) {
            userName.textContent = Clerk.user.fullName;
        }
    } else {
        guestHome.style.display = "block";
        guestActions.style.display = "flex";
        memberHome.style.display = "none";
        memberActions.style.display = "none";
    }
});
