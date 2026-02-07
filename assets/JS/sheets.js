<script>
async function envoyerCommande(service, pack) {
  const nom = document.getElementById("nom").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (!nom || !email) {
    alert("Merci de remplir le nom et l’email");
    return;
  }

  const data = {
    nom,
    email,
    service,
    pack,
    message,
    whatsapp: "https://wa.me/242066973413"
  };

  await fetch("https://script.google.com/macros/s/AKfycbyvnaxENov_Qk4SZossTkz7RCOnWu4BaDKcNvwU7w-cEAsjsyEqvld0pl2i3T32TpIHdA/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });

  window.location.href =
    "https://wa.me/242066973413?text=" +
    encodeURIComponent(
      "Bonjour 👋\nJe viens de passer une commande :\n\n" +
      "Service : " + service + "\n" +
      "Pack : " + pack + "\n\nMerci 🙏"
    );
}
</script>
