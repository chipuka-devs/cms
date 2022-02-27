import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import React, { useContext } from "react";
import { Context } from "../utils/MainContext";

export const CustomTable = ({
  cols,
  rows,
  isClickable = false,
  summary,
  key,
  span = 2,
}) => {
  const navigate = useNavigate();
  const { setCurrentView } = useContext(Context);

  const columns = cols;

  const data = rows;
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={key}
      summary={() => {
        if (summary && summary.show) {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row className="bg-slate-500 text-white">
                <Table.Summary.Cell index={0} colSpan={span}>
                  <span className="font-medium uppercase">{summary.title}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={span}>
                  <span
                    className="font-medium uppercase"
                    style={{ fontSize: "17px" }}
                  >
                    {summary.amount}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }
      }}
      onRow={(record) => {
        if (isClickable) {
          return {
            onClick: () => {
              navigate(`${record.id}`);
              setCurrentView(record);
            }, // click row
          };
        }
      }}
    />
  );
};
