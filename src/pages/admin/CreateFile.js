import { Button, Divider, Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { UploadOutlined } from "@ant-design/icons";
import excel from "../../assets/excel.png";
import moment from "moment";
import * as XLSX from "xlsx";
import { Table } from "antd";
import { success } from "../../components/Notifications";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";

const CreateFile = () => {
  const [file, setFile] = useState();
  const [uploadedAt, setUploadedAt] = useState();
  const [parsedData, setParsedData] = useState([]);
  const [tableData, setTableData] = useState({
    columns: [],
    rows: [],
  });
  const [uploading, setUploading] = useState(false);

  const [currentTable, setCurrentTable] = useState(0);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        let convertedData = [];

        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        wb.SheetNames.slice(0, 3).forEach((name, i) => {
          const ws = wb.Sheets[name];

          const data = XLSX.utils.sheet_to_json(ws);

          resolve(data);

          if (data.length > 0) {
            convertedData.push({ id: name, data });
          }
        });

        setParsedData(convertedData);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      // console.log(d);
    });
  };

  const saveData = async () => {
    setUploading(true);

    if (parsedData.length > 0 && uploadedAt) {
      console.log("uploading data to firestore");

      try {
        await addDoc(collection(db, "file"), {
          name: file.name,
          data: parsedData,
        });

        setUploading(false);
        success("Upload Success!", "File uploaded successfully!");
        console.log("upload success");
      } catch (err) {
        // error("Upload Success!", err.message);
        setUploading(false);
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (parsedData.length > 0) {
      const setTable = () => {
        let columns = [];
        Object.keys(
          parsedData[currentTable].data &&
            parsedData[currentTable].data.length > 0 &&
            parsedData[currentTable].data[1]
        ).forEach((i) =>
          columns.push({
            title: i,
            dataIndex: i,
            key: i.toLowerCase(),
          })
        );

        setTableData({
          columns,
          rows:
            parsedData[currentTable].data &&
            parsedData[currentTable].data &&
            parsedData[currentTable].data,
        });
      };

      setTable();
    }
    // file && saveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedData, currentTable]);

  return (
    <AdminLayout current="2" breadcrumbs={["Admin", "New-File"]}>
      <div>
        <Divider>
          <span className="text-lg">Upload new form</span>
        </Divider>
        <div className="flex">
          <div className="lg:w-8/12 ">
            <div className="lg:w-9/12 md:w-10/12 bg-slate-200 py-2 px-4 mx-auto min-h-48 rounded-md">
              <div className=" bg-gray-400 cursor-pointer mx-auto rounded mt-5 text-white ">
                <label
                  htmlFor="excel-upload"
                  className="cursor-pointer p-3 w-full h-full font-bold flex items-center justify-center"
                >
                  Click to Select Excel File &nbsp;
                </label>

                <input
                  hidden
                  type="file"
                  id="excel-upload"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => {
                    e.preventDefault();
                    setFile(e.target.files[0]);
                    setUploadedAt(new Date());

                    readExcel(e.target.files[0]);
                  }}
                />
              </div>

              {uploadedAt && (
                <div className="mt-5 flex gap-4 bg-slate-100 p-2 rounded-lg">
                  {/* img1 */}
                  <img src={excel} className="w-10 h-10 rounded-full" alt="" />

                  {/* text */}
                  <div className="flex flex-col justify-between ">
                    <span className="font-medium">{file && file.name}</span>
                    <span>
                      {moment(uploadedAt).format("l")}-
                      {moment(uploadedAt).format("LT")}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex">
                <Button
                  disabled={!uploadedAt || uploading}
                  className="h-12 rounded px-5 bg-blue-800 text-white mx-auto my-3"
                  onClick={() => saveData()}
                >
                  {!uploading ? (
                    <>
                      Upload file <UploadOutlined className="text-2xl" />
                    </>
                  ) : (
                    <>Uploading file please wait . . . </>
                  )}
                </Button>
              </div>
            </div>
            ,
          </div>

          {parsedData.length > 0 && (
            <div>
              <span>The file you selected has {parsedData.length} tab(s).</span>
              <br />
              <span>Please select tab to view</span>
              <br />
              <br />

              <Dropdown
                overlay={
                  <Menu>
                    {parsedData.map((i, index) => (
                      <Menu.Item
                        key={index}
                        onClick={() => console.log(setCurrentTable(index))}
                      >
                        <button>{i.id}</button>
                      </Menu.Item>
                    ))}
                  </Menu>
                }
                placement="bottomCenter"
              >
                <Button>Click here to select tab</Button>
              </Dropdown>

              <div className="mt-4 flex">
                <span className="font-medium">Current Tab:</span>
                <div className="bg-white p-1 border w-full flex items-center">
                  {parsedData[currentTable].id}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="xl:w-10/12 mx-auto">
          <ExcelJsonTable cols={tableData.columns} rows={tableData.rows} />
        </div>
      </div>
    </AdminLayout>
  );
};

const ExcelJsonTable = ({ cols, rows }) => {
  const columns = cols;

  const data = rows;
  return <Table columns={columns} dataSource={data} scroll={{ x: 1200 }} />;
};
export default CreateFile;
