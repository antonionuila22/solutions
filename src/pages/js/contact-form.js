document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const responseBox = document.getElementById("form-response");



    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(form);



        const email = formData.get("email");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            responseBox.textContent = "Correo inválido.";
            return;
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                body: formData,
            });

            const text = await response.text();
            responseBox.textContent = response.ok
                ? "✅ Mensaje enviado correctamente."
                : `⚠️ ${text}`;
            if (response.ok) form.reset();
        } catch (error) {
            console.error("Error:", error);
            responseBox.textContent = "⚠️ Hubo un error al enviar.";
        }
    });
});

