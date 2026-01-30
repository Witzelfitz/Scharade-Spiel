document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("../api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      // ✅ Speichere Daten im localStorage
      localStorage.setItem("ID_User", result.ID_User);
      localStorage.setItem("username", result.username);

      alert("Login erfolgreich!");
      window.location.href = "../html/begriffEintragen.html";
    } else {
      alert(result.message || "Login fehlgeschlagen.");
    }

  } catch (error) {
    console.error("Fehler beim Login:", error);
    alert("Serverfehler – bitte später versuchen.");
  }
});