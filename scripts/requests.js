import { toast } from "./toast.js";

export const urlBase = "http://localhost:6278"
export const apiHeaders = {'Content-Type':'application/json'}
export const green = '#08C206';
export const red = '#C20806';
export const white = '#FFFFFF';

// CRIAR USUÁRIO ------------------------------------------------
export async function createUser (userCreated){
    const responseCreateUser = await fetch(`${urlBase}/auth/register`,{
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(userCreated)
    })
    
    if(responseCreateUser.ok){
        toast('Usuário criado com sucesso',green)
        location.replace('/pages/login/login.html')
    } else {
        toast('Erro ao criar usuário, tente novamente', red)
    }

    return responseCreateUser
}

// FAZER LOGIN DO USUÁRIO ---------------------------------------
export async function loginUser (userLogged){
    const responseLoginUser = await fetch(`${urlBase}/auth/login`,{
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(userLogged)
    })
    .then(response => response.json())
    .catch(error => error)

    const verification = await verifyAuthorization(responseLoginUser.token)

    if(verification.is_admin || responseLoginUser.token !== undefined){
        localStorage.setItem('tokenUser',JSON.stringify(responseLoginUser.token))
    } 

    renderDash()
    
    return responseLoginUser
}

// AUTENTICAR O TOKEN DO USUÁRIO --------------------------------------
export async function verifyAuthorization (token) {
    const responseVerifyAuthorization = await fetch(`${urlBase}/auth/validate_user`,{
        method: 'GET',
        headers: {'Content-Type':'application/json', Authorization: `Bearer ${token}`}
    })
    .then(response => response.json())
    .catch(error => error)

    return responseVerifyAuthorization
}

// RETORNAR TOKEN DO USUÁRIO ------------------------------------------
export async function getUser () {
    const tokenUser = JSON.parse(localStorage.getItem('tokenUser'))

    return tokenUser
}

// RENDERIZAR DASHBOARD -----------------------------------
export async function renderDash () {
    const tokenUser = await getUser()
    const verification = await verifyAuthorization (tokenUser)

    if(verification.is_admin){
        toast('Login realizado com sucesso', green)
        location.replace('/pages/dash_admin/dash_admin.html')
    } else if (verification.erro == 'Token Invalid') {
        toast('Erro, tente novamente', red)
    } else {
        toast('Login realizado com sucesso', green)
        location.replace('/pages/dash_user/dash_user.html')
    }
}

// BUSCAR TODAS AS EMPRESAS -------------------------------
export async function getAllCompanies () {
    const responseGetAllCompanies = await fetch(`${urlBase}/companies`,{
        method: 'GET',
        headers: apiHeaders,
    })
    .then(response => response.json())
    .catch(error => error)

    return responseGetAllCompanies
}

// BUSCAR EMPRESA POR SETOR -----------------------------
export async function getCompaniesBySector (sector) {
    const responseGetCompaniesBySector = await fetch(`${urlBase}/companies/${sector}`,{
        method: 'GET',
        headers: apiHeaders,
    })

    .then(response => response.json())
    .catch(error => error)

    return responseGetCompaniesBySector
}

//LISTAR TODOS OS SETORES ----------------------------
export async function getAllSectors () {
    const responseGetAllSectors = await fetch(`${urlBase}/sectors`,{
        method: 'GET',
        headers: apiHeaders,
    })

    .then(response => response.json())
    .catch(error => error)

    return responseGetAllSectors
}

// BUSCAR DADOS DO PERFIL DO USUÁRIO ----------------------------
export async function getUserProfile (token){
    const responseUserProfile = await fetch(`${urlBase}/users/profile`,{
        method: 'GET',
        headers: {'Content-Type':'application/json', Authorization: `Bearer ${token}`},
    })
    .then(response => response.json())
    .catch(error => error)

    return responseUserProfile
}

