const bar = document.getElementById("bar");
const navbar = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
  bar.addEventListener("click", () => {
    navbar.classList.add("active");
  });
}
if (close) {
  close.addEventListener("click", () => {
    navbar.classList.remove("active");
  });
}

function viewProduct(productName) {
  window.location.href = `/singleproduct/${encodeURIComponent(productName)}`;
}
function addProduct(productName) {
  window.location.href = `/cart/${encodeURIComponent(productName)}`;
}
// function removeProduct(productName) {
//   window.location.href = `/cart/remove/${encodeURIComponent(productName)}`;
// }
// function goToProfile() {
//     window.location.href = `/profile`;
// }
function confirmLogout() {
  var result = confirm("Are you sure you want to logout?");
  if (result) {
    window.location.href = `/logout`;
  } else {
    alert("Logout canceled.");
  }
}

