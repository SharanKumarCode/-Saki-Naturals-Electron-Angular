import { insertProductGroup, insertProduct, getAllProductGroups} from './products_db_manager';
import { insertMaterial } from './materials_db_manager';
import { insertClient } from './clients_db_manager';
import { insertProduction } from './production_db_manager';
import { insertPurchase, insertPurchaseTransaction, getPurchaseByID } from './purchase_db_manager';
import { insertEmployee } from './employee_db_manager';
import { getSaleByID, insertSale, insertSaleTransaction } from './sales_db_manager';
import { IClientData, IEmployeeData, IMaterialData, IProductData, IProductGroup, IProductionData, IProductionEntry, IPurchaseData, IPurchaseEntry, IPurchaseTransactions, ISalaryTransaction, ISaleEntry, ISaleTransactions, ISalesData, ITransactionEntry, ITransactionTypeData } from '../../src/app/core/interfaces/interfaces';
import { EnumGender, EnumSalaryFrequency, EnumSaleType, EnumTransactionGroup, EnumTransactionType } from '../../src/app/core/interfaces/enums';
import { getEmployeeByID } from './employee_db_manager';
import { insertSalaryTransaction } from './employee_db_manager';
import { getAllTransactionTypes, insertTransactionEntry, insertTransactionType } from './transaction_db_manager';

const jsonData = require('./data/dummy_data.json')

const productList = []
const materialList = []
const clientList = []
const purchaseList = []
const saleList = []
const employeeList = []
const transactionTypeList = []

export function initialiseDB() {

    console.log('initialising DB..')

    const purchaseInitiatePromises = []

    createProductGroups()
    .then(_=>{
        getAllProductGroups().then(productGroupData=>{
            purchaseInitiatePromises.push(createProducts(productGroupData))
            purchaseInitiatePromises.push(createMaterials())
            purchaseInitiatePromises.push(createClients())

            Promise.all(purchaseInitiatePromises).then(data=>{
                console.log('Materials and Clients Created')
                data.forEach(d=>{
                    d.forEach(e=>{
                        if (Object.keys(e).includes('materialName')){
                            materialList.push(e) 
                        } else if (Object.keys(e).includes('clientName')) {
                            clientList.push(e)
                        } else {
                            productList.push(e)
                        }
                    })
                })
                createPurchase()
                .then(data=>{
                    console.log("Created all Purchases")
                    data.forEach(d=>{
                        purchaseList.push(d);
                    })
                    createPurchaseTransactions()
                    .then(_=>{
                        console.log("Created Purchase transactions")
                    })
                    createProduction()
                    .then(data=>{
                        console.log('Created Production Data')
                    })
                });
                createSales()
                .then(data=>{
                    console.log("Created Sale Data")
                    data.forEach(d=>{
                        saleList.push(d)
                    })
                    createSaleTransactions()
                    .then(data=>{
                        console.log('Sale Transactions Created')
                    })
                })
            })
        })
    })

    createEmployees()
    .then(data=>{
        console.log('employee data created')
        data.forEach(d=>{
            employeeList.push(d)
        })
        createSalaryTransaction()
        .then(data=>{
            console.log('Salary Data created')
        })
    })

    createTransactionTypes()
    .then(_=>{
        createOtherTransactionEntry()
        .then(_=>{
            console.log('Created Transaction Entries Data')
        })
    })

    
}

function createProductGroups() {
    const promises = []
    jsonData.productGroupData.forEach(data=>{
        const productGroupData: IProductGroup = {
            productGroupName: data.productGroupName
        }
        promises.push(insertProductGroup(productGroupData))
    })

    return Promise.all(promises)
}

function createProducts(productGroupData) {
    console.log('Creating Products');
    const promises = []

    jsonData.productData.forEach(data=>{
        const productData: IProductData = {
            productGroup: {
                productGroupID: productGroupData.filter(d=> d.productGroupName === data.productGroupName).map(d=> d.productGroupID)[0],
                productGroupName: data.productGroupName
            },
            productName: data.productName,
            description: data.description,
            priceDirectSale: data.priceDirectSale,
            priceReseller: data.priceReseller,
            priceDealer: data.priceDealer,
            remarks: data.remarks,
        }

        promises.push(insertProduct(productData))
    })

    return Promise.all(promises);

}

function createMaterials() {
    console.log('Creating Materials');
    const promises = []

    jsonData.materialData.forEach(data=>{
        const materialData: IMaterialData = {
            materialName: data.materialName,
            description: data.description,
            remarks: data.remarks,
        }

        promises.push(insertMaterial(materialData))
    })

    return Promise.all(promises);
}

