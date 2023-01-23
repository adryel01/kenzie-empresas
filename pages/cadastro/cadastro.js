import { createUser } from "../../scripts/requests.js";
import { toast } from "/scripts/toast.js";

const headerMenu = document.querySelector('.header-menu')
const buttonMenuDropdown = document.querySelector('.button-menu-dropdown');
const selectSectorBar = document.querySelector('.select-sector')

let toggle = true

buttonMenuDropdown.addEventListener('click', (e) => {
    e.preventDefault()
    const menuDropdown = document.querySelector('.menu-dropdown')
    menuDropdown.classList.toggle('show')
    selectSectorBar.classList.toggle('show')

    toggle = !toggle

    if(toggle){
        buttonMenuDropdown.innerHTML = '<i class="fa-solid fa-bars"></i>'
    } else {
        buttonMenuDropdown.innerHTML = 'X'
    }
})

function renderDropdownMenu (){
    const menuDropdown = document.createElement('div')

    headerMenu.appendChild(menuDropdown)
    menuDropdown.classList.add('menu-dropdown')
    menuDropdown.classList.add('show')
    menuDropdown.insertAdjacentHTML('beforeend',`
    <section class="menu-dropdown">
        <a href="/index.html" class="button-home">Home</a>
        <a href="/pages/login/login.html"class="button-login">Login</a>
        
    </section>
    `)

    return menuDropdown
}
renderDropdownMenu ()

const buttonSubmit = document.querySelector('.button-form-cadastro')
buttonSubmit.addEventListener('click', (e) => {
    e.preventDefault()

    const valueInputName = document.querySelector('#input-name')
    const valueInputEmail = document.querySelector('#input-email')
    const valueInputPassword = document.querySelector('#input-password')
    const valueProfessionalLevel = document.querySelector('#professional-level')

    const userCreated = {
        username: valueInputName.value,
        password: valueInputPassword.value,
        email: valueInputEmail.value,
        professional_level: valueProfessionalLevel.value
    }

    createUser(userCreated)
    console.log(userCreated)
})

