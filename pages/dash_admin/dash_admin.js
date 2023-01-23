import { getUser, verifyAuthorization, getAllCompanies, getDepartments, getAllDepartments, createDepartment, getAllUsers, modifyDepartment, deleteDepartment, modifyUser, deleteUser, getUsersWithOutDepartments, hireEmployer, dismissEmployer } from "../../scripts/requests.js"

async function renderDash() {
    const tokenUser = await getUser()
    const verification = await verifyAuthorization(tokenUser)

    if (verification.erro == 'Token Invalid') {
        location.replace('/')
    } else if (!verification.is_admin) {
        location.replace('/pages/dash_user/dash_user.html')
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


async function renderDropSelector() {

    const companies = await getAllCompanies()
    const values = companies.map(element => {
        return element.name
    })

    const selectSectorBar = document.querySelector('#list-select-company')

    values.forEach(element => {
        const itensForm = document.createElement('option')
        itensForm.classList.add('option-form')

        itensForm.setAttribute('id', element)
        itensForm.setAttribute('value', element)
        itensForm.innerHTML = element

        selectSectorBar.append(itensForm)
    })

}
renderDropSelector()

const dropSelectorCompanies = document.querySelector('#list-select-company')
async function renderDepartments() {

    const listDepartamentsCompany = document.querySelector('.list-departments')
    const tokenUser = await getUser()
    const modalShowHideDepartment = document.querySelector('.modal-show-hide')
    const modalEditDepartment = document.querySelector('.modal-edit-department')
    const modalDeleteDepartment = document.querySelector('.modal-delete-department')

    dropSelectorCompanies.addEventListener('change', async () => {

        listDepartamentsCompany.innerHTML = ''


        const uuidCompany = await findIdCompany()

        let itemList = await getDepartments(tokenUser, uuidCompany)

        itemList.forEach((element, index) => {
            listDepartamentsCompany.insertAdjacentHTML('beforeend', `
            <li class="item-list-departments">
                <div class="header-item-list-departments">
                    <h3 class="department-item-list-departments">${element.name}</h3>
                    <p class="description-item-list-departments">${element.description}</p>
                    <p class="company-item-list-departments">${element.companies.name}</p>
                </div>
                <div class="buttons-item-list-departments">
                    <button class="button-show-hide"><i class="fa-regular fa-eye"></i></button>
                    <button class="button-edit-department"><i class="fa-solid fa-pen"></i></button>
                    <button class="button-delete-department"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </li>
            `)
            let idButtonShowHide = document.querySelectorAll('.button-show-hide')
            idButtonShowHide[index].setAttribute('id', `show_${element.uuid}`)
            idButtonShowHide[index].setAttribute('name', `name_${element.name}`)
            let valueIdButton = document.querySelectorAll('.button-edit-department')
            valueIdButton[index].setAttribute('id', `edit_${element.uuid}`)
            let idButtonDelete = document.querySelectorAll('.button-delete-department')
            idButtonDelete[index].setAttribute('id', `delete_${element.uuid}`)
            idButtonDelete[index].setAttribute('name', element.name)

        })


        const backgroundModal = document.querySelector('.bg-modal')

        const buttonModalEditDepartment = document.querySelectorAll('.button-edit-department')

        buttonModalEditDepartment.forEach(element => {

            element.addEventListener('click', (e) => {
                backgroundModal.classList.toggle('hide')
                modalEditDepartment.classList.toggle('hide')
                const valueIdEditButton = e.currentTarget.id.substring(5)
                const valueInputEditDepartment = document.querySelector('#edit-department-description')

                const buttonSubmitEditDepartment = document.querySelector('.submit-modal-edit-department')
                buttonSubmitEditDepartment.addEventListener('click', async () => {
                    const descript = await { description: valueInputEditDepartment.value }
                    await modifyDepartment(tokenUser, valueIdEditButton, descript)
                })

            })

        })

        const buttonDeleteDepartment = document.querySelectorAll('.button-delete-department')

        buttonDeleteDepartment.forEach(element => {
            element.addEventListener('click', (e) => {
                let closeModalDeleteDepartment = document.querySelector('.close-modal-delete-department')
                closeModalDeleteDepartment.addEventListener('click', () => {
                    document.querySelector('.backgroundModal').classList.toggle('hide') //forcei o erro no console para executar a função de fechar o modal
                    modalDeleteDepartment.classList.toggle('hide')

                })
                backgroundModal.classList.toggle('hide')
                modalDeleteDepartment.classList.toggle('hide')
                const valueTarget = e.currentTarget.id.substring(7)
                const nameTarget = e.currentTarget.name
                const departmentName = document.querySelector('.department-name')
                departmentName.innerHTML = nameTarget
                const buttonSubmitDeleteDepartment = document.querySelector('.submit-modal-delete-department')

                buttonSubmitDeleteDepartment.addEventListener('click', async () => {
                    await deleteDepartment(tokenUser, valueTarget)
                })


            })
        })

        const buttonModalShowHide = document.querySelectorAll('.button-show-hide')
        const selectShowHideUser = document.querySelector('#list-users-to-hire')
        const listUsersOutWork = renderListUsersOutWork()
        const departmentName = document.querySelector('.department-name-modal-show-hide')
        const departmentHeaderDescription = document.querySelector('.header-show-hide-department-description')
        const companyName = document.querySelector('.header-show-hide-company-name')
        const buttonHireEmployer = document.querySelector('.button-hire-employer')
        buttonModalShowHide.forEach(element => {
            element.addEventListener('click', (e) => {
                backgroundModal.classList.toggle('hide')
                modalShowHideDepartment.classList.toggle('hide')
                const valueTarget = e.currentTarget.id.substring(5)
                const nameTarget = e.currentTarget.name.substring(5)
                const departmentLocation = itemList.find(element => element.uuid == valueTarget)
                departmentName.innerHTML = nameTarget
                departmentHeaderDescription.innerHTML = departmentLocation.description
                companyName.innerHTML = departmentLocation.companies.name

                listUsersOutWork.forEach(element => {
                    selectShowHideUser.insertAdjacentHTML('beforeend', `
                    <option value="${element.uuid}">${element.username}</option>
                    `)
                })

                selectShowHideUser.addEventListener('change', () => {
                    const valueSelector = selectShowHideUser.value
                    const employerToHire = {
                        user_uuid: valueSelector,
                        department_uuid: valueTarget
                    }
                    buttonHireEmployer.addEventListener('click', (e) => {
                        e.preventDefault()
                        hireEmployer(tokenUser, employerToHire)
                    })

                })

                let listHired = getAllUsers(tokenUser)
                let employersHired = listHired.filter(element => {
                    return element.department_uuid == valueTarget
                })


                const listUsersHired = document.querySelector('.list-users-hired')

                employersHired.forEach((element, index) => {
                    // const valor = await compareUuid(element.department_uuid)
                    listUsersHired.insertAdjacentHTML('beforeend', `
                    <li class="card-user-hired">
                        <h3>${element.username}</h3>
                        <p>${element.professional_level}</p>
                        <p>${companyName.textContent}</p>
                        <div class="footer-card-user-hired">
                            <button type="submit" class="button-fire" id="fire_${element.uuid}">Desligar</button>
                        </div>
                    </li>
                    `)
                    const buttonFire = document.querySelectorAll('.button-fire')
                    buttonFire[index].addEventListener('click', (e) => {

                        const valueTargetFire = e.currentTarget.id.substring(5)
                        dismissEmployer(tokenUser, valueTargetFire)
                        location.reload()
                    })
                })
            })
        })

    })
    let closeModalEditDepartment = document.querySelector('.close-modal-edit-department')
    closeModalEditDepartment.addEventListener('click', () => {
        backgroundModal.classList.toggle('hide')
        modalEditDepartment.classList.toggle('hide')

    })

}
await renderDepartments()


const tokenUser = await getUser()
async function renderAllDepartments() {
    const listDepartamentsCompany = document.querySelector('.list-departments')
    const itemNull = document.querySelector('#list-select-company')
    listDepartamentsCompany.innerHTML = ''

    let itemList = ''
    if (itemNull.value == 'all') {
        itemList = await getAllDepartments(tokenUser)
    }


    itemList.forEach((element, index) => {

        listDepartamentsCompany.insertAdjacentHTML('beforeend', `
            <li class="item-list-departments">
                <div class="header-item-list-departments">
                    <h3 class="department-item-list-departments">${element.name}</h3>
                    <p class="description-item-list-departments">${element.description}</p>
                    <p class="company-item-list-departments">${element.companies.name}</p>
                </div>
                <div class="buttons-item-list-departments">
                    <button class="button-show-hide" type="button"><i class="fa-regular fa-eye"></i></button>
                    <button class="button-edit-department"><i class="fa-solid fa-pen"></i></button>
                    <button class="button-delete-department"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </li>
            `)
        let idButtonShowHide = document.querySelectorAll('.button-show-hide')
        idButtonShowHide[index].setAttribute('id', `show_${element.uuid}`)
        idButtonShowHide[index].setAttribute('name', `name_${element.name}`)
        let idButtonEdit = document.querySelectorAll('.button-edit-department')
        idButtonEdit[index].setAttribute('id', element.uuid)
        let idButtonDelete = document.querySelectorAll('.button-delete-department')
        idButtonDelete[index].setAttribute('id', `delete_${element.uuid}`)
        idButtonDelete[index].setAttribute('name', element.name)


    })

    const backgroundModal = document.querySelector('.bg-modal')
    const modalEditDepartment = document.querySelector('.modal-edit-department')
    const buttonModalEditDepartment = document.querySelectorAll('.button-edit-department')

    buttonModalEditDepartment.forEach(element => {
        element.addEventListener('click', (e) => {
            backgroundModal.classList.toggle('hide')
            modalEditDepartment.classList.toggle('hide')
            const valueIdEditButton = e.currentTarget.id
            const valueInputEditDepartment = document.querySelector('#edit-department-description')

            const buttonSubmitEditDepartment = document.querySelector('.submit-modal-edit-department')
            buttonSubmitEditDepartment.addEventListener('click', async () => {
                const descript = await { description: valueInputEditDepartment.value }
                await modifyDepartment(tokenUser, valueIdEditButton, descript)
            })
        })
    })

    const closeModalEditDepartment = document.querySelector('.close-modal-edit-department')
    closeModal.addEventListener('click', () => {
        backgroundModal.classList.toggle('hide')
        modalEditDepartment.classList.toggle('hide')
    })

    const buttonDeleteDepartment = document.querySelectorAll('.button-delete-department')
    const modalDeleteDepartment = document.querySelector('.modal-delete-department')
    buttonDeleteDepartment.forEach(element => {
        element.addEventListener('click', (e) => {
            backgroundModal.classList.toggle('hide')
            modalDeleteDepartment.classList.toggle('hide')
            const valueTarget = e.currentTarget.id.substring(7)
            const nameTarget = e.currentTarget.name
            const departmentName = document.querySelector('.department-name')
            departmentName.innerHTML = nameTarget
            const buttonSubmitDeleteDepartment = document.querySelector('.submit-modal-delete-department')

            buttonSubmitDeleteDepartment.addEventListener('click', async () => {
                await deleteDepartment(tokenUser, valueTarget)
            })

        })
    })

    const modalShowHideDepartment = document.querySelector('.modal-show-hide')
    const buttonModalShowHide = document.querySelectorAll('.button-show-hide')
    const selectShowHideUser = document.querySelector('#list-users-to-hire')
    const listUsersOutWork = await renderListUsersOutWork()
    const departmentName = document.querySelector('.department-name-modal-show-hide')
    const departmentHeaderDescription = document.querySelector('.header-show-hide-department-description')
    const companyName = document.querySelector('.header-show-hide-company-name')
    const buttonHireEmployer = document.querySelector('.button-hire-employer')

    buttonModalShowHide.forEach(element => {

        element.addEventListener('click', async (e) => {

            backgroundModal.classList.toggle('hide')
            modalShowHideDepartment.classList.toggle('hide')
            const valueTarget = e.currentTarget.id.substring(5)
            const nameTarget = e.currentTarget.name.substring(5)
            const departmentLocation = itemList.find(element => element.uuid == valueTarget)
            departmentName.innerHTML = nameTarget
            departmentHeaderDescription.innerHTML = departmentLocation.description
            companyName.innerHTML = departmentLocation.companies.name

            listUsersOutWork.forEach(element => {
                selectShowHideUser.insertAdjacentHTML('beforeend', `
                <option value="${element.uuid}">${element.username}</option>
                `)
            })

            selectShowHideUser.addEventListener('change', () => {
                const valueSelector = selectShowHideUser.value
                const employerToHire = {
                    user_uuid: valueSelector,
                    department_uuid: valueTarget
                }
                buttonHireEmployer.addEventListener('click', () => {
                    hireEmployer(tokenUser, employerToHire)
                    location.reload()
                })

            })

            let listHired = await getAllUsers(tokenUser)
            let employersHired = listHired.filter(element => {
                return element.department_uuid == valueTarget
            })


            const listUsersHired = document.querySelector('.list-users-hired')
            
            employersHired.forEach((element, index) => {
                
                listUsersHired.insertAdjacentHTML('beforeend', `
                    <li class="card-user-hired">
                        <h3>${element.username}</h3>
                        <p>${element.professional_level}</p>
                        <p>${companyName.textContent}</p>
                        <div class="footer-card-user-hired">
                            <button type="submit" class="button-fire" id="fire_${element.uuid}">Desligar</button>
                        </div>
                    </li>
                    `)
                const buttonFire = document.querySelectorAll('.button-fire')
                buttonFire[index].addEventListener('click', (e) => {

                    const valueTargetFire = e.currentTarget.id.substring(5)
                    dismissEmployer(tokenUser, valueTargetFire)
                    location.reload()
                })
            })



        })

    })

    const closeModalShowHide = document.querySelector('.close-modal-show-hide')
    const listUsersHired = document.querySelector('.list-users-hired')
    closeModalShowHide.addEventListener('click', () => {
        backgroundModal.classList.toggle('hide')
        modalShowHideDepartment.classList.toggle('hide')
        listUsersHired.innerHTML = ''
    })


    const closeModalDeleteDepartment = document.querySelector('.close-modal-delete-department')
    closeModalDeleteDepartment.addEventListener('click', () => {
        backgroundModal.classList.toggle('hide')
        modalDeleteDepartment.classList.toggle('hide')
    })


}
renderAllDepartments(tokenUser)

async function renderListUsersOutWork() {
    const listRender = await getUsersWithOutDepartments(tokenUser)
    return listRender
}



async function findIdCompany() {
    const companies = await getAllCompanies()
    const values = await companies.find(element => {
        if (dropSelectorCompanies.value == element.name) {
            return element
        }

    })

    return values.uuid
}


const buttonModalCreateDepartment = document.querySelector('.button-create-department')
const backgroundModal = document.querySelector('.bg-modal')
const modalCreateDepartment = document.querySelector('.modal-create-department')
buttonModalCreateDepartment.addEventListener('click', () => {
    backgroundModal.classList.toggle('hide')
    modalCreateDepartment.classList.toggle('hide')
})

const closeModal = document.querySelector('.close-modal-create-department')
closeModal.addEventListener('click', () => {
    backgroundModal.classList.toggle('hide')
    modalCreateDepartment.classList.toggle('hide')
})


async function renderDropSelectorModal() {

    const companies = await getAllCompanies()
    const values = companies.map(element => {
        return element.name
    })

    const selectSectorBar = document.querySelector('#list-create-department')

    values.forEach(element => {
        const itensForm = document.createElement('option')
        itensForm.classList.add('option-form')

        itensForm.setAttribute('id', element)
        itensForm.setAttribute('value', element)
        itensForm.innerHTML = element

        selectSectorBar.append(itensForm)
    })

}
renderDropSelectorModal()


async function getValuesSelectorCreateDepartment() {
    const dropSelectorCompanies = document.querySelector('#list-create-department')
    const companies = await getAllCompanies()
    const values = companies.find(element => {
        if (dropSelectorCompanies.value == element.name) {
            return element
        }

    })

    return values.uuid
}


const dropSelectorModal = document.querySelector('#list-create-department')
dropSelectorModal.addEventListener('change', () => {
    getValuesSelectorCreateDepartment()
})

const buttonSubmitEdit = document.querySelector('.submit-modal-create-department')
async function submitCreateDepartment() {

    buttonSubmitEdit.addEventListener('click', async (e) => {
        e.preventDefault()

        const valueInputDepartmentName = document.querySelector('#input-department-name')
        const valueInputDepartmentDescription = document.querySelector('#input-department-description')
        const valueInputCompany = await getValuesSelectorCreateDepartment()

        const departmentCreated = {
            name: valueInputDepartmentName.value,
            description: valueInputDepartmentDescription.value,
            company_uuid: valueInputCompany
        }
        // const sectionUser = document.querySelector('.section-info-user')

        await createDepartment(tokenUser, departmentCreated)
        // sectionUser.innerHTML = ''
        backgroundModal.classList.toggle('hide')
        modalCreateDepartment.classList.toggle('hide')
        renderAllDepartments(tokenUser)
    })
}
submitCreateDepartment()

async function getInfoUsers() {
    const listUsers = await getAllUsers(tokenUser)
    const itemListUsers = document.querySelector('.list-users')
    const valuesListUsers = listUsers.map(element => {
        return element
    })
    valuesListUsers.forEach(async element => {
        let valor = ''
        if (element.department_uuid == null) {
            valor = 'Sem empresa'
        } else {
            valor = await compareUuid(element.department_uuid)
        }
        let insert = ''
        if (valor == 'Sem empresa') {
            insert = valor
        } else {
            insert = valor.companies.name
        }

        itemListUsers.insertAdjacentHTML('beforeend', `
        <li class="card-user">
            <h3>${element.username}</h3>
            <p>${element.professional_level}</p>
            <p>${insert}</p>
            <div class="footer-card-user">
                <button class="button-edit-user" id=${element.uuid}><i class="fa-solid fa-pen"></i></button>
                <button class="button-delete-user" id=user_delete_${element.uuid}><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </li>
        
        `)

    })
    await showEditUserModal()
    await showDeleteUserModal()
}
getInfoUsers()

async function compareUuid(uuidUser) {
    const uuidUsuario = uuidUser
    const departamentos = await getAllDepartments(tokenUser)

    const result = departamentos.find(element => {
        if (element.uuid == null) {
            return 'Sem empresa'
        } else {
            return element
        }
    })

    return result
}

async function showEditUserModal() {
    const buttonEditUser = document.querySelectorAll('.button-edit-user')
    const modalEditUser = document.querySelector('.modal-edit-user')

    buttonEditUser.forEach(element => {
        element.addEventListener('click', (e) => {
            backgroundModal.classList.toggle('hide')
            modalEditUser.classList.toggle('hide')
            const valueEditUserId = e.currentTarget.id
            const buttonSubmitEditUser = document.querySelector('.submit-modal-edit-user')
            buttonSubmitEditUser.addEventListener('click', () => {
                const valueWorkModality = document.querySelector('#list-work-modalities')
                const valueProfessionalLevel = document.querySelector('#list-professional-level')
                const descriptionUser = {
                    kindofwork: valueWorkModality.value,
                    professional_level: valueProfessionalLevel.value
                }

                modifyUser(tokenUser, valueEditUserId, descriptionUser)
            })

        })
    })
    closeEditUserModal()
}

async function closeEditUserModal() {
    const buttonCloseEditUser = document.querySelector('.close-modal-edit-user')
    const modalEditUser = document.querySelector('.modal-edit-user')
    buttonCloseEditUser.addEventListener('click', () => {
        backgroundModal.classList.toggle('hide')
        modalEditUser.classList.toggle('hide')
    })
}

async function showDeleteUserModal() {
    const buttonDeleteUser = document.querySelectorAll('.button-delete-user')
    const modalDeleteUser = document.querySelector('.modal-delete-user')
    buttonDeleteUser.forEach(element => {
        element.addEventListener('click', (e) => {
            backgroundModal.classList.toggle('hide')
            modalDeleteUser.classList.toggle('hide')
            const valueTarget = e.currentTarget.id.substring(12)
            const nameTarget = e.currentTarget.name
            const userName = document.querySelector('.user-name')
            userName.innerHTML = nameTarget
            const buttonSubmitDeleteUser = document.querySelector('.submit-modal-delete-user')

            buttonSubmitDeleteUser.addEventListener('click', () => {
                deleteUser(tokenUser, valueTarget)
                location.reload()
            })
        })
    })
    closeDeleteUserModal()
}

async function closeDeleteUserModal() {
    const buttonCloseDeleteUser = document.querySelector('.close-modal-delete-user')
    const modalDeleteUser = document.querySelector('.modal-delete-user')
    buttonCloseDeleteUser.addEventListener('click', () => {
        backgroundModal.classList.toggle('hide')
        modalDeleteUser.classList.toggle('hide')
    })
}