function createClients() {
    console.log('Creating Clients');
    const promises = []

    jsonData.clientData.forEach(data=>{
        const clienData: IClientData = {
            clientType: data.clientType,
            clientName: data.clientName,
            contactPerson: data.contactPerson,
            contact1: data.contact1,
            contact2: data.contact2,
            landline: data.landline,
            email: data.email,
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            description: data.description,
            remarks: data.remarks
        }

        promises.push(insertClient(clienData))
    })

    return Promise.all(promises);
}

function createEmployees() {
    console.log('Creating Employees');
    const promises = []

    jsonData.employeeData.forEach(data=>{
        const tmpEmployeeData: IEmployeeData = {
            employeeName: data.employeeName,
            role: data.role,
            dob: data.dob,
            aadhar: data.aadhar,
            gender: data.gender,
            salary: data.salary,
            salaryFrequency: data.salaryFrequency,
            contact1: data.contact1,
            contact2: data.contact2,
            address: data.address,
            email: data.email,
            joiningDate: data.joiningDate,
            remarks: data.remarks
        }

        promises.push(insertEmployee(tmpEmployeeData))
    })

    return Promise.all(promises);
}

function createPurchase() {
    
    const purchaseClientList = clientList.filter(d=>d.clientType === 'SUPPLIER')
    let purchaseMaterialList = []
    materialList.forEach(d=>{
        purchaseMaterialList.push(d)
    })

    const promises = []

    const numOfPurchases = 10
    for (let i = 0; i < numOfPurchases; i++) {
        const randomGenDates = randomDates(4, new Date(2022, 11, 1), new Date())
        const purchaseDate = randomGenDates[0]
        const dispatchDate = randomNumber(0, 50) > 5 ? randomGenDates[1]: null
        const deliveredDate = randomNumber(0, 50) > 5 && dispatchDate ? randomGenDates[2] : null
        const completedDate = randomNumber(0, 50) > 5 && deliveredDate ? randomGenDates[3] : null

        const purchaseData: IPurchaseData = {
            supplier: purchaseClientList[randomNumber(purchaseClientList.length - 1, 0)],
            purchaseDate: purchaseDate,
            gstPercentage: randomNumber(12, 0),
            overallDiscountPercentage: randomNumber(12, 0),
            transportCharges: randomNumber(1500, 350),
            miscCharges: randomNumber(2000, 500),
            paymentTerms: randomNumber(90, 30),
            remarks: `Test Purchase data - ${i}`,

            dispatchDate: dispatchDate,
            deliveredDate: deliveredDate,
            completedDate: completedDate
        }
        
        const numOfPurchaseEntries = randomNumber(purchaseMaterialList.length, 1)
        const purchaseEntriesList = []

        for (let j = 0; j < numOfPurchaseEntries; j++) {
            const material = purchaseMaterialList[randomNumber(purchaseMaterialList.length - 1, 0)]
            purchaseMaterialList = purchaseMaterialList.filter(d=>d.materialID !== material.materialID)
            const purchaseEntryData: IPurchaseEntry = {
                material: material,
                price: randomNumber(100, 30),
                quantity: randomNumber(100, 30),
                discountPercentage: randomNumber(12, 0),
            }
            purchaseEntriesList.push(purchaseEntryData)
        }

        purchaseMaterialList = []
        materialList.forEach(d=>{
            purchaseMaterialList.push(d)
        })

        purchaseData.purchaseEntries = purchaseEntriesList
        promises.push(insertPurchase(purchaseData))
    }

    return Promise.all(promises)
}

