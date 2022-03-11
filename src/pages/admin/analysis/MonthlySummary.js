import React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

export const MonthlySummary = () => {
  return (
    <AdminLayout
      current="3"
      breadcrumbs={["Admin", "analysis", "monthly-summary"]}
    >
      Monthly Summary
    </AdminLayout>
  );
};
