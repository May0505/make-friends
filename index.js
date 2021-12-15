const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const dataPanel = document.querySelector("#user-info")
const favoriteList = JSON.parse(localStorage.getItem('favoriteUser'))

const userList = []

axios.get(INDEX_URL).then((respones) => {
  userList.push(...respones.data.results)
  checkFavoriteList()
})

// 確認喜愛清單是否存在及是否有值
// function checkFavoriteList() {
//   if (favoriteList && favoriteList.length > 0) {
//     for (i = 0; favoriteList.length > i; i++) {
//       // 比對喜愛名單
//       removeFromUserList(favoriteList[i].id)
//     }
//     checkUserList()
//   } else {
//     checkUserList()
//   }
// }

// 觀摩後
function checkFavoriteList() {
  if (favoriteList && favoriteList.length > 0) {
    favoriteList.forEach((item) => {
      let id = userList.find(f => f.id === item.id)
      removeFromUserList(id)
    })
    checkUserList()
  } else {
    checkUserList()
  }
}

// 確認使用者清單是否有值
function checkUserList() {
  if (userList.length === 0) {
    // 已經沒有名單可以產出
    dataPanel.innerHTML = `
    <div class='m-3 d-flex justify-content-center'><p class='p-1 m-0'>你加了很多朋友呢！</p><a href="/favorite.html" class="btn btn-dark search-btn "><p class='m-0 p-0'>Go to favorite</p></a></div>
    `
  } else {
    // 隨機給一位 user
    let newId = Math.floor(Math.random() * userList.length) 
    renderUserList(userList[newId])
  }
}

function renderUserList(data) {
  let rowHTML = `
  <img src="${data.avatar}" alt="" id="user-img">
    <div class="user-info">
      <p id="user-name">${data.name}, ${data.age}</p>
      <p id='user-region'>${data.region}</p>
      <footer class="d-flex justify-content-around">
      <a href="#" class="btn circle btn-skip-user" id='${data.id}'><i class="fas fa-times fa-3x btn-skip-user" id='${data.id}'></i></a>
      <a href="#" class="btn circle btn-add-favorite" id='${data.id}'><i class="fas fa-heart fa-2x btn-add-favorite" id='${data.id}'></i></a>
    </footer>
  </div>
      `
  dataPanel.innerHTML = rowHTML;
}

// 監聽 跳過、加到我的最愛名單或是重整畫面
dataPanel.addEventListener('click', function onListClicked(event) {
  const id = Number(event.target.id)

  if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(id)
    removeFromUserList(id)
    checkUserList()
  } else if (event.target.matches('.btn-skip-user')) {
    removeFromUserList(id)
    checkUserList()
  } else if (event.target.matches('.btn-reload')) {
    location.reload()
  }
})

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
  const user = userList.find(user => user.id === id)

  list.push(user)
  localStorage.setItem('favoriteUser', JSON.stringify(list))
}

function removeFromUserList(id) {
  const userIndex = userList.findIndex(user => user.id === id)
  userList.splice(userIndex, 1)
}
