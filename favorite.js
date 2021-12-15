const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const userList = JSON.parse(localStorage.getItem('favoriteUser'))
const dataPanel = document.querySelector('.user-list')
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const searchRow = document.querySelector('.search-row')
const USER_PER_PAGE = 8
const paginator = document.querySelector('.paginator')

let currentPage = 1

checkList()
// 檢查是否有名單
function checkList() {
  if (!userList || userList.length <= 0) {
    dataPanel.classList.add('justify-content-center')
    dataPanel.innerHTML = `
  <div class="card m-2 user-card"><div class='m-3 d-flex justify-content-center'><p class='p-1 m-0'>尚未有好友呢！</p><a href="/index.html" class="btn btn-dark search-btn "><p class='m-0 p-0'>Go to home</p></a></div></div>
  `
  } else {
    dataPanel.classList.remove('justify-content-center')
    // 分頁
    renderPaginator(userList.length)
    renderUserList(getUserByPage(1, userList))
  }
}



function renderUserList(data) {
  let rowHTML = ``
  data.forEach((item) => {
    rowHTML += `
    <div class="card m-2 user-card" >
    <img src="${item.avatar}" alt="" id="user-img" class='favorite-user-img' data-id='${item.id}' data-bs-toggle="modal" data-bs-target="#user-modal">
      <div class="user-info d-flex flex-row justify-content-between">
        <div class="user-content">
          <p id="user-name">${item.name}, ${item.age}</p>
          <p id='user-region'>${item.region}</p>
        </div>
      <a href="#" class="btn circle" id='favorite-btn' data-id='${item.id}'><i class="fas fa-heart fa-2x" id='favorite-btn' data-id='${item.id}'></i></a>
    </div>
     </div>
  `
  })

  dataPanel.innerHTML = rowHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE)
  rawHTML = ``
  for (let page = 1; page <= numberOfPages; page++) {
    if (currentPage === page) {
      rawHTML += `
<li class="page-item active"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>
`
    } else {
      rawHTML += `
<li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>
`
    }

  }
  paginator.innerHTML = rawHTML
}

function getUserByPage(page, list) {
  const startIndex = (page - 1) * USER_PER_PAGE
  return list.slice(startIndex, startIndex + USER_PER_PAGE)
}

// 監聽 user card
dataPanel.addEventListener('click', function onCardClicked(event) {
  const id = Number(event.target.dataset.id)

  if (event.target.matches('#user-img')) {
    showUserModal(id)
  } else if (event.target.matches('#favorite-btn')) {
    removeFromUserList(id)
    renderPaginator(userList.length)
    renderUserList(getUserByPage(1, userList))
    checkList()
  }
})

function showUserModal(id) {
  const modalTitle = document.querySelector(".user-modal-name")
  const modalAge = document.querySelector(".user-modal-age")
  const modalGender = document.querySelector(".user-modal-gender")
  const modalRegion = document.querySelector(".user-modal-region")
  const modalBirthday = document.querySelector(".user-modal-birthday")
  const modalEmail = document.querySelector(".user-modal-email")
  const modalImg = document.querySelector(".user-modal-img")

  // 先清空資料，前一筆資料不殘留
  modalTitle.innerText = ""
  modalAge.innerText = ""
  modalGender.innerText = ""
  modalRegion.innerText = ""
  modalBirthday.innerText = ""
  modalEmail.innerText = ""
  modalImg.src = ""

  axios.get(INDEX_URL + id).then((response) => {
    const user = response.data
    modalImg.src = user.avatar
    modalTitle.innerText = user.name + " " + user.surname
    modalAge.innerText = "AGE: " + user.age
    modalGender.innerText = "Gender: " + user.gender
    modalRegion.innerText = "Region: " + user.region
    modalBirthday.innerText = "Birthday: " + user.birthday
    modalEmail.innerText = "E-mail: " + user.email
  })
}

// 移除我的最愛
function removeFromUserList(id) {
  const userIndex = userList.findIndex(user => user.id === id)
  userList.splice(userIndex, 1)

  localStorage.setItem('favoriteUser', JSON.stringify(userList))
}

let filterUser = []

// 搜尋
searchForm.addEventListener("submit", function onSearchBtnClicked(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filterUser = userList.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )

  if (filterUser.length === 0) {
    return alert("找不到關鍵字：" + keyword);
  }

  renderPaginator(filterUser.length)
  renderUserList(getUserByPage(1, filterUser))
})

// 分頁監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  // 'A' -> 元素 <a></a>
  if (event.target.tagName !== 'A') return
  
  currentPage = Number(event.target.dataset.page)

  if (searchInput.value.length === 0) {
    // 未搜尋時，取喜愛名單
    renderUserList(getUserByPage(currentPage, userList))
    renderPaginator(userList.length)
  } else {
    // 使用搜尋時，使用喜愛名單中搜尋結果名單
    renderUserList(getUserByPage(currentPage, filterUser))
    renderPaginator(filterUser.length)
  }
})