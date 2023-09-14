const searchForm = document.querySelector('.search_recipe'); //search barot
const searchResult = document.querySelector('.search-result') // kade ke se prikazuva rezultatot
const loadMoreButton = document.getElementById('load-more-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const details = document.querySelector('.more-info .details')
const quickSearch = document.querySelector('.quick_search')
const moreInfo = document.querySelector('.more-info')
const favourites = document.querySelector('.favourites')
const favouriteMenu = document.querySelector('.favouriteTab')
const closeBtn = document.querySelector('.more-info .close')
const chatBotMenu = document.querySelector('.chatBotTab')
const chatBot = document.querySelector('.chatBot')
const chatForm = document.querySelector('.chat_form')
const chatResult1= document.querySelector('.header')
const chatResultMedia= document.querySelector('.chatMedia')

let searchValue = '';
let from = 0, to=10;
let generatedHTML= '';
let favouriteHTML= '';
let currentDishType = '';
let moreHtml='';
let searchQuestion ='';
let chatMedia= '';
let arrayID=[];
let apiKey=' '



filterButtons.forEach(li => {
    li.addEventListener('click', () => {
        currentDishType = li.getAttribute('data-dish-type');
        from = 0;
        to=10;
        searchValue='';
        document.querySelector('input').value=searchValue
        generatedHTML= '';
        fetchAPI();
    });
});


searchForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    searchValue = e.target.querySelector('.recipe').value;
    console.log(searchValue)
    from=0;
    to=10;
    generatedHTML= '';
    currentDishType = '';
    fetchAPI();


})

loadMoreButton.addEventListener('click', () => {
    from += 10;
    fetchAPI();
});

//се повикува при пребарување по клучен збор или тип на рецепт
async function fetchAPI(){
    let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`;
    if (currentDishType) {
        apiUrl += `&type=${currentDishType}`;
    }else
    {
        apiUrl += `&query=${searchValue}`
    }
    const response = await fetch(`${apiUrl}&addRecipeInformation=true&offset=${from}&number=${to}`);
    const data = await response.json();

    generateHTML(data.results)

    if (data.results.length >= 10) {
        loadMoreButton.style.display = 'block'; // Покажете го копчето ако има повеќе резултати
    } else {
        loadMoreButton.style.display = 'none'; // Скриете го копчето ако нема повеќе резултати
    }

}

function generateHTML(results){
    document.body.style.backgroundImage='none'
    document.body.style.backgroundColor= '#363636'
    searchResult.style.display='grid'
    moreInfo.style.display='none'
    favourites.style.display='none'
    chatBot.style.display='none'

    changeMultipleCSS()
    console.log(results)
    results.map(result => {
        generatedHTML += `
      <div class="item">
        <img src="${result.image}" alt="img">
         <h1 class="title">${result.title}</h1>
         <p>Gluten Free: ${result.glutenFree}</p>
         <p>Health Score: ${result.healthScore}</p>
         <p>Ready in ${result.readyInMinutes} minutes</p>
         <p>Vegan: ${result.vegan}</p>
         <p>Popular Recepie: ${result.veryPopular}</p>
        <button id="${result.id}" class="view-recipe" onclick="ViewRecipe(${result.id})">View Recipe</button>
        <button id="${result.id}" class="view-recipe add-favourite" onclick="AddToFavourite(${result.id})">Add to favourite</button>
      </div>
    `
    })
    searchResult.innerHTML = generatedHTML;
}

function ViewRecipe(id){
    let api=`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`
    let fetched= FetchAPIInfo(api, 1)

    console.log(fetched)
}

 async function FetchAPIInfo(api, i){
    const response = await fetch(api)
     console.log(response)
    const data = await response.json();
    console.log(data)

    console.log(data[0])
     if (i ==1) {
         generateHTML2(data[0])
     }else if(i ==2 )
     {
        generateHTML3(data)
     }

}

function generateHTML2(data)
{

    quickSearch.style.display= 'none'
    searchResult.style.display= 'none'
    loadMoreButton.style.display= 'none';
    favourites.style.display= 'none'
    moreInfo.style.display= 'block'
    chatBot.style.display='none'

    moreHtml='';
    console.log(data)
    let steps = data.steps;
    ingred = " ", desc= " ";
    let j=0;
    // console.log(steps)
    moreHtml += `<h3 style="margin-top: 10px">Ingregients</h3>
<ul style="column-count: 2">`
    steps.forEach(function (s,i){
        s.ingredients.forEach(function (ing, j){
            moreHtml += `
                    <li>${ing.name}</li>
            `
            ingred += ing.name
        })

    })
    moreHtml +=`</ul>`
    if( ingred.trim().length == 0) {
        moreHtml += `
                <div>
                <p>No ingredients found</p>
                </div>
                `
    }
    moreHtml +=`<br><h3>Description</h3>`
    steps.forEach(function (s,i){
        moreHtml+= `<div>
            <p>${s.step}</p>
        </div>`
        desc += s.step

    })
    if( desc ==" "){
        moreHtml+=`
                <div>
                <p> No description found</p>
                </div>
                `
    }
    details.innerHTML = moreHtml

    console.log(moreHtml)
    console.log(ingred)
    console.log(desc)
    console.log(details)
}

function generateHTML3(data){

    console.log(data)

        favouriteHTML+= `
      <div class="item item-data">
        <img src="${data.image}" alt="img">
         <h1 class="title">${data.title}</h1>
         
        <button id="${data.id}" class="view-recipe" onclick="ViewRecipe(${data.id})">View Recipe</button>
        <button class="remove view-recipe" onclick="Remove(${data.id})">Remove</button>
      </div>
    `
    favourites.innerHTML = favouriteHTML;
    console.log(favourites)

}

closeBtn.addEventListener('click', ()=> {
    quickSearch.style.display= 'block'
    searchResult.style.display= 'grid'
    loadMoreButton.style.display= 'block';
    moreInfo.style.display= 'none'
    chatBot.style.display='none'

})


function Remove(id){
    console.log("Remove")
    console.log(id)
    let index = arrayID.indexOf(id)
    arrayID.splice(index,1)
    console.log(arrayID)
    console.log(index)
    favouriteHTML=''
    for(let i =0; i< arrayID.length; i++){
        let ID= arrayID[i]
        let api = `https://api.spoonacular.com/recipes/${ID}/information?apiKey=${apiKey}`
        let fetched = FetchAPIInfo(api, 2)
    }

}



