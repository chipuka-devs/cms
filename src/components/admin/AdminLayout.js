import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import MenuBar from "./Menu";
import { AdminRoutes } from "../../utils/AdminRoutes";
import PrivateRoute from "../../utils/PrivateAdminRoute";
import ViewAllContributions from "../../pages/admin/contributions/ViewAll";
import MonthlyBudget from "../../pages/admin/contributions/MonthlyBudget";
import { MonthlyContributions } from "../../pages/admin/contributions/MonthlyContributions";
import { ProjectContributions } from "../../pages/admin/contributions/ProjectContributions";
import { VoluntaryContributions } from "../../pages/admin/contributions/VoluntaryContributions";
import { AnnualContributions } from "../../pages/admin/contributions/AnnualContributions";
import ProjectBudget from "../../pages/admin/contributions/ProjectBudget";
import { Pledges } from "../../pages/admin/contributions/Pledges";
import AnnualBudget from "../../pages/admin/contributions/AnnualBudget";
import {
  Monthly,
  MonthlySummary,
  OverallSummary,
  Project,
} from "../../pages/admin/analysis";
import { ProjectSummary } from "../../pages/admin/analysis/ProjectSummary";
import Deductions from "../../pages/admin/deductions/viewAll";
import { IncomeStatement } from "../../pages/admin/IncomeStatement";
import Privileges from "../../pages/admin/Privileges";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  makeExpenditureGroupings,
  makeGroupings,
  makeYearlyContributionsGroupings,
  setBudgets,
  setContributions,
  setExpenditures,
} from "../../redux/contributions/contributionSlice";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../utils/firebase";
import Net from "../../pages/admin/analysis/Net";

