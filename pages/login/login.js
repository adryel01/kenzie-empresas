import { loginUser, getUser, verifyAuthorization, white } from "../../scripts/requests.js";
import { toast } from "../../scripts/toast.js";
// import { toast } from "../../scripts/toast.js";

const headerMenu = document.querySelector('.header-menu')
const buttonMenuDropdown = document.querySelector('.button-menu-dropdown');
const selectSectorBar = document.querySelector('.select-sector')

let toggle = true
buttonMenuDropdown.addEventListener('click', async (e) => {
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
        <a href="/pages/cadastro/cadastro.html"class="button-cadastro">Cadastro</a>
        
    </section>
    `)

    return menuDropdown
}
renderDropdownMenu ()


const buttonLogin = document.querySelector('#button-login')
buttonLogin.addEventListener('click', (e) => {
    e.preventDefault()

    const valueInputEmail = document.querySelector('#input-email')
    const valueInputPassword = document.querySelector('#input-password')

    const userLogged = {
        email: valueInputEmail.value,
        password: valueInputPassword.value
    }

    loginUser(userLogged)
    
})

async function renderDash() {
    const tokenUser = await getUser()
    const verification = await verifyAuthorization(tokenUser)

    if (verification.erro == 'Token Invalid') {
        toast('Faça o login para acessar', white)
    } else if(verification.is_admin) {
        location.replace('/pages/dash_admin/dash_admin.html')
    } else {
        location.replace('/pages/dash_user/dash_user.html')
    }
}
renderDash()