function createPurchaseTransactions() {
    const promises = []
    purchaseList.forEach(data=>{
        getPurchaseByID(data.purchaseID)
        .then(purchaseData => {
            const purchaseDataEntity: IPurchaseData = {
                purchaseID: purchaseData[0].purchaseID,
                purchaseDate: purchaseData[0].purchaseDate,
                gstPercentage: purchaseData[0].gstPercentage,
                overallDiscountPercentage: purchaseData[0].overallDiscountPercentage,
                transportCharges: purchaseData[0].transportCharges,
                miscCharges: purchaseData[0].miscCharges,
                paymentTerms: purchaseData[0].paymentTerms,
                remarks: purchaseData[0].remarks,

                dispatchDate: purchaseData[0].dispatchDate,
                deliveredDate: purchaseData[0].deliveredDate,
                completedDate: purchaseData[0].completedDate
            }

            let numOfTransactions = randomNumber(10, 2);
            const totalAmount = getNetPrice(purchaseData[0]);
            const randomTransactionAmounts = randomNumbersWithFixedSum(numOfTransactions, totalAmount)
            const randomTransactionDates = randomDates(numOfTransactions, purchaseData[0].purchaseDate, new Date())

            if (!purchaseData[0].completedDate) {
                numOfTransactions = numOfTransactions - 1
            }

            for (let i = 0; i < numOfTransactions; i++) {
                const purchaseTransactionData: IPurchaseTransactions = {
                    purchase: purchaseDataEntity,
                    transactionType: (numOfTransactions === 3 && i === 0 || numOfTransactions >=4 && i < 2)
                                     ? EnumTransactionType.advance : EnumTransactionType.paid,
                    transactionAmount: randomTransactionAmounts[i],
                    transactionDate: randomTransactionDates[i],
                    remarks: `Transaction Test ${i}`
                }

                promises.push(insertPurchaseTransaction(purchaseTransactionData))
            }

        })
    })

    return Promise.all(promises)
}

function createProduction() {
    console.log('Creating Production Data')
    let productionMaterialList = []
    materialList.forEach(d=>{
        productionMaterialList.push(d)
    })

    const promises = []

    const numOfProductions = 10
    for (let i = 0; i < numOfProductions; i++) {
        const randomGenDates = randomDates(2, new Date(2022, 11, 1), new Date())
        const productionDate = randomGenDates[0]
        const completedDate = randomNumber(0, 50) > 5 ? randomGenDates[1] : null
        const productionData: IProductionData = {
            product: productList[randomNumber(productList.length - 1, 0)],
            productionDate: productionDate,
            productQuantity: randomNumber(100, 0),
            remarks: `Test Production data - ${i}`,

            completedDate: completedDate
        }
        
        const numOfProductionEntries = randomNumber(productionMaterialList.length, 1)
        const productionEntriesList = []

        for (let j = 0; j < numOfProductionEntries; j++) {
            const material = productionMaterialList[randomNumber(productionMaterialList.length - 1, 0)]
            productionMaterialList = productionMaterialList.filter(d=>d.materialID !== material.materialID)
            const productionEntryData: IProductionEntry = {
                material: material,
                materialQuantity: randomNumber(100, 5),
            }
            productionEntriesList.push(productionEntryData)
        }

        productionMaterialList = []
        materialList.forEach(d=>{
            productionMaterialList.push(d)
        })

        productionData.productionEntries = productionEntriesList

        promises.push(insertProduction(productionData))
    }

    return Promise.all(promises)

}

function createSales() {
    console.log('Creating Sale Data')

    const saleClientList = clientList.filter(d=>d.clientType === 'CUSTOMER')
    let saleProductList = []
    productList.forEach(d=>{
        saleProductList.push(d)
    })

    const promises = []

    const numOfSales = 10
    for (let i = 0; i < numOfSales; i++) {
        const randomGenDates = randomDates(4, new Date(2022, 11, 1), new Date())
        const salesDate = randomGenDates[0]
        const dispatchDate = randomNumber(0, 50) > 5 ? randomGenDates[1]: null
        const deliveredDate = randomNumber(0, 50) > 5 && dispatchDate ? randomGenDates[2] : null
        const completedDate = randomNumber(0, 50) > 5 && deliveredDate ? randomGenDates[3] : null
        const typeRandomNumber = randomNumber(0, 3)

        const salesData: ISalesData = {
            customer: saleClientList[randomNumber(saleClientList.length - 1, 0)],
            salesDate: salesDate,
            gstPercentage: randomNumber(12, 0),
            overallDiscountPercentage: randomNumber(12, 0),
            transportCharges: randomNumber(1500, 350),
            miscCharges: randomNumber(2000, 500),
            paymentTerms: randomNumber(90, 30),
            remarks: `Test Sales data - ${i}`,

            dispatchDate: dispatchDate,
            deliveredDate: deliveredDate,
            completedDate: completedDate,
            saleType: [EnumSaleType.dealer, EnumSaleType.directSale, EnumSaleType.reseller][typeRandomNumber]
        }
        
        const numOfSaleEntries = randomNumber(saleProductList.length, 1)
        const saleEntriesList = []

        for (let j = 0; j < numOfSaleEntries; j++) {
            const product = saleProductList[randomNumber(saleProductList.length - 1, 0)]
            saleProductList = saleProductList.filter(d=>d.productID !== product.productID)
            const saleEntryData: ISaleEntry = {
                product: product,
                price: [product.priceDealer, product.priceDirectSale, product.priceReseller][typeRandomNumber],
                quantity: randomNumber(100, 30),
                discountPercentage: randomNumber(12, 0),
            }
            saleEntriesList.push(saleEntryData)
        }

        saleProductList = []
        productList.forEach(d=>{
            saleProductList.push(d)
        })

        salesData.saleEntries = saleEntriesList
        promises.push(insertSale(salesData))
    }

    return Promise.all(promises)
}