favouriteMenu.addEventListener('click', ()=>{
    quickSearch.style.display= 'none'
    searchResult.style.display= 'none'
    loadMoreButton.style.display= 'none';
    favourites.style.display= 'grid'
    moreInfo.style.display= 'none'
    chatBot.style.display='none'
})

function AddToFavourite(id){


    let fetched
    if(arrayID.length ==0) {
        arrayID.push(id)
        console.log(arrayID.length)
        console.log(arrayID)
        let api = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
        fetched = FetchAPIInfo(api, 2)
    }else {
        let i = 0;
        for (i = 0; i < arrayID.length; i++) {
            if (arrayID[i] == id) {
                break;
            }
        }
        if (i == arrayID.length) {
            arrayID.push(id)
            console.log(arrayID.length)
            console.log(arrayID)
            let api = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
            fetched = FetchAPIInfo(api, 2)
        }
    }


}

chatBotMenu.addEventListener('click', ()=>{
    document.body.style.backgroundImage='none'
    document.body.style.backgroundColor= '#363636'
    quickSearch.style.display= 'none'
    searchResult.style.display= 'none'
    loadMoreButton.style.display= 'none';
    favourites.style.display= 'none'
    moreInfo.style.display= 'none'
    chatBot.style.display='block'
    changeMultipleCSS()
})




chatForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    searchQuestion = e.target.querySelector('.question').value;
    console.log(searchQuestion)

    fetchAPIChat()

})

async function fetchAPIChat(){

    let apiUrl = `https://api.spoonacular.com/food/converse?text=${searchQuestion}&apiKey=${apiKey}`;

    const response = await fetch(apiUrl);
    console.log(response)

    const data = await response.json();

    console.log(data)

    generateChatBotHTML(data)
}

function generateChatBotHTML(data)
{
    chatMedia=''

    chatResult1.innerHTML= data.answerText

    if(data.media.length > 0) {
        data.media.map(result => {
            chatMedia += `
      <div class="item">
        <img src="${result.image}" alt="img">
         <h1 class="title">${result.title}</h1>
        <button class="view-recipe" ><a href="${result.link}">View More</a></button>
      </div>
    `
        })
    }
    chatResultMedia.innerHTML = chatMedia;

}

//dropdown button
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
function myFunction2() {
    document.getElementById("help").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
}



function changeMultipleCSS(e) {
    // Defining all our CSS styles
    const myStyles = `
    
    margin: 30px auto;
    font-size: 3rem;
   
  `;
    const myStyles2=`
    width: 90%;
    
    `;

    const myStyle3 =`
         max-width: 350px;
    `;
    const element = document.querySelector(".brand");
    const element2 = document.querySelector(".container")
    const element3 = document.querySelector("form")


    element.style.cssText = myStyles;
    element2.style.cssText = myStyles2;
    element3.style.cssText = myStyle3;
}
