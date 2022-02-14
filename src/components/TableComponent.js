import { Table } from "antd";

const TableComponent = ({ TableData }) => (
  <Table cols={TableData.columns} rows={TableData.rows} />
);

export default TableComponent;
