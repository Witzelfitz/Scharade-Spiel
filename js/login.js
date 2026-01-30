document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const feedback = document.getElementById("loginFeedback");
  const submitBtn = document.querySelector("#loginForm .btn-confirm");

  function setFeedback(message, type = 'error') {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = type;
    feedback.classList.remove('hidden');
  }

  if (!email || !password) {
    setFeedback("Bitte E-Mail und Passwort eingeben.");
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Login…';

    const response = await fetch("../api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      localStorage.setItem("ID_User", result.ID_User);
      localStorage.setItem("username", result.username);

      setFeedback("Login erfolgreich!", "success");
      window.location.href = "../html/begriffEintragen.html";
    } else {
      setFeedback(result.message || "Login fehlgeschlagen.");
    }

  } catch (error) {
    console.error("Fehler beim Login:", error);
    setFeedback("Serverfehler – bitte später versuchen.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
});
