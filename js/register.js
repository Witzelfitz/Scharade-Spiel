document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !email || !password) {
      alert("Bitte fülle alle Felder aus.");
      return;
    }
    if (password.length < 8 || !/[\W_]/.test(password)) {
      alert("Passwort muss mindestens 8 Zeichen lang sein und mindestens 1 Sonderzeichen enthalten.");
      return;
    }
    
    try {
      const response = await fetch("../api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await response.json();

      if (result.status === "success") {
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  });