// LISTAR TODOS OS FUNCIONÁRIOS DO MESMO DEPARTAMENTO --------------
export async function getAllEmployersSameDepartment (token){
    const responseGetAllEmployersSameDepartment = await fetch(`${urlBase}/users/departments/coworkers`,{
        method: 'GET',
        headers: {'Content-Type':'application/json', Authorization: `Bearer ${token}`},
    })
    .then(response => response.json())
    .catch(error => error)

    return responseGetAllEmployersSameDepartment
}

// LISTAR OS DEPARTAMENTOS DA EMPRESA DO FUNCIONÁRIO LOGADO ---------
export async function getAllDepartmentsOfCompany (token){
    const responsegetAllDepartmentsOfCompany = await fetch(`${urlBase}/users/departments`,{
        method: 'GET',
        headers: {'Content-Type':'application/json', Authorization: `Bearer ${token}`},
    })
    .then(response => response.json())
    .catch(error => error)

    return responsegetAllDepartmentsOfCompany
}

// EDITAR INFOMAÇÕES DO USUÁRIO ---------------------------------
export async function editUserProfile (token, userEdited){
    const userProfile = await getUserProfile(token)
    const responseEditUserProfile = await fetch(`${urlBase}/users`,{
        method: 'PATCH',
        headers: {'Content-Type':'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(userEdited)
    })
    .then(response => response.json())
    .catch(error => error)

    if(responseEditUserProfile.error == 'email alread exists'){
        alert('Email já existente, altere o email para editar o usuário')
    } else {
        alert('Usuário alterado com sucesso')
    }

    return responseEditUserProfile
}

// CADASTRAR EMPRESA ---------------------------------------------
export async function createCompany (tokenUser, companyCreated){
    const responseCreateCompany = await fetch(`${urlBase}/companies`,{
        method: 'POST',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`},
        body: JSON.stringify(companyCreated)
    })
    .then(response => response.json())
    .catch(error => error)

    if(responseCreateCompany.error == 'error'){
        alert('Erro ao criar empresa')
    } else {
        alert('Empresa criada com sucesso')
    }

    return responseCreateCompany
}

// BUSCAR DEPARTAMENTOS DE UMA EMPRESA ---------------------------

export async function getDepartments (tokenUser, uuidCompany){
    // const tokenUser = await getUser()
    // const uuidCompany = await findIdCompany ()

    const responseGetDepartments = await fetch(`${urlBase}/departments/${uuidCompany}`, {
        method: 'GET',
        headers: {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`}
    })
    .then(response => response.json())
    .catch(error => error)

    console.log(responseGetDepartments)
    return responseGetDepartments
}

// BUSCAR TODOS OS DEPARTAMENTOS ----------------------------------
export async function getAllDepartments (tokenUser){
    // const tokenUser = await getUser()
    // const uuidCompany = await findIdCompany ()

    const responseGetAllDepartments = await fetch(`${urlBase}/departments`, {
        method: 'GET',
        headers: {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`}
    })
    .then(response => response.json())
    .catch(error => error)

    // console.log(responseGetAllDepartments)
    return responseGetAllDepartments
}

// CRIAR DEPARTAMENTO -----------------------------------------------
export async function createDepartment (tokenUser, departmentCreated){
    const responseCreateDepartment = await fetch(`${urlBase}/departments`,{
        method: 'POST',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`},
        body: JSON.stringify(departmentCreated)
    })
    .then(response => response.json())
    .catch(error => error)

    if(responseCreateDepartment.error == 'error'){
        alert('Erro ao criar departamento')
    } else {
        alert('Departamento criado com sucesso')
    }

    return responseCreateDepartment
}

