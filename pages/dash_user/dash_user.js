import { getUser, verifyAuthorization, getUserProfile, editUserProfile, getAllEmployersSameDepartment, getAllDepartmentsOfCompany } from "../../scripts/requests.js"

async function renderDash() {
    const tokenUser = await getUser()
    const verification = await verifyAuthorization(tokenUser)

    if (verification.erro == 'Token Invalid') {
        location.replace('/')
    } else if (verification.is_admin) {
        location.replace('/pages/dash_admin/dash_admin.html')
    }
}
renderDash()

const body = document.querySelector('body')
const buttonLogout = document.querySelector('.button-logout')


buttonLogout.addEventListener('click', (e) => {
    e.preventDefault()

    localStorage.clear()

    location.replace('/pages/login/login.html')
})

async function renderUserProfile() {
    const token = await getUser()
    const userProfile = await getUserProfile(token)
    const sectionUser = document.querySelector('.section-info-user')
    const sectionFriends = document.querySelector('.current-company')
   
    let kindOfWork = ''
    if (userProfile.kind_of_work == null) {
        kindOfWork = 'Presencial ou Remoto'
    } else {
        kindOfWork = userProfile.kind_of_work
    }

    sectionUser.insertAdjacentHTML('beforeend', `
    <div class="info-user">
        <h1>${userProfile.username.slice(0, 1).toUpperCase() + userProfile.username.substring(1)}</h1>
        <span class="user-email">${userProfile.email}</span>
        <span class="user-level">${userProfile.professional_level.slice(0, 1).toUpperCase() + userProfile.professional_level.substring(1)}</span>
        <span class="user-kind-work">${kindOfWork}</span>
    </div>
    <button class="button-edit-user" type="button"><i class="fa-solid fa-pen"></i></button>
    `)

    const colegas = await getAllEmployersSameDepartment(token)
    
    if (colegas.length !== 0){
        sectionFriends.innerHTML = ''
    }
    const departamentoCompany = await getAllDepartmentsOfCompany(token)
    const listFriends = document.createElement('ul')
    sectionFriends.append(listFriends)
    listFriends.classList.add('list-friends')
    sectionFriends.insertAdjacentHTML('afterbegin',`
    <div class="header-company">
        <h1><span>${departamentoCompany.name}</span> - <span>${colegas[0].name}</span></h1>
    </div>
    `)
    colegas[0].users.forEach(element => {
        listFriends.insertAdjacentHTML('beforeend', `
    <li class="item-list-friends">
        <h4>${element.username}</h4>
        <p>${element.professional_level}</p>
    </li>
    
    `)
    });
    
    console.log(colegas)
    console.log(departamentoCompany)

}

await renderUserProfile()

const buttonShowModal = document.querySelector('.button-edit-user')
const backgroundModal = document.querySelector('.bg-modal')
const modal = document.querySelector('.modal-edit-profile')


buttonShowModal.addEventListener('click', () => {
    backgroundModal.classList.toggle('hide')
    modal.classList.toggle('hide')
})

const closeModal = document.querySelector('.close-modal')
closeModal.addEventListener('click', () => {
    backgroundModal.classList.toggle('hide')
    modal.classList.toggle('hide')
})


const token = await getUser()
const buttonSubmitEdit = document.querySelector('.submit-modal')

async function editUser() {

    buttonSubmitEdit.addEventListener('click', async (e) => {
        e.preventDefault()

        const valueInputEditName = document.querySelector('#edit-name')
        const valueInputEditEmail = document.querySelector('#edit-email')
        const valueInputEditPassword = document.querySelector('#edit-password')

        const userEdited = {
            username: valueInputEditName.value,
            password: valueInputEditPassword.value,
            email: valueInputEditEmail.value
        }
        const sectionUser = document.querySelector('.section-info-user')

        await editUserProfile(token, userEdited)
        sectionUser.innerHTML = ''
        renderUserProfile()
    })
}
editUser()