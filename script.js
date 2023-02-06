const productsContainer = document.querySelector("#productsContainer");
const loadMoreButton = document.querySelector("#loadMoreButton");
const openCard = document.querySelector("#openCard");
const cardContainer = document.querySelector("#cardContainer");
const limit = 12;
let skip = 0;
let total = 0;
fetchProducts();
productsContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const { title, thumbnail, price } = e.target.dataset;
  }
});
loadMoreButton.addEventListener("click", () => {
  skip += limit;
  fetchProducts();
});
openCard.addEventListener("click", function () {
  cardContainer.classList.replace("translate-x-full", "translate-x-0");
});
async function fetchProducts() {
  disableLoadBtn();
  const data = await fetch(
    `https://dummyjson.com/products?&limit=${limit}&skip=${skip}`
  ).then((res) => res.json());
  total = data.total;
  enableLoadBtn();
  loadMoreButton.disabled = false;
  loadMoreButton.textContent = "Load More";
  if (skip + limit >= total) {
    loadMoreButton.hidden = true;
  }

  let productsHtml = "";
  for (let product of data.products) {
    productsHtml += getProductHtml(product);
  }
  productsContainer.insertAdjacentHTML("beforeend", productsHtml);
}

function disableLoadBtn() {
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = "Loading..";
}
function enableLoadBtn() {
  loadMoreButton.disabled = false;
  loadMoreButton.textContent = "Load More";
}
function getProductHtml(product) {
  const { title, price, thumbnail } = product;
  return `
<div
class="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
>
<div
class="flex items-end justify-end h-56 w-full bg-cover"
style="background-image: url('${thumbnail}');"
>
<button
  data-title="${title}"
  data-price="${price}"
  data-thumbnail="${thumbnail}"
  class="add-to-card p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
>
  <svg
    class="h-5 w-5 pointer-events-none"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    ></path>
  </svg>
</button>
</div>
<div class="px-5 py-3">
<h3 class="text-gray-700 uppercase">${title}</h3>
<span class="text-gray-500 mt-2">$${price}</span>
</div>
</div>
`;
}
