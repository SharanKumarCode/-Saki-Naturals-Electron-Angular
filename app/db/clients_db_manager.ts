import { AppDataSource } from './db_manager';
import { Client } from "./data/models/items.schema"
import { IClientData } from '../../src/app/core/interfaces/interfaces';

async function getAllClients(){
    console.log('INFO : Getting all clients')
    const res = await AppDataSource.manager
                    .getRepository(Client).find()
    return res
}

async function getClientByID(clientID: string){
    console.log('INFO : Getting client by ID')
    const res = await AppDataSource.getRepository(Client).find(
        {
            where: {
                clientID: clientID
            }
        }
    )

    return res
}

async function insertClient(client: IClientData){
    console.log("INFO: Inserting new client")

    const res = await AppDataSource.manager.insert(Client, {
        clientType: client.clientType,
        clientName: client.clientName,
        contactPerson: client.contactPerson,
        contact1: client.contact1,
        contact2: client.contact2,
        landline: client.landline,
        email: client.email,
        addressLine1: client.addressLine1,
        addressLine2: client.addressLine2,
        city: client.city,
        state: client.state,
        country: client.country,
        pincode: client.pincode,
        description: client.description,
        remarks: client.remarks
    })
    return res
}

async function updateClient(client: IClientData){
    console.log("INFO: Updating client data")

    const res = await AppDataSource.manager.update(Client, {
        clientID: client.clientID
    }, {
        clientType: client.clientType,
        clientName: client.clientName,
        contactPerson: client.contactPerson,
        contact1: client.contact1,
        contact2: client.contact2,
        landline: client.landline,
        email: client.email,
        addressLine1: client.addressLine1,
        addressLine2: client.addressLine2,
        city: client.city,
        state: client.state,
        country: client.country,
        pincode: client.pincode,
        description: client.description,
        remarks: client.remarks
    })
    return res
}

async function softDeleteClient(clientID: string){
    console.log("INFO: Soft deleting client by ID")
    const res = await AppDataSource.manager.update(Client, {
        clientID: clientID
    }, {
        deleteFlag: true
    })
    return res
}

async function hardDeleteClient(clientID: string){
    console.log("INFO: Hard deleting client data")
    const res = await AppDataSource.manager.delete(Client, {
        clientID: clientID
    })
    return res
}

export { 
    getAllClients, 
    getClientByID,
    insertClient, 
    updateClient, 
    softDeleteClient, 
    hardDeleteClient 
    }