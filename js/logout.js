document.getElementById("logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("../api/logout.php", {
      method: "POST",
      credentials: "include",
    });

    const result = await response.json();

    if (result.status === "success") {
      localStorage.clear(); // lokal gespeicherte Daten löschen
      window.location.href = "../html/login.html";
    } else {
      console.error("Logout failed");
      alert("Logout fehlgeschlagen");
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("Serverfehler beim Logout");
  }
});