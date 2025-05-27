import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import IUser from '../interfaces/User.interface';

export const exportUsersToExcel = (users: IUser[]) => {
    const data = users.map(user => ({
        FirstName: user.first_name,
        LastName: user.last_name,
        Email: user.email,
        Phone: user.phone,
        Address: user.address,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    // Custom column widths
    worksheet['!cols'] = [
        { wch: 15 },  // First Name
        { wch: 15 },  // Last Name
        { wch: 25 },  // Email
        { wch: 15 },  // Phone
        { wch: 25 },  // Address
    ];

    const range = XLSX.utils.decode_range(worksheet['!ref'] || '');

    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
        if (cell) {
            cell.s = {
                font: { bold: true },
                alignment: { horizontal: 'center' }
            };
        }
    }

    const addBorder = (cell: XLSX.CellObject) => {
        cell.s = {
            ...cell.s,
            border: {
                top: { style: 'thin', color: { rgb: '999999' } },
                bottom: { style: 'thin', color: { rgb: '999999' } },
                left: { style: 'thin', color: { rgb: '999999' } },
                right: { style: 'thin', color: { rgb: '999999' } },
            }
        };
    };


    Object.keys(worksheet).forEach((key) => {
        if (!key.startsWith('!')) {
            addBorder(worksheet[key]);
        }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
    });

    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // saveAs(fileData, 'Bnei_Aliyha_Members.xlsx');

    const today = new Date().toISOString().slice(0, 10);
    saveAs(fileData, `Bnei_Aliyha_Members_${today}.xlsx`);
};
