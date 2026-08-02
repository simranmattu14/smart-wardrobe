window.addEventListener("load", async () => {

    await Clerk.load({
        ui: {
            ClerkUI: window.__internal_ClerkUICtor
        }
    });

    console.log("Clerk loaded");

    if (Clerk.user) {
        window.location.href = "index.html";
        return;
    }

    Clerk.mountSignIn(
        document.getElementById("clerk-sign-in"),
        {
            appearance: {
                variables: {
                colorPrimary: "#5B5FDE",
                colorText: "#1F2937",
                colorBackground: "#FFFFFF",
                colorInputBackground: "#F9FAFB",
                colorInputText: "#111827",
                borderRadius: "18px",
                fontFamily: "Poppins, sans-serif",
                },

                elements: {
                card: {
                    boxShadow: "none",
                    border: "none",
                    padding: "24px 28px",
                    background: "transparent",
                },

                headerTitle: {
                    fontSize: "32px",
                    fontWeight: "700",
                },

                headerSubtitle: {
                    color: "#6B7280",
                },

                formButtonPrimary: {
                    backgroundColor: "#5B5FDE",
                    borderRadius: "12px",
                    height: "48px",
                    fontWeight: "600",
                },

                formFieldInput: {
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                },

                footer: {
                    display: "none",
                },

                footerAction: {
                    display: "none",
                },

                socialButtonsBlockButton: {
                    borderRadius: "12px",
                }
                }
            }
        }
    );

});