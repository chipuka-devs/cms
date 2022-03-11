import React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

export const OverallSummary = () => {
  return (
    <AdminLayout
      current="3"
      breadcrumbs={["Admin", "analysis", "overall-summary"]}
    >
      Over all Summary
    </AdminLayout>
  );
};
