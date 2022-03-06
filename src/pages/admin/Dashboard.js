import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";

export const Dashboard = () => {
  return (
    <AdminLayout current="0" breadcrumbs={["Admin"]}>
      <div className="grid grid-cols-3 justify-between gap-5 p-3">
        {/* Total Contributions */}
        <Card>
          <span className="text-xl font-bold">Total Contributions(kshs)</span>

          <span className="text-xl font-medium">40000</span>

          <span className="text-sm text-center">
            includes the sum of all <br /> contributions excluding deductions
          </span>
        </Card>
        {/* Total Deductions */}
        <Card>
          <span className="text-xl font-bold">Total Deductions(kshs)</span>

          <span className="text-xl font-medium">8000</span>

          <span className="text-sm text-center">
            includes the sum of all <br /> Deductions
          </span>
        </Card>
        {/* Grand Total */}
        <Card>
          <span className="text-xl font-bold">Balance(kshs)</span>

          <span className="text-xl font-medium">30000</span>

          <span className="text-sm text-center">
            includes the sum of all contributions <br /> minus total deductions.
          </span>
        </Card>
      </div>
      Dashboard
    </AdminLayout>
  );
};

const Card = ({ children }) => (
  <div className="rounded-xl bg-slate-200 h-40 flex flex-col items-center justify-center gap-2">
    {children}
  </div>
);
