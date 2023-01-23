import { toast } from "./toast.js";
import { urlBase, apiHeaders, green, red, createUser, loginUser, getAllCompanies, getCompaniesBySector, getAllSectors } from "./requests.js";

//Menu dropdown -------------------------
const headerMenu = document.querySelector('.header-menu')
const buttonMenuDropdown = document.querySelector('.button-menu-dropdown');
const selectSectorBar = document.querySelector('.select-sector')

let toggle = true
buttonMenuDropdown.addEventListener('click', (e) => {
    e.preventDefault()
    const menuDropdown = document.querySelector('.menu-dropdown')
    menuDropdown.classList.toggle('show')
    // selectSectorBar.classList.toggle('show')

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
        <a href="/pages/login/login.html"class="button-login">Login</a>
        <a href="/pages/cadastro/cadastro.html"class="button-cadastro">Cadastro</a>
        
    </section>
    `)

    return menuDropdown
}
renderDropdownMenu ()

// Renderizando empresas ---------------------

// getAllCompanies()
const companiesList = document.querySelector('.list-companies')

const companiesAPI = await getAllCompanies()

function renderCompanies (companiesAPI) {
    companiesAPI.forEach(element => {
        companiesList.insertAdjacentHTML('beforeend',`
        <li class="list-companies-item">
        <h3 class="companie-name">${element.name}</h3>
        <p class="companie-opening-hours">${element.opening_hours.slice(0,2)+' horas'}</p>
        <button type="button" class="companie-sector">${element.sectors.description}</button>
        </li>
        `)
    });
}
renderCompanies (companiesAPI)

const dropSectorFilter = document.querySelector('.select-sector')
dropSectorFilter.addEventListener('click', (e) => {
    e.preventDefault()
    const eventClick = e.currentTarget

})


async function renderDropSelector () {
    // const listFilter = document.createElement('form')
    // listFilter.classList.add('filter-companies')
    const sectors = await getAllSectors()
    const values = sectors.map(element => {
       return element.description
    })

    const selectSectorBar = document.querySelector('.select-list')
    // const container = document.querySelector('.container')
    // container.append(selectSectorBar)
    
    values.forEach(element => {
        // const itensForm = document.createElement('option')
        // itensForm.classList.add('input-radio')
        // // const itensLabel = document.createElement('label')
        
        // // itensLabel.setAttribute('for',element)
        // // itensLabel.setAttribute('id',element)
        // // itensLabel.setAttribute('value',element)
        // // itensForm.type = 'radio'
        // // itensForm.setAttribute('id',element)
        // itensForm.setAttribute('value',element)
        // itensForm.innerHTML = element
        // itensForm.setAttribute('name', 'companie')
        selectSectorBar.insertAdjacentHTML('beforeend', `
            <option value="${element}">${element}</option>
        `)
        
        // selectSectorBar.append(itensForm)
    })
    
}

const formulario = document.querySelector('form')
formulario.addEventListener('click', async (e) => {
    const valueInput = e.target
    companiesList.innerHTML = ''
    if (valueInput.value == ''){
        renderCompanies (companiesAPI)
    } else {
        const filterValue = await getCompaniesBySector (valueInput.value)
        renderCompanies(filterValue)
    }
})


const seletor = document.querySelector('.select-sector')
seletor.addEventListener('click', () => {
    formulario.classList.toggle('show')
    const iconAnimation = document.querySelector('.fa-arrow-down')
    iconAnimation.classList.toggle('button-rotate')
})


renderDropSelector ()
