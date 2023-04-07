
import React, { useState, useRef, useEffect } from "react";
import { read, utils } from "xlsx";
import Visualization from "./Visualization";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";


const DataLoad = () => {
  let plate_id_type_mapping = {};

  let plate_id_value_mapping = {};

  let auc_value = {};

  let top_auc_value = {};

  let bot_auc_value = {};

  let mod_od_list = {};

  let final_top_array = [];

  let top_auc = [];

  let bot_auc = {};

  let export_list = [];

  const [OD, setOD] = useState([]);
  const [T0, setT0] = useState([]);
  const [plate, setPlate] = useState([]);

  const ODref = useRef(null);
  const T0ref = useRef(null);
  const Plateref = useRef(null);

  const resetOD = () => {
    ODref.current.value = null;
    setOD([]);
  };
  const resetT0 = () => {
    T0ref.current.value = null;
    setT0([]);
  };
  const resetPlate = () => {
    Plateref.current.value = null;
    setPlate([]);
  };

  const plateUpload = ($event) => {
    const files = $event.target.files;

    if (files.length) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          // console.log(wb.Sheets[sheets[0]])
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], {
            header: 1,
            defval: "",
          });
          //    console.log(rows)
          setPlate(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const ODUpload = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], {
            header: 1,
            defval: "",
          });
          setOD(rows);
          console.log(rows);
        }
      };
      reader.readAsArrayBuffer(file);
      console.log(OD);
    }
  };

  const T0Upload = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], {
            header: 1,
            defval: "",
          });
          setT0(rows);
          console.log(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    calc();
  }, [OD, T0, plate]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(export_list, {
      header: Object.keys(export_list[0]),
      skipHeader: true,
    });

    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataFile = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(dataFile, "data.xlsx");
  };

  const calc = () => {
    if (OD.length > 0 && T0.length > 0) {
      // insert your existing code here

      // To calculate plate_id to plate_type mapping (unnecessary at this point)
      console.log(OD);
      console.log(T0);
      let alpha_list = plate;
      for (let i = 1; i < alpha_list.length; i++) {
        let alpha = alpha_list[i]; // get individual row
        if (alpha[1] !== "") {
          // checking if 1st cell of row is filled
          for (let j = 1; j < alpha.length; j++) {
            if (alpha[j] !== "") {
              let plate_code = alpha[0] + j;
              let plate_type = alpha[j];
              plate_id_type_mapping[plate_code] = plate_type;
            }
          }
        } else {
          break;
        }
      }

      // to store T0 values for each plate_id (will be used to normalize calculations later)
      let value_list = T0;
      for (let i = 1; i < value_list.length; i++) {
        let alpha = value_list[i]; // get individual row
        if (alpha[1] !== "") {
          // checking if 1st cell of row is filled
          for (let j = 1; j < alpha.length; j++) {
            if (alpha[j] !== "") {
              let plate_code = alpha[0] + j;
              let plate_type = alpha[j];
              plate_id_value_mapping[plate_code] = plate_type;
            }
          }
        } else {
          break;
        }
      }

      // removes unnecessary columes(time and temp ig)
      let odList = OD.map(function (val) {
        return val.splice(2);
      });

      let id_row = odList[0]; // id list (very imp)
      var row_length; //used for debug

      // For normalizing data OD-T0
      for (let i = 1; i < odList.length; i++) {
        let row = odList[i];
        row_length = row.length;
        for (let j = 0; j < row_length; j++) {
          //add error boundary
          let value = String(id_row[j]);
          row[j] = row[j] - plate_id_value_mapping[value];
          row[j] = row[j].toFixed(3);
        }
      }
      export_list = odList;
      console.log(export_list);

      // setGlobalList(odList)
      // this is odList i wish to transfer
      //Adding the time column again(normalized one)
      let inc = -15;
      odList.map(function (val) {
        inc = inc + 15;
        return inc == 0 ? val.push("Time") : val.push(inc);
      });
      // making 0 array to add to 1st row of OD (so that graph starts from origin)
      row_length++;
      let zeroArray;
      let auc;
      if (row_length > 0) {
        zeroArray = Array(row_length).fill("0.0");
        auc = Array(row_length - 1).fill("0.0");

        odList.splice(1, 0, zeroArray);
      }

      // initializing auc values as 0
      for (let i = 0; i < row_length - 1; i++) {
        auc_value[id_row[i]] = 0.0;
      }
      // Calculating auc values
      for (let i = 2; i < odList.length; i++) {
        let cur_row = odList[i];
        let prev_row = odList[i - 1];
        for (let j = 0; j < row_length - 1; j++) {
          let value = parseFloat(cur_row[j]) + parseFloat(prev_row[j]);

          auc_value[id_row[j]] = parseFloat(auc_value[id_row[j]]) + value * 7.5; //7.5 is used as 15/2 ;
          mod_od_list[id_row[j]] = [];
        }
      }

      // Auc values precision set to 3
      for (let i = 0; i < row_length - 1; i++) {
        auc_value[id_row[i]] = auc_value[id_row[i]].toFixed(3);
      }

      // converting od+list to rowwise data for graph conversion
      for (let i = 1; i < odList.length; i++) {
        let cur_row = odList[i];
        for (let j = 0; j < row_length - 1; j++) {
          mod_od_list[id_row[j]].push(cur_row[j]);
        }
      }
      //  console.log(odList)

      let top_value_array = [];
      let bot_value_array = [];

      // storing  all auc values in array(to be sorted)
      for (var value in auc_value) {
        top_value_array.push([value, parseFloat(auc_value[value])]);
        bot_value_array.push([value, parseFloat(auc_value[value])]);
      }

      // sort auc values and store only top/bottom 10
      top_value_array.sort(function (a, b) {
        return -(a[1] - b[1]);
      });
      top_auc = top_value_array.splice(0, 10);

      bot_value_array.sort(function (a, b) {
        return a[1] - b[1];
      });
      bot_auc = bot_value_array.splice(0, 10);

      // store od values corresponding to top/bottom 10 aucs
      top_auc.forEach(function (item) {
        top_auc_value[item[0]] = mod_od_list[item[0]];
        let tuple = {
          id: item[0],
          data: mod_od_list[item[0]],
        };
        final_top_array.push(tuple);
      });

      bot_auc.forEach(function (item) {
        bot_auc_value[item[0]] = mod_od_list[item[0]];
      });

      console.log(final_top_array);

      //Making line graphs
    }
  };

  return (
    <>

      <div className=" flex m-2 p-2">

        <div className="flex items-center m-4 justify-around ">
          <label htmlFor="plateInput" className="mr-4">
            Choose Plate
          </label>
          <div className="relative">
            <input
              type="file"
              id="plateInput"
              className="opacity-0 absolute inset-0 z-50"
              ref={Plateref}
              required
              onChange={plateUpload}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <label
              htmlFor="plateInput"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Upload
            </label>
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded align-middle"
            onClick={resetPlate}
          >
            Reset Plate
          </button>
        </div>

        <div className="flex items-center m-4 justify-around">
          <label htmlFor="T0input" className="mr-4">
            Choose T0
          </label>
          <div className="relative">
            <input
              type="file"
              id="T0input"
              className="opacity-0 absolute inset-0 z-50"
              ref={T0ref}
              required
              onChange={T0Upload}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <label
              htmlFor="T0input"
              className="bg-red-500 hover:bg-red-700 ml-4 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Upload
            </label>
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded align-middle"
            onClick={resetT0}
          >
            Reset Plate
          </button>
        </div>

        <div className="flex items-center m-4 justify-around ">
          <label htmlFor="ODinput" className="mr-4">
            Choose OD
          </label>
          <div className="relative">
            <input
              type="file"
              id="ODinput"
              className="opacity-0 absolute inset-0 z-50"
              ref={ODref}
              required
              onChange={ODUpload}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <label
              htmlFor="ODinput"
              className="bg-red-500 hover:bg-red-700 ml-3 text-white font-bold py-2 px-4 rounded cursor-pointer"
            >
              Upload
            </label>
          </div>
          <button
            className="bg-red-500 hover:bg-red-700  text-white font-bold py-2 px-4 ml-4 rounded align-middle"
            onClick={resetOD}
          >
            Reset Plate
          </button>
        </div>
      </div>

       <div className="flex justify-end">
        <button
          onClick={exportToExcel}
          className="bg-blue-500 hover:bg-vlue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to Excel
        </button>
      </div>

      <div>{ OD.length && T0.length && <Visualization newData={final_top_array} />} </div>

      
    </>
  );
};

export default DataLoad;