function createSaleTransactions() {
    console.log('Creating Sale Transaction Data')

    const promises = []
    saleList.forEach(data=>{
        getSaleByID(data.salesID)
        .then(saleData => {
            const saleDataEntity: ISalesData = {
                salesID: saleData[0].salesID,
                salesDate: saleData[0].salesDate,
                gstPercentage: saleData[0].gstPercentage,
                overallDiscountPercentage: saleData[0].overallDiscountPercentage,
                transportCharges: saleData[0].transportCharges,
                miscCharges: saleData[0].miscCharges,
                paymentTerms: saleData[0].paymentTerms,
                remarks: saleData[0].remarks,

                dispatchDate: saleData[0].dispatchDate,
                deliveredDate: saleData[0].deliveredDate,
                completedDate: saleData[0].completedDate,
                saleType: [EnumSaleType.dealer, EnumSaleType.directSale, EnumSaleType.reseller].filter(d=>d == saleData[0].saleType)[0]
            }

            let numOfTransactions = randomNumber(10, 2);
            const totalAmount = getNetPrice(saleData[0]);
            const reductionAmount = saleData[0].completedDate ? 0 : randomNumber(totalAmount * 0.3, 100)
            const randomTransactionAmounts = randomNumbersWithFixedSum(numOfTransactions, totalAmount - reductionAmount)
            const randomTransactionDates = randomDates(numOfTransactions, saleData[0].salesDate, new Date())

            for (let i = 0; i < numOfTransactions; i++) {
                const saleTransactionData: ISaleTransactions = {
                    sales: saleDataEntity,
                    transactionType: (numOfTransactions === 3 && i === 0 || numOfTransactions >=4 && i < 2)
                                     ? EnumTransactionType.advance : EnumTransactionType.paid,
                    transactionAmount: randomTransactionAmounts[i],
                    transactionDate: randomTransactionDates[i],
                    remarks: `Sale Transaction Test ${i}`
                }

                promises.push(insertSaleTransaction(saleTransactionData))
            }

        })
    })

    return Promise.all(promises)
}

function createSalaryTransaction() {
    console.log('Creating Salary Transaction Data')

    const promises = []
    employeeList.forEach(data=>{
        getEmployeeByID(data.employeeID)
        .then(employeeData => {
            const employeeDataEntity: IEmployeeData = {
                employeeID: employeeData[0].employeeID,
                employeeName: employeeData[0].employeeName,
                role: employeeData[0].role,
                dob:  new Date(employeeData[0].dob),
                aadhar: employeeData[0].aadhar,
                gender: [EnumGender.female, EnumGender.male, EnumGender.others].filter(d=>d == employeeData[0].gender)[0],
                salary: employeeData[0].salary,
                salaryFrequency: [EnumSalaryFrequency.monthly, EnumSalaryFrequency.weekly, EnumSalaryFrequency.others].filter(d=>d == employeeData[0].salaryFrequency)[0],

                contact1: employeeData[0].contact1,
                contact2: employeeData[0].contact2,
                address: employeeData[0].address,
                email: employeeData[0].email,
                joiningDate: new Date(employeeData[0].joiningDate),
                exitDate: employeeData[0].exitDate ? new Date(employeeData[0].exitDate) : null,
                remarks: employeeData[0].remarks,
            }

            let numOfTransactions = (new Date()).getMonth() - (new Date(employeeData[0].joiningDate)).getMonth() 
                                    + (12 * ((new Date()).getFullYear() - (new Date(employeeData[0].joiningDate)).getFullYear()));
            const firstSalaryDate = employeeDataEntity.joiningDate.getMonth() === 11 ? 
                                    new Date(employeeDataEntity.joiningDate.getFullYear() + 1, 1, randomNumber(6, 1)) :
                                    new Date(employeeDataEntity.joiningDate.getFullYear(), employeeDataEntity.joiningDate.getMonth() + 1, randomNumber(6, 1))
            const salaryDates = [firstSalaryDate]
            while (salaryDates.length < numOfTransactions) {
                const lastDate = salaryDates[salaryDates.length - 1]
                const salDate = lastDate.getMonth() === 11 ? 
                                new Date(lastDate.getFullYear() + 1, 0, randomNumber(6, 1)) :
                                new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, randomNumber(6, 1))
                salaryDates.push(salDate)
            }


            for (let i = 0; i < numOfTransactions; i++) {
                const salaryTransactionData: ISalaryTransaction = {
                    employee: employeeDataEntity,
                    transactionType: EnumTransactionType.salary,
                    amount: employeeDataEntity.salary,
                    transactionDate: salaryDates[i],
                    remarks: `Salary Transaction Test ${i}`
                }

                promises.push(insertSalaryTransaction(salaryTransactionData))
            }

        })
    })

    return Promise.all(promises)
}

