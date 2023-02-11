import { Product } from "./data/models/items.schema";
import { AppDataSource } from "./db_manager";

async function getProductStockAndSoldByID(productID: string){
    console.log('INFO : Getting product stock and sold data')

    const res = await AppDataSource.getRepository(Product).find(
        {
            relations: {
                saleEntries: true,
                production: true,
        },
        where: {
            productID: productID
        },
        select: {
            productID: true,
            saleEntries: true,
            production: true
        }
        }
    )

    return res
}

export {
    getProductStockAndSoldByID
}