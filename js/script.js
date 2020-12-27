const recipeContainer = document.querySelector(".recipe");
const resultContainer = document.querySelector(".results");
const bookmarkList = document.querySelector(".bookmarks__list");
const API_URL = "https://forkify-api.herokuapp.com/api/v2/recipes";
const bookmarkBtn = document.querySelector(".btn--bookmark");
const addBtn = document.querySelector(".nav__btn--add-recipe");
const closeBtn = document.querySelector(".btn--close-modal");
const overlay = document.querySelector(".overlay");
const windowAdd = document.querySelector(".add-recipe-window ");

document.querySelector(".search__btn").addEventListener("click", function (e) {
  e.preventDefault();
  const searchRecipe = document.querySelector(".search__field").value;
  console.log(searchRecipe);

  searchResults(searchRecipe);
});

//Add Recipe window
addBtn.addEventListener("click", function () {
  windowAdd.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});
closeBtn.addEventListener("click", function () {
  windowAdd.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});
overlay.addEventListener("click", function () {
  windowAdd.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});

//load function

const waitLoad = function (parentEL) {
  const markup = ` <div class="spinner">
          <svg>
            <use href="./image/icons.svg#icon-loader"></use>
          </svg>
        </div> `;

  parentEL.innerHTML = "";
  parentEL.insertAdjacentHTML("afterbegin", markup);
};

// view Recipe function

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    waitLoad(recipeContainer);

    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // Rendering recipe

    const markup = `
       <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${
      recipe.title
    }" class="recipe__img" />
          <h1 class="recipe__title"><span>${recipe.title}</span>
          
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="./image/icons.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="./image/icons.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            
          </div>

          
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="./image/icons.svg#icon-bookmark"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${recipe.ingredients
            .map((ing) => {
              return `
              <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="./image/icons.svg#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${ing.quantity}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>
              `;
            })
            .join("")}
         
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a class="btn--small recipe__btn btn"
            href="${recipe.sourceUrl}"
            target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
              <use href="./image/icons.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;

    recipeContainer.innerHTML = "";
    recipeContainer.insertAdjacentHTML("afterbegin", markup);
  } catch (err) {
    renderError(err);
  }
};

// Error function
function renderError(
  message = `No recipes found for your query. Please try again!`
) {
  const markup = `<div class="error">
            <div>
              <svg>
                <use href="./image/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

  resultContainer.innerHTML = "";
  resultContainer.insertAdjacentHTML("afterbegin", markup);
}

// Search function

const searchResults = async function (query) {
  try {
    waitLoad(resultContainer);
    const res = await fetch(`${API_URL}?search=${query}`);
    const data = await res.json();
    console.log(data);
    //  return error when recipe not found
    if (data.results === 0 || query === "") return renderError();

    data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });

    const resultPerPage = data.data.recipes.slice(0, 14);

    const markup = resultPerPage
      .map((rec) => {
        return `<li class="preview" >
                 <a class="preview__link " href="#${rec.id}">
                <figure class="preview__fig">
                  <img src="${rec.image_url}" alt="${rec.title}<" />
               </figure>
               <div class="preview__data">
                <h4 class="preview__title">${rec.title}</h4>
                <p class="preview__publisher">${rec.publisher}</p>
              </div>
            </a>
          </li> `;
      })
      .join();

    resultContainer.innerHTML = "";
    resultContainer.insertAdjacentHTML("afterbegin", markup);

    searchRecipe = document.querySelector(".search__field").value = "";
  } catch (err) {
    renderError(err);
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, showRecipe)
);

// bookmark function
