document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("../api/login.php", {
      method: "POST",
      // credentials: 'include', // uncomment if front-end & back-end are on different domains
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, email, password }),
    });
    const result = await response.json();

    if (result.status === "success") {
      alert("Login successful!");
      window.location.href = "../html/protected.html";
    } else {
      alert(result.message || "Login failed.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong!");
  }
});