const { Content, Footer, Sider } = Layout;
// const { SubMenu } = Menu;
const AdminLayout = () => {
  const dispatch = useDispatch();

  const fetchExpenditures = useCallback(() => {
    try {
      onSnapshot(collection(db, "deductions"), (docs) => {
        let arrOfExp = [];
        docs.forEach((d) => {
          const yearCreated = new Date(
            d?.data()?.createdAt?.seconds * 1000
          )?.getFullYear();

          const date = new Date(
            d?.data()?.createdAt?.seconds * 1000
          )?.getFullYear();

          const monthCreated = new Date(
            d?.data()?.createdAt?.seconds * 1000
          )?.getMonth();

          arrOfExp.push({
            ...d.data(),
            year: yearCreated,
            month: monthCreated,
            createdAt: date,
          });
        });
        dispatch(setExpenditures(arrOfExp));
        dispatch(makeExpenditureGroupings(arrOfExp));
      });
      // setState((prev) => ({ ...prev, expenditures: arrOfExp }));
    } catch (error) {
      console.log("Fetch Expenditure error:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    const q = query(collection(db, "user_contributions"), orderBy("createdAt"));
    onSnapshot(q, (docs) => {
      const cList = [];

      docs.forEach((doc) => {
        const { createdAt, ...rest } = doc.data();

        const date = new Date(
          doc.data().createdAt?.seconds * 1000
        ).toISOString();
        const month = new Date(doc.data().doc).getMonth();
        const year = new Date(doc.data().doc).getFullYear();

        const contribution = {
          id: doc.id,
          createdAt: date,
          month: month,
          year,
          ...rest,
        };

        cList.push(contribution);
      });

      dispatch(setContributions(cList));
      dispatch(makeGroupings(cList));
      dispatch(makeYearlyContributionsGroupings(cList));
      // console.log(
      //   "Groupings:",
      //   Groupings.getContributionOpeningBalance(
      //     Groupings.getMonthlyTotalBalance(cList)["2022"],
      //     1,
      //     "UI2KCfyNRFYPhw45Xgq1"
      //   )
      // );
    });

    fetchExpenditures();
    // fetchConts();
  }, [dispatch, fetchExpenditures]);

  useEffect(() => {
    const qProjects = query(collection(db, "contributions"));

    const fetchProject = () => {
      onSnapshot(qProjects, (docs) => {
        let contributions = {};
        docs.forEach((doc) => {
          contributions[doc?.id] = doc.data();
        });

        dispatch(setBudgets(contributions));
      });
    };

    fetchProject();
  }, [dispatch]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        // collapsible
        // collapsed={collapsed}
        // onCollapse={onCollapse}
        width={250}
      >
        <div className="logo" />
        <MenuBar />
      </Sider>

      <Layout className="site-layout">
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}

        <Content className=" mx-2">
          {/* <Breadcrumb className="rounded p-2 my-2 bg-slate-200">
            {breadcrumbs &&
              breadcrumbs.map((b, i) => (
                <Breadcrumb.Item key={i}>{b}</Breadcrumb.Item>
              ))}
           <> <Breadcrumb.Item>Bill</Breadcrumb.Item></>
          </Breadcrumb> */}

          <div className="site-layout-background " style={{ minHeight: 360 }}>
            {/* {children} */}
            <Routes>
              {AdminRoutes.map((r, index) => (
                <Route key={index} path={r.path} element={r.element} />
              ))}
              <Route
                path="/contributions/"
                element={<ViewAllContributions />}
              />

              {/* contributions */}
              <>
                {/* budget */}
                <>
                  <Route
                    path={"/contributions/monthly/new"}
                    exact
                    element={
                      <PrivateRoute>
                        <MonthlyBudget />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path={"/contributions/project/new"}
                    exact
                    element={
                      <PrivateRoute>
                        <ProjectBudget />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path={"/contributions/Pledges"}
                    exact
                    element={
                      <PrivateRoute>
                        <Pledges />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path={"/contributions/annual/new"}
                    exact
                    element={
                      <PrivateRoute>
                        <AnnualBudget />
                      </PrivateRoute>
                    }
                  />
                </>
                {/* budget */}

                <Route
                  path={"/contributions/monthly"}
                  exact
                  element={
                    <PrivateRoute>
                      <MonthlyContributions />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={"/contributions/project"}
                  exact
                  element={
                    <PrivateRoute>
                      <ProjectContributions />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={"/contributions/voluntary"}
                  exact
                  element={
                    <PrivateRoute>
                      <VoluntaryContributions />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={"/contributions/annual"}
                  exact
                  element={
                    <PrivateRoute>
                      <AnnualContributions />
                    </PrivateRoute>
                  }
                />
              </>
              {/* contributions */}

              {/* Analysis */}
              <>
                <Route
                  path={"/analysis/monthly"}
                  exact
                  element={
                    <PrivateRoute>
                      <Monthly />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={"/analysis/Project"}
                  exact
                  element={
                    <PrivateRoute>
                      <Project />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={"/analysis/m_summary"}
                  exact
                  element={
                    <PrivateRoute>
                      <MonthlySummary />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={"/analysis/p_summary"}
                  exact
                  element={
                    <PrivateRoute>
                      <ProjectSummary />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={"/analysis/o_summary"}
                  exact
                  element={
                    <PrivateRoute>
                      <OverallSummary />
                    </PrivateRoute>
                  }
                />

                <Route
                  path={"/analysis/net"}
                  exact
                  element={
                    <PrivateRoute>
                      <Net />
                    </PrivateRoute>
                  }
                />
              </>
              {/* End of Analysis */}

              {/* Expenditures */}

              <Route
                path={"/deductions"}
                exact
                element={
                  <PrivateRoute>
                    <Deductions />
                  </PrivateRoute>
                }
              />
              {/* End of Expenditures */}

              <Route
                path={"/income-statement"}
                exact
                element={
                  <PrivateRoute>
                    <IncomeStatement />
                  </PrivateRoute>
                }
              />

              <Route
                path={"/privileges"}
                exact
                element={
                  <PrivateRoute>
                    <Privileges />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Content>

        <Footer className="text-xs" style={{ textAlign: "center" }}>
          CMS ©2022 built by chipuka-devs
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
