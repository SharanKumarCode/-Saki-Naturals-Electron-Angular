const {employeeDB} = require('../db/db_manager')

module.exports = {
    employeeHandler: [
            global.share.ipcMain.handle('get-employee', async () => {
                return employeeDB.getAllEmployee();
            }),

            global.share.ipcMain.handle('get-employee-by-id', async (_, data) => {
              return employeeDB.getEmployeeByID(data);
            }),
        
            global.share.ipcMain.handle('insert-employee', async (_, data) => {
                return employeeDB.insertEmployee(data);
            }),

            global.share.ipcMain.handle('update-employee', async (_, data) => {
                return employeeDB.updateEmployee(data);
            }),
        
            global.share.ipcMain.handle('delete-employee', async (_, data) => {
                return employeeDB.softDeleteEmployee(data);
            }),           
        
            global.share.ipcMain.handle('insert-salary-transaction', async (_, data) => {
                return employeeDB.insertSalaryTransaction(data);
            }),

            global.share.ipcMain.handle('update-salary-transaction', async (_, data) => {
                return employeeDB.updateSalaryTransaction(data);
            }),
        
            global.share.ipcMain.handle('delete-salary-transaction', async (_, data) => {
                return employeeDB.deleteSalaryTransaction(data);
            }),            

            global.share.ipcMain.handle('insert-attendance-entry', async (_, data) => {
                return employeeDB.insertAttendanceEntry(data);
            }),

            global.share.ipcMain.handle('update-attendance-entry', async (_, data) => {
                return employeeDB.updateAttendanceEntry(data);
            }),

            global.share.ipcMain.handle('delete-attendance-entry', async (_, data) => {
                return employeeDB.deleteAttendanceEntry(data);
            })
    ]
    }