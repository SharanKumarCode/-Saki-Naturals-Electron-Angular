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
exports.getProducts = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const items_schema_1 = require("./data/models/items.schema");
const AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    synchronize: true,
    logging: true,
    logger: 'simple-console',
    database: 'app/db/data/saki_naturals_db.db',
    entities: [items_schema_1.Product],
});
exports.AppDataSource = AppDataSource;
AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
function getProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('getting products..');
        // const res = await AppDataSource.manager.find(Product,{})
        const res = yield AppDataSource.manager
            .createQueryBuilder(items_schema_1.Product, "product")
            .where("product_id = :id", { id: 3 })
            .getOne();
        if (!res) {
            console.log("product result is empty");
            // populateProductsDummyData()
        }
        console.log(res);
        return res;
    });
}
exports.getProducts = getProducts;
function populateProductsDummyData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("populating with dummy data");
        const res = yield AppDataSource.manager.insert(items_schema_1.Product, {
            group: "Soap",
            product_name: "Timber",
            description: "dummy",
            stock: 10,
            price_directSale: 20.0,
            price_reseller: 40.0,
            price_dealer: 30.0,
            created_date: Date.now().toLocaleString(),
            sold: 690
        }).then(data => {
            console.log("inserted dummy data : " + data.generatedMaps.toString());
        }).catch(e => {
            console.log("error while inserting into table : " + e);
        });
    });
}
//# sourceMappingURL=db_manager.js.map