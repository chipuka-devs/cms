import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { Divider, Table, Spin } from "antd";

const ViewFile = () => {
  const id = window.location.pathname.split("/")[2];

  const [fileDetails, setFileDetails] = useState();
  const [tableData, setTableData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(doc(db, "files", id), (doc) => {
      setFileDetails(doc.data());
      setLoading(false);
    });

    return unsub;
  }, [id]);

  useEffect(() => {
    if (fileDetails) {
      const setTable = () => {
        let columns = [];
        Object.keys(fileDetails.data[0]).forEach((i) =>
          columns.push({
            title: i,
            dataIndex: i,
            key: i.toLowerCase(),
          })
        );

        setTableData({
          columns,
          rows: fileDetails.data,
        });

        console.log(
          new Date(fileDetails.uploadedAt.seconds * 1000).toLocaleString()
        );
      };

      // save data to firestore

      setTable();
      // file && saveData();
    }
  }, [fileDetails]);

  return (
    <AdminLayout breadcrumbs={["Admin", "Viewfile"]}>
      <div>
        <Divider>
          <span className="text-lg">{fileDetails && fileDetails.name}</span>
        </Divider>

        <Spin spinning={loading} size="large" tip="Loading...">
          <div className="p-2 font-bold">
            {fileDetails &&
              fileDetails.uploadedAt &&
              new Date(fileDetails.uploadedAt.seconds * 1000).toLocaleString()}
          </div>

          {tableData && (
            <ExcelTable cols={tableData.columns} rows={tableData.rows} />
          )}
        </Spin>
      </div>
    </AdminLayout>
  );
};

const ExcelTable = ({ cols, rows }) => {
  const columns = cols;

  const data = rows;
  return <Table columns={columns} dataSource={data} />;
};

export default ViewFile;
