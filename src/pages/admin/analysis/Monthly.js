import React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

export const Monthly = () => {
  return (
    <AdminLayout current="3" breadcrumbs={["Admin", "analysis", "monthly"]}>
      Monthly
    </AdminLayout>
  );
};
