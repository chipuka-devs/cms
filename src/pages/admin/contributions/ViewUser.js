import { Input, Dropdown, Menu, Spin } from "antd";
import React, { useContext } from "react";
import { useState } from "react";
import "../rowPointer.css";
import { error, success } from "../../../components/Notifications";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { CustomTable } from "../../../components/CustomTable";
import { Context } from "../../../utils/MainContext";

const ViewUser = () => {
  const uid = window.location.pathname.split("/").slice(-1)[0];

  const { allContributions } = useContext(Context);

  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(
    "--Please select Contribution --"
  );

  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const [currentContribution, setCurrentContribution] = useState({});
  const [userPledge, setUserPledge] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    startLoading("Adding user contribution...");

    if (!currentContribution.amount) {
      error("Empty Field", "Please enter a contribution amount");

      return;
    }

    if (!selectedContribution.name) {
      error("Error", "Please Select Contribution");
      return;
    }

    try {
      // add contribution
      if (currentContribution && currentContribution.amount) {
        await addDoc(collection(db, "user_contributions"), {
          amount: currentContribution.amount,
          user: uid,
          contribution: selectedContribution.id,
          doc: new Date().toLocaleDateString(),
        });
      }

      if (userPledge) {
        await addDoc(collection(db, "pledges"), {
          amount: userPledge,
          user: uid,
          contribution: selectedContribution.id,
        });
      }

      setLoading({ isLoading: false });

      success("Success!", "Contribution added successfully!");
    } catch (err) {
      error("Error", err.message);
    }
  };

  React.useEffect(() => {
    startLoading("Fetching User Contributions . . .");
    const fetchUserContributions = () => {
      const userContributionsRef = collection(db, "user_contributions");

      const q = query(userContributionsRef, where("user", "==", uid));

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

        let allConts = [];

        Object.entries(groupedContributions).forEach((cont) => {
          // handle contribution details
          const contrib = cont[0];
          const contributionDetails = allContributions.filter(
            (cont) => cont.id === contrib
          )[0];

          // sum up total amount of contribution
          const amount = cont[1]
            .map((item) => item.amount)
            .reduce((prev, next) => parseInt(prev) + parseInt(next));

          const userContribution = {
            contribution: contributionDetails.name,
            amount,
            key: contrib,
          };

          allConts.push(userContribution);
        });

        setContributions(allConts);
        stopLoading();
      });
      stopLoading();
    };

    fetchUserContributions();
  }, [allContributions, uid]);

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
    },

    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      render: (_) => (
        <div className="flex gap-1">
          <button className="p-2 bg-blue-700 text-white">Edit</button>
        </div>
      ),
    },
  ];
  // name total_amount email actions
  const menu = (
    <Menu>
      {allContributions.map((item, i) => (
        <Menu.Item key={i} onClick={() => setSelectedContribution(item)}>
          <span target="_blank" rel="noopener noreferrer">
            {item.name}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
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
                  {selectedContribution.name
                    ? selectedContribution.name
                    : selectedContribution}
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
                onChange={(e) =>
                  setCurrentContribution({
                    user: uid,
                    contribution: selectedContribution.key,
                    doc: new Date().toLocaleDateString(),
                    amount: e.target.value,
                  })
                }
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
                // disabled={accessPledge ? false : true}
                value={userPledge && userPledge.amount && userPledge.amount}
                onChange={(e) => setUserPledge(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 px-4 text-white h-8 mb-0"
            >
              ADD
            </button>
          </div>
        </form>

        <div className="mt-5 user-table">
          <CustomTable
            cols={columns}
            rows={contributions && contributions}
            isClickable={true}
          />
        </div>
      </Spin>
    </>
  );
};

export default ViewUser;
