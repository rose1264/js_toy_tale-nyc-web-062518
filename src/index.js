document.addEventListener('DOMContentLoaded', ()=> {
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  let addToy = false

  //use addBtn to toggle new toy form
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
      addBtn.innerText = 'Hide the form'
      // submit listener here
    } else {
      toyForm.style.display = 'none'
      addBtn.innerText = 'Add a new toy!'
    }
  })

  // todo: show all toys
  // step 1 fetch all toys and make card div
  // #toy-collection div
  // make a 'GET' request to fetch all the toy objects.
  // With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.
  const toyCollectionDiv = document.getElementById('toy-collection')
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(toys => displayInToyCardDiv(toys))

  const displayInToyCardDiv = (toys) => {
    toys.forEach((toy) => {
      let newDiv = document.createElement('div')
      newDiv.classList.add('card')
      newDiv.dataset.id = toy.id
      newDiv.innerHTML = renderToy(toy)

      toyCollectionDiv.appendChild(newDiv)
    })
  }

  // step 2 Add toy info to the card
  // render card info after fetch get request
  // <div class="card">
  // <h2>Woody</h2>
  // <img src=toy_image_url class="toy-avatar">
  // <p>4 Likes <p>
  // <button class="like-btn">Like <3</button>
  // </div>
  const renderToy = (toy) => {
    return `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar">
    <p>${toy.likes} Likes <p>
    <button class="like-btn">Like <3</button>
    `
  }

  // step 3 add a new toy
  // When a user clicks on the add new toy button
  //    -a POST request is sent to http://localhost:3000/toys
  //    -the new toy is added to Andy's Toy Collection.
  // The toy should conditionally render to the page.

  const createNewToyBtn = document.getElementById('create-new-toy')

  const createNewToyPostRequest = (toyName, toyImageUrl) => {
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: toyName.value,
        image: toyImageUrl.value,
        likes: 0
      })
    })
      .then(res => res.json())
      .then(console.log)
  }

  createNewToyBtn.addEventListener('click', ()=> {
    const toyName = document.getElementById('toy-name')
    const toyImageUrl = document.getElementById('toy-image-url')
    createNewToyPostRequest(toyName, toyImageUrl)
  })

  //  step 4 increase toy's likes
  // Conditionally increase the toy's like count
  // Send a patch request to the server at http://localhost:3000/toys/:id updating the number of likes that the specific toy has
  toyCollectionDiv.addEventListener('click', (e)=> {
    let toyId = e.target.parentElement.parentElement.getAttribute('data-id')
    if (e.target.className === 'like-btn') {
      let likeNum = parseInt(e.target.parentElement.previousElementSibling.innerText) + 1
      e.target.parentElement.previousElementSibling.innerText = `${likeNum} Likes`
      likeBtnPatchRequest(toyId, likeNum)
    }
  })

  //like button event handler

  const likeBtnPatchRequest = (toyId, likeNum) => {

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        likes: likeNum
      })
    })
      .then(res => res.json())
      .then(console.log)
  }
})