// CONTRATAR FUNCIONÁRIO ----------------------------------------------
export async function hireEmployer (tokenUser, employerHired){
    const responseHireEmployer = await fetch(`${urlBase}/departments/hire`,{
        method: 'PATCH',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`},
        body: JSON.stringify(employerHired)
    })
    .then(response => response.json())
    .catch(error => error)

    // if(responseHireEmployer.error == 'error'){
    //     alert('Erro ao contratar funcionário')
    // } else {
    //     alert('Funcionário contratado com sucesso')
    // }

    return responseHireEmployer
}

// DEMITIR FUNCIONÁRIO ------------------------------------------------
export async function dismissEmployer (tokenUser, employerDismissed){
    const responseDismissEmployer = await fetch(`${urlBase}/departments/dismiss/${employerDismissed}`,{
        method: 'PATCH',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`}
    })
    .then(response => response.json())
    .catch(error => error)

    // if(responseDismissEmployer.error == 'error'){
    //     alert('Erro ao demitir funcionário')
    // } else {
    //     alert('Funcionário demitido com sucesso')
    // }

    return responseDismissEmployer
}

// EDITAR DEPARTAMENTO ------------------------------------------------
export async function modifyDepartment (tokenUser, departmentModified, description){
    const responseModifyDepartment = await fetch(`${urlBase}/departments/${departmentModified}`,{
        method: 'PATCH',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`},
        body: JSON.stringify(description)
    })
    .then(response => response.json())
    .catch(error => error)

    // if(reponseModifyDepartment.error == 'error'){
    //     alert('Erro ao editar departamento')
    // } else {
    //     alert('Departamento editado com sucesso')
    // }

    return responseModifyDepartment
}

// DELETAR DEPARTAMENTO ------------------------------------------------
export async function deleteDepartment (tokenUser, departmentDeleted){
    const responseDeleteDepartment = await fetch(`${urlBase}/departments/${departmentDeleted}`,{
        method: 'DELETE',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`}
    })
    .then(response => response.json())
    .catch(error => error)

    // if(responseDeleteDepartment.error == 'error'){
    //     alert('Erro ao deletar departamento')
    // } else {
    //     alert('Departamento deletado com sucesso')
    // }

    return responseDeleteDepartment
}

// LISTAR TODOS OS USUÁRIOS ------------------------------------------
export async function getAllUsers (tokenUser){
    const reponseGetAllUsers = await fetch(`${urlBase}/users`,{
        method: 'GET',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`}
    })
    .then(response => response.json())
    .catch(error => error)

    if(reponseGetAllUsers.error == 'error'){
        alert('Erro ao listar todos os usuários')
    } 

    return reponseGetAllUsers
}

// LISTAR USUÁRIOS SEM DEPARTAMENTO ---------------------------------
export async function getUsersWithOutDepartments (tokenUser){
    const reponseGetUsersWithOutDepartments = await fetch(`${urlBase}/admin/out_of_work`,{
        method: 'GET',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`}
    })
    .then(response => response.json())
    .catch(error => error)

    // if(reponseGetUsersWithOutDepartments.error == 'error'){
    //     alert('Erro ao listar usuários sem departamento')
    // } 

    return reponseGetUsersWithOutDepartments
}

// ATUALIZAR INFORMAÇÕES DO FUNCIONÁRIO -----------------------------
export async function modifyUser (tokenUser, userModified, description){
    const reponseModifyUser = await fetch(`${urlBase}/admin/update_user/${userModified}`,{
        method: 'PATCH',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`},
        body: JSON.stringify(description)
    })
    .then(response => response.json())
    .catch(error => error)

    // if(reponseModifyUser.error == 'error'){
    //     alert('Erro ao editar informações do usuário')
    // } else {
    //     alert('Informações do usuário editadas com sucesso')
    // }

    return reponseModifyUser
}

// DELETAR USUÁRIO -------------------------------------------------
export async function deleteUser (tokenUser, userDeleted){
    const responseDeleteUser = await fetch(`${urlBase}/admin/delete_user/${userDeleted}`,{
        method: 'DELETE',
        headers:  {'Content-Type':'application/json', Authorization: `Bearer ${tokenUser}`}
    })
    .then(response => response.json())
    .catch(error => error)

    // if(responseDeleteUser.error == 'error'){
    //     alert('Erro ao deletar usuário')
    // } else {
    //     alert('Usuário deletado com sucesso')
    // }

    return responseDeleteUser
}