function createTransactionTypes() {
    console.log('Creating Transaction Type Data')

    const promises = []

    jsonData.transactionTypeData.forEach(data=>{
        const transactionTypeData: ITransactionTypeData = {
            transactionGroup: data.transactionGroup,
            transactionName: data.transactionName
        }
        promises.push(insertTransactionType(transactionTypeData))
    })

    return Promise.all(promises)
}

function createOtherTransactionEntry() {
    console.log('Creating Transaction Entry Data')

    const promises = []

    getAllTransactionTypes()
    .then(transactionTypeDataList => {
        transactionTypeDataList.forEach(transactionTypeData=>{
            const randomDates = []
            const monthlyOnceTypes = ['Rent', 'Electricity', 'EMI', 'Internet', 'Telephone']
            const monthlyMultipleTypes = ['Food', 'Transport', 'Others']
            const monthlyOccasionalTypes = ['Maintenance', 'Repair']

            const transactionType: ITransactionTypeData = {
                transactionTypeID: transactionTypeData.transactionTypeID,
                transactionGroup: [EnumTransactionGroup.expense, EnumTransactionGroup.income].filter(d=>d === transactionTypeData.transactionGroup)[0],
                transactionName: transactionTypeData.transactionName
            }

            for (let i = 7; i <= 11; i++) {
                randomDates.push(new Date(2022, i, randomNumber(1, 27)))
            }
            randomDates.push(new Date(2023, 0, randomNumber(1, 27)))
            randomDates.push(new Date(2023, 1, randomNumber(1, 27)))

            if (transactionType.transactionGroup === EnumTransactionGroup.expense) {
                if (monthlyOnceTypes.includes(transactionType.transactionName)) {

                    randomDates.forEach(i=>{
                        const transactionEntry: ITransactionEntry = {
                            transactionType: transactionType,
                            transactionDate: i,
                            transactionAmount: randomNumber(3500, 500),
                            remarks: `Transaction Entry monthlyOnceTypes`
                        }

                        promises.push(insertTransactionEntry(transactionEntry))
                    })
                } else if (monthlyMultipleTypes.includes(transactionType.transactionName)) {
                    const monthlyMultipleTypesRandDates = []
                    randomDates.forEach(d=>{
                        for (let j = 0; j < randomNumber(3, 6); j++) {
                            monthlyMultipleTypesRandDates.push(new Date(d.getFullYear(), d.getMonth(), randomNumber(1, 27)))
                        }
                    })
                    monthlyMultipleTypesRandDates.forEach(i=>{
                        const transactionEntry: ITransactionEntry = {
                            transactionType: transactionType,
                            transactionDate: i,
                            transactionAmount: randomNumber(1000, 100),
                            remarks: `Transaction Entry monthlyMultipleTypesRandDates`
                        }

                        promises.push(insertTransactionEntry(transactionEntry))
                    })
                } else {
                    const monthlyOccasionalTypesDates = []
                    for (let i = 0; i < 3; i++) {
                        const randomIndex = randomNumber(randomDates.length - 1, 0)
                        const randDate = new Date(randomDates[randomIndex].getFullYear(), randomDates[randomIndex].getMonth(), randomNumber(1, 27))
                        monthlyOccasionalTypesDates.push(randDate)
                        randomDates.splice(randomIndex, 1)
                    }

                    monthlyOccasionalTypesDates.forEach(i=>{
                        const transactionEntry: ITransactionEntry = {
                            transactionType: transactionType,
                            transactionDate: i,
                            transactionAmount: randomNumber(3500, 500),
                            remarks: `Transaction Entry monthlyOccasionalTypesDates`
                        }

                        promises.push(insertTransactionEntry(transactionEntry))
                    })
                }
            } else {
                if (transactionType.transactionName === 'Capital') {

                    const transactionEntry: ITransactionEntry = {
                        transactionType: transactionType,
                        transactionDate: new Date(2022, randomNumber(11, 7), randomNumber(1, 15)),
                        transactionAmount: randomNumber(500000, 100000),
                        remarks: `Transaction Entry Capital`
                    }

                    promises.push(insertTransactionEntry(transactionEntry))

                } else if (transactionType.transactionName === 'Loan') {
                    const monthlyOccasionalTypesDates = []
                    for (let i = 0; i < 3; i++) {
                        const randomIndex = randomNumber(randomDates.length - 1, 0)
                        const randDate = new Date(randomDates[randomIndex].getFullYear(), randomDates[randomIndex].getMonth(), randomNumber(1, 27))
                        monthlyOccasionalTypesDates.push(randDate)
                        randomDates.splice(randomIndex, 1)
                    }

                    monthlyOccasionalTypesDates.forEach(i=>{
                        const transactionEntry: ITransactionEntry = {
                            transactionType: transactionType,
                            transactionDate: i,
                            transactionAmount: randomNumber(100000, 50000),
                            remarks: `Transaction Entry Loan`
                        }

                        promises.push(insertTransactionEntry(transactionEntry))
                    })
                } else {
                    const monthlyOccasionalTypesDates = []
                    for (let i = 0; i < 3; i++) {
                        const randomIndex = randomNumber(randomDates.length - 1, 0)
                        const randDate = new Date(randomDates[randomIndex].getFullYear(), randomDates[randomIndex].getMonth(), randomNumber(1, 27))
                        monthlyOccasionalTypesDates.push(randDate)
                        randomDates.splice(randomIndex, 1)
                    }

                    monthlyOccasionalTypesDates.forEach(i=>{
                        const transactionEntry: ITransactionEntry = {
                            transactionType: transactionType,
                            transactionDate: i,
                            transactionAmount: randomNumber(6000, 1000),
                            remarks: `Transaction Entry Others Income`
                        }

                        promises.push(insertTransactionEntry(transactionEntry))
                    })
                }
            }
            return Promise.all(promises)
        })
    })

    jsonData.transactionTypeData.forEach(data=>{
        const transactionTypeData: ITransactionTypeData = {
            transactionGroup: data.transactionGroup,
            transactionName: data.transactionName
        }
        promises.push(insertTransactionType(transactionTypeData))
    })

    return Promise.all(promises)
}

