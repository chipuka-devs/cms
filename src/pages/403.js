import { Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Page Unauthorized."
      extra={<Link to="/">Back Home</Link>}
      style={{ marginTop: "6%" }}
    />
  );
};

export default Unauthorized;
