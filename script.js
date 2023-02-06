const productsContainer = document.querySelector("#productsContainer");
const loadMoreButton = document.querySelector("#loadMoreButton");
const openCard = document.querySelector("#openCard");
const cardContainer = document.querySelector("#cardContainer");
const count = document.querySelector("#count");
const removeCart = document.querySelector("#removeCart");
const limit = 12;
let skip = 0;
let total = 0;
fetchProducts();
let cart = [];
let savedList = localStorage.getItem("cart_list");
if (savedList) {
  savedList = JSON.parse(savedList);
  cart = savedList;
  displayCart(cart);
}

function displayCart(list) {
  count.innerHTML = cart.length;

  if (cart.length === 0) {
    const div = document.createElement("div");
    const text = document.createElement("h1");
    div.appendChild(text);
    cardContainer.appendChild(div);
    text.textContent = "Your Cart Is Empty";
  }

  let html = "";
  for (let item of list) {
    const { title, price, thumbnail } = item;
    const box = document.getElementById("cardContainer-box");
    html += `
    <div class="flex justify-between mt-6">
         <div class="flex">
           <img
           class="h-20 w-20 object-cover rounded"
             src="${thumbnail}"
             alt=""
           />
           <div class="mx-3">
             <h3 class="text-sm text-gray-600">${title}</h3>
             <div class="flex items-center mt-2">
               <button
                 class="text-gray-500 focus:outline-none focus:text-gray-600"
              >
                 <svg
                   class="h-5 w-5"
                 fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </button>
              <span class="text-gray-700 mx-2">2</span>
              <button
                class="text-gray-500 focus:outline-none focus:text-gray-600"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
             </div>
           </div>
         </div>
        <span class="text-gray-600">$${price}</span>
       </div>
    `;
    box.innerHTML = html;
  }
}
productsContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const { title, thumbnail, price } = e.target.dataset;
    const newItem = {
      title: title,
      thumbnail: thumbnail,
      price: price,
    };
    cart.push(newItem);
    displayCart(cart);
    saveList();
  }
});
loadMoreButton.addEventListener("click", () => {
  skip += limit;
  fetchProducts();
});
openCard.addEventListener("click", function () {
  cardContainer.classList.replace("translate-x-full", "translate-x-0");
});
removeCart.addEventListener("click", function () {
  cardContainer.classList.replace("translate-x-0", "translate-x-full");
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

function saveList() {
  localStorage.setItem("cart_item", JSON.stringify(cart));
}
