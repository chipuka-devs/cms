import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { Spin } from "antd";
import { CustomTable } from "../../../components/CustomTable";

const ViewDetailedContribution = () => {
  const userId = window.location.pathname.split("/").slice(-2)[0];
  let contribution = window.location.pathname.split("/").slice(-1)[0];

  // contribution = contribution.includes("%20")
  //   ? contribution.replace("%20", " ")
  //   : contribution;

  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const [contributions, setContributions] = useState([]);

  const totalContributions =
    contributions.conts &&
    contributions.conts.length > 0 &&
    contributions.conts
      .map((item) => item.amount)
      .reduce((prev, next) => parseInt(prev) + parseInt(next));

  const stopLoading = () => {
    setLoading({
      isLoading: false,
      loadingMessage: "",
    });
  };

  const startLoading = (message) => {
    setLoading({
      isLoading: true,
      loadingMessage: message,
    });
  };
  // load user's conts
  useEffect(() => {
    startLoading("Fetching user Contributions . . .");
    const fetchUserContributions = () => {
      const userContributionsRef = collection(db, "user_contributions");

      const q = query(userContributionsRef, where("user", "==", userId));

      onSnapshot(q, (docs) => {
        const currentUserContributions = [];

        docs.forEach((doc) => currentUserContributions.push(doc.data()));

        const groupedContributions = currentUserContributions.reduce(function (
          r,
          a
        ) {
          r[a.contribution] = r[a.contribution] || [];
          r[a.contribution].push(a);
          return r;
        },
        Object.create(null));

        Object.entries(groupedContributions).forEach((ent, i) => {
          if (ent[0] === contribution) {
            setContributions(ent[1]);
          }
        });

        stopLoading();
      });
      stopLoading();
    };

    fetchUserContributions();
  }, [contribution, userId]);

  const columns = [
    {
      title: "Date",
      dataIndex: "doc",
      key: "doc",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  return (
    <AdminLayout
      current="1"
      breadcrumbs={["Admin", "contributions", `${userId}`, `${contribution}`]}
    >
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <div className=" p-5 bg-white">
          {/* pledge */}
          {contributions.pledge && (
            <div className="flex items-center">
              <span className="font-medium">User's Pledge:</span>
              <div
                className={`${
                  totalContributions < contributions.pledge
                    ? `bg-red-100 text-red-700 `
                    : `bg-green-100 text-green-700`
                } h-10 ml-2 p-2 flex items-center font-medium`}
                style={{ width: "400px" }}
              >
                {contributions.pledge ? contributions.pledge : 0}
              </div>
            </div>
          )}
          {contributions.pledge && (
            <div>
              {totalContributions < contributions.pledge ? (
                <span className="text-red-500 mt-1 ">
                  contributions below target remainingAmount: (
                  {contributions.pledge - totalContributions} kshs)
                </span>
              ) : (
                <span className="text-green-600 mt-1">
                  contributions reached target ({totalContributions} kshs)
                </span>
              )}
            </div>
          )}

          {/* list contributions */}

          <div className="lg:w-10/12 mt-3">
            <CustomTable
              cols={columns}
              rows={contributions && contributions}
              span={1}
              summary={{
                show: true,
                title: "Total (Kshs)",
                amount:
                  contributions.conts &&
                  contributions.conts.length > 0 &&
                  contributions.conts
                    .map((item) => item.amount)
                    .reduce((prev, next) => parseInt(prev) + parseInt(next)),
              }}
            />
          </div>
        </div>
      </Spin>
    </AdminLayout>
  );
};

export default ViewDetailedContribution;
