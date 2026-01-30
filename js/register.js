document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const feedback = document.getElementById("registerFeedback");
  const submitBtn = document.querySelector("#registerForm .btn-confirm");

  function setFeedback(message, type = 'error') {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = type;
    feedback.classList.remove('hidden');
  }

  if (!username || !email || !password) {
    setFeedback("Bitte fülle alle Felder aus.");
    return;
  }
  if (password.length < 8 || !/[\W_]/.test(password)) {
    setFeedback("Passwort muss mindestens 8 Zeichen lang sein und mindestens 1 Sonderzeichen enthalten.");
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrieren…';

    const response = await fetch("../api/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      setFeedback("Registrierung erfolgreich! Du kannst dich jetzt einloggen.", "success");
      window.location.href = "login.html";
    } else {
      setFeedback(result.message || "Registrierung fehlgeschlagen.");
    }
  } catch (error) {
    console.error("Error:", error);
    setFeedback("Serverfehler – bitte später versuchen.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Bestätigen';
  }
});
