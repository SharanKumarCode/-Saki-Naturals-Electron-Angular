"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardDeleteClient = exports.softDeleteClient = exports.updateClient = exports.insertClient = exports.getClientByID = exports.getAllClients = void 0;
const db_manager_1 = require("./db_manager");
const items_schema_1 = require("./data/models/items.schema");
function getAllClients() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting all clients');
        const res = yield db_manager_1.AppDataSource.manager
            .getRepository(items_schema_1.Client).find();
        return res;
    });
}
exports.getAllClients = getAllClients;
function getClientByID(clientID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('INFO : Getting client by ID');
        const res = yield db_manager_1.AppDataSource.getRepository(items_schema_1.Client).find({
            where: {
                clientID: clientID
            }
        });
        return res;
    });
}
exports.getClientByID = getClientByID;
function insertClient(client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Inserting new client");
        const res = yield db_manager_1.AppDataSource.manager.insert(items_schema_1.Client, {
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
        });
        return res;
    });
}
exports.insertClient = insertClient;
function updateClient(client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Updating client data");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Client, {
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
        });
        return res;
    });
}
exports.updateClient = updateClient;
function softDeleteClient(clientID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Soft deleting client by ID");
        const res = yield db_manager_1.AppDataSource.manager.update(items_schema_1.Client, {
            clientID: clientID
        }, {
            deleteFlag: true
        });
        return res;
    });
}
exports.softDeleteClient = softDeleteClient;
function hardDeleteClient(clientID) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INFO: Hard deleting client data");
        const res = yield db_manager_1.AppDataSource.manager.delete(items_schema_1.Client, {
            clientID: clientID
        });
        return res;
    });
}
exports.hardDeleteClient = hardDeleteClient;
//# sourceMappingURL=clients_db_manager.js.map