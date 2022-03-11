import React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";

export const Project = () => {
  return (
    <AdminLayout current="3" breadcrumbs={["Admin", "analysis", "project"]}>
      Project contributions
    </AdminLayout>
  );
};
