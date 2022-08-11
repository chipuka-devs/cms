import { IncomeStatement } from "../pages/admin/IncomeStatement";
import PrivateRoute from "./PrivateAdminRoute";
import { ViewUsers } from "../pages/admin/ViewUsers";
// import { Dashboard } from "../pages/admin/Dashboard";

export const AdminRoutes = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <ViewUsers />
      </PrivateRoute>
    ),
  },

  //   {
  //     path: "/admin/privileges",
  //     element: (
  //       <PrivateRoute>
  //         <Privileges />
  //       </PrivateRoute>
  //     ),
  //   },
  //   // contribution paths
  //   {
  //     path: "/admin/contributions",
  //     element: (
  //       <PrivateRoute>
  //         <View />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/monthly/new",
  //     element: (
  //       <PrivateRoute> income-statement
  //         <MonthlyBudget />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/project/new",
  //     element: (
  //       <PrivateRoute>
  //         <ProjectBudget />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/monthly",
  //     element: (
  //       <PrivateRoute>
  //         <MonthlyContributions />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/project",
  //     element: (
  //       <PrivateRoute>
  //         <ProjectContributions />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/all",
  //     element: (
  //       <PrivateRoute>
  //         <AllContributions />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/pledges",
  //     element: (
  //       <PrivateRoute>
  //         <Pledges />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/annual/new",
  //     element: (
  //       <PrivateRoute>
  //         <AnnualBudget />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/annual",
  //     element: (
  //       <PrivateRoute>
  //         <AnnualContributions />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/voluntary",
  //     element: (
  //       <PrivateRoute>
  //         <VoluntaryContributions />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/contributions/:id",
  //     element: (
  //       <PrivateRoute>
  //         <ViewUser />
  //       </PrivateRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/contributions/:id/:id",
  //     element: (
  //       <PrivateRoute>
  //         <ViewDetailedContribution />
  //       </PrivateRoute>
  //     ),
  //   },

  // {
  //   path: "/admin/contributions/new",
  //   element: (
  //     <PrivateRoute>
  //       <NewContribution />
  //     </PrivateRoute>
  //   ),
  // },
  // Contributions paths end

  // deduction paths
  //   {
  //     path: "/admin/deductions",
  //     element: (
  //       <PrivateRoute>
  //         <Deductions />
  //       </PrivateRoute>
  //     ),
  //   },
  //   {
  //     path: "/admin/deductions/:id",
  //     element: (
  //       <PrivateRoute>
  //         <ViewDeduction />
  //       </PrivateRoute>
  //     ),
  //   },
  //   // Deducitons end pledges

  {
    path: "users",
    element: (
      <PrivateRoute>
        <ViewUsers />
      </PrivateRoute>
    ),
  },

  //   // analysis paths
  //   {
  //     path: "/admin/analysis/monthly",
  //     element: (
  //       <PrivateRoute>
  //         <Monthly />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/analysis/project",
  //     element: (
  //       <PrivateRoute>
  //         <Project />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/analysis/m_summary",
  //     element: (
  //       <PrivateRoute>
  //         <MonthlySummary />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/analysis/p_summary",
  //     element: (
  //       <PrivateRoute>
  //         <ProjectSummary />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/analysis/o_summary",
  //     element: (
  //       <PrivateRoute>
  //         <OverallSummary />
  //       </PrivateRoute>
  //     ),
  //   },

  //   {
  //     path: "/admin/analysis/net",
  //     element: (
  //       <PrivateRoute>
  //         <NetBalance />
  //       </PrivateRoute>
  //     ),
  //   },
  // end of analysis paths

  {
    path: "/admin/income-statement",
    element: (
      <PrivateRoute>
        <IncomeStatement />
      </PrivateRoute>
    ),
  },
];