function randomNumber(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomNumberFloat(max, min) {
    return parseFloat((Math.random() * (max - min + 1) + min).toFixed(2))
}

function randomDates(numOfDates, startDate: Date, EndDate: Date) {
    const datesOutput = []
    while (datesOutput.length < numOfDates) {
        const date = new Date(randomNumber(EndDate.getFullYear(), startDate.getFullYear()),
        randomNumber(EndDate.getMonth(), startDate.getMonth()),
        randomNumber(EndDate.getDate(), startDate.getDate()),
        )

        if (!datesOutput.includes(date)) {
            datesOutput.push(date)
        }
    }

    return datesOutput.sort((a,b)=>b.getTime() - a.getTime()).reverse()
}

function randomNumbersWithFixedSum(quantity, sum) {
    if (quantity === 1) {
        return [parseFloat(sum.toFixed(2))]
    }

    const randNum = randomNumberFloat(sum, 0)
    return [
        randNum,
        ...randomNumbersWithFixedSum(quantity - 1, sum - randNum),
    ]
}

function getNetPrice(salePurchaseData: any): number {
    const entries = salePurchaseData.purchaseEntries ? salePurchaseData.purchaseEntries : salePurchaseData.saleEntries 
    let totPrice = entries
                    .map(d=>(d.price * d.quantity) - (d.price * d.quantity * d.discountPercentage / 100))
                    .reduce((partialSum, a) => partialSum + a, 0);

    totPrice -= salePurchaseData.overallDiscountPercentage * totPrice / 100;
    totPrice += salePurchaseData.gstPercentage * totPrice / 100;
    totPrice += salePurchaseData.transportCharges + salePurchaseData.miscCharges;

    return parseFloat(totPrice.toFixed(2));
   }