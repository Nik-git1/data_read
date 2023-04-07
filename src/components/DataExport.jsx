import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';



const DataExport = ({ data }) => {
  const exportToExcel = () => {
    console.log(data)
    const worksheet = XLSX.utils.json_to_sheet(data, {header: Object.keys(data[0]), skipHeader: true});

    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataFile = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(dataFile, 'data.xlsx');
  };


  return (
    <div>
      <button onClick={exportToExcel}>Export to Excel</button>
    </div>
  );
};

export default DataExport;