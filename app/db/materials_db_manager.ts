import { AppDataSource } from './db_manager';
import { IMaterialData } from '../../src/app/core/interfaces/interfaces';
import { Material } from './data/models/items.schema';

async function getAllMaterials(){
    console.log('INFO : Getting all materials')
    const res = await AppDataSource.manager
                    .getRepository(Material).find({
                    }                        
                    )
    return res
}

async function getMaterialByID(materialID: string){
    console.log('INFO : Getting material by ID')
    const res = await AppDataSource.getRepository(Material).find(
        {
            where: {
                materialID: materialID
            }
        }
    )

    return res
}

async function insertMaterial(material: IMaterialData){
    console.log("INFO: Inserting material data")

    const materialEntity = new Material()
    materialEntity.materialName = material.materialName
    materialEntity.description = material.description
    materialEntity.remarks = material.remarks

    return await AppDataSource.getRepository(Material).save(materialEntity)

    
}

async function updateMaterial(material: IMaterialData){
    console.log("INFO: Updating material data")
    const res = await AppDataSource.manager.update(Material, {
        materialID: material.materialID
    }, {
        materialName: material.materialName,
        description: material.description,
        remarks: material.remarks
    })
    return res
}

async function softDeleteMaterial(materialID: string){
    console.log("INFO: Soft deleting material by ID")
    const res = await AppDataSource.manager.update(Material, {
        materialID: materialID
    }, {
        deleteFlag: true
    })
    return res
}

async function hardDeleteMaterial(materialID: string){
    console.log("INFO: Hard deleting material data")
    const res = await AppDataSource.manager.delete(Material, {
        materialID: materialID
    })
    return res
}

export { getAllMaterials, 
        getMaterialByID,
        insertMaterial, 
        updateMaterial, 
        softDeleteMaterial, 
        hardDeleteMaterial }