const recipeList = document.getElementById('recipe-list');
const mealDetailsContent = document.querySelector('.meal-details-content');



//EVENTLSITENERS
const homeBtn = document.getElementById('homeBtn').addEventListener('click', getBackHome)
const getRecipeThemealdbAPIbtn = document.getElementById('searchBtn').addEventListener('click', getRecipeThemealdbApi)
const getRecipeFromLocalApibtn = document.getElementById('myRecipes').addEventListener('click', getRecipeFromLocalApi)
const saveRecipeBtn = document.querySelector('.saveIcon').addEventListener('click', saveRecipe)
const deleteRecipeBtn = document.querySelector('.deleteIcon').addEventListener('click', deleteRecipe)


//WHEN CLICKING ON HOMEBTN SITE REFRESHES 
function getBackHome(){
  recipeList.innerHTML = ''
}



//GET RECEIPES FROM API WHEN SEARCHING FOR AN INGREDIENT
function getRecipeThemealdbApi(){
    recipeList.innerHTML = ''

    let searchInputTxt = document.getElementById('searchInput').value.trim();

    axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
    .then(data => {
 
        data.data.meals.forEach(food => {
            
            let recipeCard = `
            <div class="col-sm-6 col-md-6 col-lg-6 col-xl-4" >
            <div class="card mt-5" style="width: 18rem;">
            <div class = "meal-item" data-id = "${food.idMeal}">
            <img src="${food.strMealThumb}" class="card-img-top" id="recipe-img" alt="...">
            <div class="card-body">
                <h5 class="card-title" id="recipe-title">${food.strMeal}</h5>
                <div id="card-${food.idMeal}"></div>
                <p class="card-text">${food.strArea} </p>
                <i class="fa-solid fa-bookmark" onCLick="saveRecipe(${food.idMeal})" data-bs-toggle="popover" id="saveIcon"></i>
                <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#recipe-modal-${food.idMeal}" id="btnViewReceipe">View Recipe</button>
                <div class="modal fade" id="recipe-modal-${food.idMeal}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">${food.strMeal}</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      ${food.strInstructions}
                    </div>
                    <a href="${food.strSource}" id="menuLink">See full menu</a>
                    </br>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `     
          recipeList.innerHTML += recipeCard
        });
    })
}

//SAVE RECEIPE IN BACKEND
function saveRecipe(idMeal){
  // Get object from Recipes API based on Meal ID then Send Meal object to back end
  axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
  .then(data => {
      axios.post(`https://recipe-app-capstone.herokuapp.com/api/recipes`, data.data.meals[0]) //http://localhost:4005/api/recipes
      // .then(() => alert(`${data.data.meals[0].strMeal} MEAL HAS BEEN ADDED!`))
      // 
    
      .then(()=> alertNotExsists(data.data.meals[0].idMeal))
      .catch(err => alertExsists(data.data.meals[0].idMeal))
    });
      
}


//GET THE RECEIPE FROM THE BACKEND TO SHOW IN THE FRONTEND
function getRecipeFromLocalApi(){
  recipeList.innerHTML = ''

  axios.get(`https://recipe-app-capstone.herokuapp.com/api/recipes`) //http://localhost:4005/api/recipes
  .then(data => {

      data.data.forEach(food => {
          
          let recipeCard = `
          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-4" >
          <div class="card mt-5" style="width: 18rem;">
          <div class = "meal-item" data-id = "${food.meal_id}">
          <img src="${food.recipe_img}" class="card-img-top" id="recipe-img" alt="...">
          <div class="card-body">
              <h5 class="card-title" id="recipe-title">${food.recipe_title}</h5>
              <p class="card-text">${food.recipe_area}</p>
              <i class="fa-solid fa-trash" onCLick="deleteRecipe(${food.meal_id})" id="deleteIcon"></i>
              <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#recipe-modal-${food.meal_id}" id="btnViewReceipe">View Recipe</button>
              <div class="modal fade" id="recipe-modal-${food.meal_id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${food.recipe_title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    ${food.recipe_instructions}
                  </div>
                  <a href="${food.recipe_source} id="menuLink">${food.recipe_title} Source Link</a>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-warning" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `     
        recipeList.innerHTML += recipeCard
      });
  })
}

//DELETE CHOSEN RECEIPE FROM FRONTEND VIEW
function deleteRecipe(meal_id){
  axios.delete(`https://recipe-app-capstone.herokuapp.com/api/recipes/${meal_id}`)//http://localhost:4005/api/recipes/
      .then(() => getRecipeFromLocalApi())
      .catch(err => console.log(err))
}



 

function alertNotExsists(meal_id){

  const mealCard = document.getElementById(`card-${meal_id}`);
  mealCard.innerHTML += `
  <div class="alert alert-success alert-dismissible fade show" role="alert">
  Recipe saved
</div>
  `
  setTimeout(() => {
    mealCard.innerHTML=''
  }, 2000)
}

function alertExsists(meal_id){

  const mealCard = document.getElementById(`card-${meal_id}`);
  mealCard.innerHTML += `
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
  Recipe already saved!
</div>
  `
  setTimeout(() => {
    mealCard.innerHTML=''
  }, 2000)
}



       
      






