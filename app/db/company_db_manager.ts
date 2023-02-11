import { ICompanyData } from "../../src/app/core/interfaces/interfaces";
import { Company } from "./data/models/items.schema";
import { AppDataSource } from "./db_manager";


async function getCompany(){
    console.log('INFO : Getting company data')

    const res = await AppDataSource.getRepository(Company).find()

    return res
}

async function getCompanyByID(companyID: string){
    console.log("INFO : Getting company data by ID")
    const res = await AppDataSource.getRepository(Company).find(
        {
            where: {
                companyID: companyID
            }
        }
    )

    return res
}

async function initialiseCompany(companyData: ICompanyData){
    console.log("INFO: Initialising company data")
    console.log(companyData);
    const companyEntity = new Company()
    const ignoreCompanyPropList = ['editCreate', 'deleteFlag', 'createdDate']
    for (let index = 0; index < Object.keys(companyData).length; index++) {
        if (!(ignoreCompanyPropList.includes(Object.keys(companyData)[index]))) {
            companyEntity[Object.keys(companyData)[index]] = companyData[Object.keys(companyData)[index]];
        }
    }
    
    return await AppDataSource.getRepository(Company).save(companyEntity)
}

async function updateCompany(companyData: ICompanyData){
    console.log("INFO: Updating company data")
    
    const companyEntity = new Company()
    const ignoreCompanyPropList = ['editCreate', 'deleteFlag', 'createdDate']
    for (let index = 0; index < Object.keys(companyData).length; index++) {
        if (!(ignoreCompanyPropList.includes(Object.keys(companyData)[index]))) {
            companyEntity[Object.keys(companyData)[index]] = companyData[Object.keys(companyData)[index]];
        }
    }
    
    return await AppDataSource.manager.update(Company,
        {
            companyID: companyData.companyID
        },
        {
            ...companyEntity
    })
}

export {
    getCompany, 
    getCompanyByID,
    initialiseCompany, 
    updateCompany
}