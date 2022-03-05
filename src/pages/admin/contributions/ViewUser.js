import { Input, Dropdown, Menu, Spin } from "antd";
import React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useState } from "react";
import "../rowPointer.css";
import { error, success } from "../../../components/Notifications";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { CustomTable } from "../../../components/CustomTable";

const ViewUser = () => {
  const uid = window.location.pathname.split("/").slice(-1)[0];
  const [contributions, setContributions] = useState();
  const [selectedContribution, setSelectedContribution] = useState(
    "--Please select Contribution --"
  );
  const [listOfContributions, setListOfContributions] = useState([]);
  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const [currentContributionAmount, setCurrentContributionAmount] = useState(0);
  const [userPledge, setUserPledge] = useState(null);
  const [accessPledge, setAccessPledge] = useState(true);

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

  const handleContributions = async () => {
    let exists = false;
    const date = new Date().toLocaleDateString();

    const contribs = contributions.contributions;

    contribs &&
      contribs.forEach(async (cont) => {
        const id = selectedContribution.toLowerCase();

        // update contribution if it exists
        if (id === cont.id) {
          exists = true;

          let otherContributions = contribs.filter((c) => c.id !== id);
          const currentCont = contribs.filter((c) => c.id === id)[0];
          // cont.amount = currentContributionAmount;

          const conts = currentCont.conts;
          conts.unshift({ amount: parseInt(currentContributionAmount), date });

          otherContributions.unshift({
            ...currentCont,
            conts,
            pledge: userPledge,
          });

          const myContributions = {
            ...contributions,
            contributions: otherContributions,
          };

          let allContributionsTotal = 0;

          myContributions.contributions.forEach((contribution) => {
            const singleContributionTotal = contribution.conts
              .map((item) => item.amount)
              .reduce((prev, next) => prev + next);

            allContributionsTotal += singleContributionTotal;
          });

          const updatedContributions = {
            ...myContributions,
            total: allContributionsTotal,
          };

          // (updatedContributions);

          try {
            await setDoc(
              doc(db, "user_contributions", uid),
              updatedContributions
            );

            success("Success!", "Update successful!");
          } catch (err) {
            error("Error", err.message);
          }
        }
      });

    // create new Contribution if contribution does not exist
    if (!exists) {
      const newContribution = {
        id: selectedContribution.toLowerCase(),
        contribution: selectedContribution,
        pledge: userPledge,
        conts: [{ amount: parseInt(currentContributionAmount), date }],
      };

      // add contribution to list of my contributions
      let myContributions = contribs ? contribs : [];
      myContributions.unshift(newContribution);

      // calculate the total of my contributions
      let allContributionsTotal = 0;

      myContributions.forEach((contribution) => {
        const singleContributionTotal = contribution.conts
          .map((item) => item.amount)
          .reduce((prev, next) => prev + next);

        allContributionsTotal += singleContributionTotal;
      });

      const updatedContributions = {
        ...contributions,
        contributions: myContributions,
        total: allContributionsTotal,
      };

      try {
        await setDoc(doc(db, "user_contributions", uid), {
          ...updatedContributions,
        });

        success("Success!", "Update successful!");
      } catch (err) {
        error("Error", err.message);
      }

      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentContributionAmount === 0 || !currentContributionAmount) {
      error("Empty Field", "Please enter a contribution amount");
      return;
    }

    // if (userPledge === 0 || !userPledge || userPledge === null) {
    //   error("Empty Field", "Please enter a User's Pledge");
    //   return;
    // }

    // console.log(currentContribution, currentContributionAmount);
    handleContributions();
  };

  const fetchContributions = () => {
    startLoading("Fetching contributions . . .");

    const q = query(
      collection(db, "user_contributions"),
      where("uid", "==", uid)
    );

    onSnapshot(q, (docs) => {
      let uList = [];
      docs.forEach((d) => uList.push({ ...d.data(), key: d.id }));

      setContributions(uList[0]);
      // console.log(uList[0]);
    });
    stopLoading();
  };

  const fetchContributionList = () => {
    startLoading("Fetching Contribution List...");

    onSnapshot(collection(db, "contributions"), (docs) => {
      let cList = [];
      docs.forEach((d) => cList.push({ ...d.data(), key: d.id }));

      setListOfContributions(cList);
      stopLoading();
    });
  };

  React.useEffect(() => {
    fetchContributions();

    fetchContributionList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (selectedContribution) {
      const selectedConts =
        contributions &&
        contributions.contributions.filter(
          (s) => s.id === selectedContribution.toLowerCase()
        );

      if (selectedConts && selectedConts[0]) {
        const pledge = selectedConts[0].pledge;
        if (pledge) {
          setAccessPledge(false);
        } else {
          setAccessPledge(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContribution, contributions]);

  const columns = [
    {
      title: "Contribution",
      dataIndex: "contribution",
      key: "contribution",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, c) => {
        const amount = c.conts
          .map((item) => item.amount)
          .reduce((prev, next) => prev + next);

        return <span>{amount}</span>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (_, c) => <span>{c.conts[0].date}</span>,
    },

    // {
    //   title: "Actions",
    //   key: "actions",
    //   dataIndex: "actions",
    //   render: (_) => (
    //     <div className="flex gap-1">
    //       <button className="p-2 bg-blue-700 text-white">Edit</button>
    //     </div>
    //   ),
    // },
  ];
  // name total_amount email actions
  const menu = (
    <Menu>
      {listOfContributions &&
        listOfContributions.map((item, i) => (
          <Menu.Item key={i} onClick={() => setSelectedContribution(item.name)}>
            <span target="_blank" rel="noopener noreferrer">
              {item.name}
            </span>
          </Menu.Item>
        ))}
    </Menu>
  );

  const tableData =
    contributions && contributions.contributions && contributions.contributions;
  return (
    <AdminLayout current="1" breadcrumbs={["Admin", "contributions", `${uid}`]}>
      {/* input */}
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <div>
          <p className="text-gray-500">
            Fill in the form below to add a contribution
          </p>
        </div>
        <form className="mx-auto" onSubmit={handleSubmit}>
          <div className="flex items-end gap-1 w-full ">
            <div className="">
              <label className="font-medium" htmlFor="type">
                Input Contribution:
              </label>
              <Dropdown overlay={menu} placement="bottomLeft">
                <div
                  className="h-8 bg-white border flex items-center px-3"
                  style={{ width: "300px" }}
                >
                  {selectedContribution}
                </div>
              </Dropdown>
            </div>

            <div className="">
              <label className="font-medium" htmlFor="type">
                Input Amount:
              </label>
              {/* amount  */}
              <Input
                type="number"
                placeholder="i.e 200 "
                required
                // value={currentContributionAmount}
                onChange={(e) => setCurrentContributionAmount(e.target.value)}
              />
            </div>

            <div className="">
              <label className="font-medium" htmlFor="type">
                Input User's Pledge:
              </label>
              {/* amount  */}
              <Input
                type="number"
                placeholder="Pledge amount i.e 200 "
                disabled={accessPledge ? false : true}
                value={userPledge}
                onChange={(e) => setUserPledge(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 px-4 text-white h-8 mb-0"
            >
              Update
            </button>
          </div>
        </form>

        <div className="mt-5 user-table">
          <CustomTable cols={columns} rows={tableData} isClickable={true} />
        </div>
      </Spin>
    </AdminLayout>
  );
};

export default ViewUser;
