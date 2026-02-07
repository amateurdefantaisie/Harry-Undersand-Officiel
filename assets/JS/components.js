document.addEventListener("DOMContentLoaded", () => {
  const buttons = `
    <div class="global-actions">
      <button onclick="openDrawer()">☰</button>
      <button onclick="goHome()">🏠</button>
      <button onclick="openSearch()">🔍</button>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", buttons);
});

function goHome(){
  window.location.href = "/";
}

function openSearch(){
  document.querySelector(".drawer").classList.add("open");
}
