//UI variables
const form = document.querySelector('#ingredient-form');
const ingredientList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-ingredients');
const findRecipe = document.querySelector('.find-recipe');
const ingredientInput = document.querySelector('#ingredient');
const titles = document.querySelector('#recipe-title');

//API variables
const apiUrl = "https://api.spoonacular.com/recipes/findByIngredients?ingredients="
const results = "&number=2"
const limitLicense = "&limitLicense=true"
const apiKey = "apiKey=5dae8dcf899b4a1dbf7637f822014ad6"


//Load Event Listeners
loadEventListeners();

//Define Event Listeners
function loadEventListeners() {
  //Add ingredient to list
  form.addEventListener('submit', addIngredient);
  //Remove single ingredient from list
  ingredientList.addEventListener('click', removeIngredient);
  //Clear all ingredients
  clearBtn.addEventListener('click', clearIngredients);
  //Find recipes
  findRecipe.addEventListener('click', recipeList);
}
let foodItems = []
//Add Ingredient
function addIngredient(e) {
  if(ingredientInput.value === '') {
    alert('Add an ingredient');
  }
  //Create li element
  const li = document.createElement('li');
  li.className = 'collection-item';
  li.appendChild(document.createTextNode(ingredientInput.value));
  foodItems.push(ingredientInput.value);
  console.log(foodItems)
  //Create delete button for single ingredient
  const link = document.createElement('a');
  link.className = 'delete-item secondary-content';
  link.innerHTML = '<i class="fa fa-remove"></i>';
  li.appendChild(link);
  //Append li to ul
  ingredientList.appendChild(li)
  //Clear input
  ingredientInput.value = '';

  e.preventDefault();
}

//clean data array
function cleanData(data) {
  let cleanedData = "";
  for (let i = 0; i < data.length; i++) {
    if (i == 0) {
      cleanedData += data[i].toString();
    } else {
      cleanedData += `,+${data[i].toString()}`
    }
  }
  return cleanedData
}
//Define function to remove single ingredient from list
function removeIngredient(e) {
  if(e.target.parentElement.classList.contains('delete-item')){
    e.target.parentElement.parentElement.remove();
  }
}

//Define function to find recipes from API
async function recipeList() {
  let ingredients = cleanData(foodItems)
  const response = await fetch(`${apiUrl}${ingredients}${results}${limitLicense}&${apiKey}`);
  console.log(`${apiUrl}${ingredients}${results}${limitLicense}&${apiKey}`)
  const data = await response.json();
  data.forEach(function(recipe){
    getSource(recipe.id) 
    getUngredients(recipe) 
  })
  foodItems = []
}

  async function getSource(id) {
    titles.innerHTML = ''
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?${apiKey}`);
    const data = await response.json();
    titles.innerHTML += 
       `<h5><a href= ${data.sourceUrl} target="_blank">${data.title}</a></h5>`
  }

  function getUngredients(recipe) {
    let collection = '<ol>Missing Ingredients'
    recipe.missedIngredients.forEach(function(nonegredient) {
      collection += `<li>${nonegredient.name}</li>`;
    })
    collection += '</ol>';
    document.querySelector('#ungredients').innerHTML = collection
  }


//Define function to clear all ingredients
function clearIngredients() {
  ingredientList.innerHTML = '';
}