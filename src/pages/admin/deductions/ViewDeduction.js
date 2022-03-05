import {
  doc,
  onSnapshot,
  collection,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { db } from "../../../utils/firebase";
import { Input, Checkbox, Dropdown, Menu } from "antd";
import { error, success } from "../../../components/Notifications";
import { CustomTable } from "../../../components/CustomTable";

const ViewDeduction = () => {
  const dId = window.location.pathname.split("/").slice(-1)[0];

  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });

  const [dContribution, setDContribution] = useState();
  const [dTitle, setDTitle] = useState();
  const [dAmount, setDAmount] = useState();
  const [dComment, setDComment] = useState();
  const [isGroup, setIsGroup] = useState(false);

  const [contributors, setContributors] = useState([]);
  const [selectedContributor, setSelectedContributor] = useState(
    "--Please select user--"
  );

  const [deductionContributors, setDeductionContributors] = useState([]);

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

  const updateDeduction = async () => {
    startLoading("Updating Deduction");
    try {
      await updateDoc(doc(db, "deductions", dId), {
        amount: dAmount,
        title: dTitle,
        conribution: dContribution,
        comment: dComment,
      });

      success("Success!", "Contributor added successfully!");
      stopLoading();
    } catch (err) {
      error("Error", err.message);
      stopLoading();
    }
  };
  const addContributor = async () => {
    startLoading("Adding Contributor");

    // fetch contributor details
    // add deductions to user

    // deduct amounts from contributor
    // Add Contributor
    try {
      await updateDoc(doc(db, "deductions", dId), {
        contributors: arrayUnion(
          selectedContributor.uid && selectedContributor.uid
        ),
      });

      success("Success!", "Contributor added successfully!");
      stopLoading();
    } catch (err) {
      stopLoading();
      error("Error", err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateDeduction();
  };

  useEffect(() => {
    startLoading("Fetching contributions . . .");
    const fetchContributions = () => {
      onSnapshot(doc(db, "deductions", dId), (item) => {
        setDAmount(item.data().amount);
        setDTitle(item.data().title);
        item.data().comment && setDComment(item.data().comment);
        item.data().contribution && setDContribution(item.data().contribution);

        onSnapshot(collection(db, "user_contributions"), (docs) => {
          const fetchedUsers = [];

          docs.forEach((d) => fetchedUsers.push(d.data()));

          const myArrayFiltered = fetchedUsers.filter((el) => {
            return (
              item.data().contributors &&
              item.data().contributors.some((f) => {
                return f === el.uid;
              })
            );
          });

          const dConts = [];

          myArrayFiltered.map((a) => {
            const requiredContribution =
              dContribution &&
              a.contributions.filter(
                (c) => c.id === dContribution.toLowerCase()
              )[0];
            const amount =
              requiredContribution &&
              requiredContribution.conts
                .map((item) => item.amount)
                .reduce((prev, next) => prev + next);

            return dConts.push({ user: a.name, amount });
          });

          setDeductionContributors(dConts);
          stopLoading();
        });
        stopLoading();
      });
    };

    fetchContributions();
  }, [dId, dContribution]);

  useEffect(() => {
    const fetchUserContributions = () => {
      startLoading("Fetching contributions");
      onSnapshot(collection(db, "user_contributions"), (docs) => {
        let userContributions = [];
        docs.forEach((doc) => {
          const conts = doc.data();

          function contributionExists() {
            // eslint-disable-next-line array-callback-return
            conts.contributions.some((el) => {
              if (el.contribution === dContribution) {
                userContributions.push(conts);
              }
            });
          }

          contributionExists();
        });
        setContributors(userContributions);
        stopLoading();
      });
    };

    fetchUserContributions();
  }, [dContribution]);

  useEffect(() => {
    const checkValidity = async () => {
      const deduction = dAmount;
      const totalCotributorsAmount = deductionContributors
        .map((item) => item.amount)
        .reduce((prev, next) => prev + next);

      const isValid = parseInt(totalCotributorsAmount) >= parseInt(deduction);
      const previousStatus = await (
        await getDoc(doc(db, "deductions", dId))
      ).data();
      if (isValid && previousStatus.status === "invalid") {
        // get previous status
        // update status if invalid
        await updateDoc(doc(db, "deductions", dId), {
          status: "pending",
        });
        console.log("DEDUCITON: Status updated");
      }
    };
    checkValidity();
  }, [deductionContributors, dAmount, dId]);

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const menu = (
    <Menu>
      {contributors.map((item, i) => {
        return (
          <Menu.Item key={i} onClick={() => setSelectedContributor(item)}>
            <span target="_blank" rel="noopener noreferrer">
              {item.name}
            </span>
          </Menu.Item>
        );
      })}
    </Menu>
  );
  return (
    <AdminLayout current="2" breadcrumbs={["Admin", "Deductions", `${dId}`]}>
      <div className="flex gap-4 justify-between">
        <form className="lg:w-2/4 " onSubmit={handleSubmit}>
          <div className="flex flex-col  gap-1 w-full ">
            <div className="">
              <label className="font-medium" htmlFor="type">
                Parent Contribution:
              </label>
              {/* amount  */}
              <Input
                type="text"
                placeholder="input deduction Contribution"
                disabled={dContribution === "" || !dContribution ? false : true}
                value={dContribution}
                onChange={(e) => setDContribution(e.target.value)}
              />
            </div>
            <div className="">
              <label className="font-medium" htmlFor="type">
                Deduction Title:
              </label>
              {/* amount  */}
              <Input
                type="text"
                placeholder="input deduction title"
                disabled={dTitle === "" || !dTitle ? false : true}
                value={dTitle}
                onChange={(e) => setDTitle(e.target.value)}
              />
            </div>
            <div className="">
              <label className="font-medium" htmlFor="type">
                Deduction Amount:
              </label>
              {/* amount  */}
              <Input
                type="number"
                placeholder="Pledge amount i.e 200 "
                disabled={dAmount === "" || !dAmount ? false : true}
                value={dAmount}
                onChange={(e) => setDAmount(e.target.value)}
              />
            </div>
            <div className="">
              <label className="font-medium" htmlFor="type">
                Deduction Comment:
              </label>
              {/* amount  */}
              <Input.TextArea
                rows={4}
                placeholder="Deduction comment "
                // disabled={dComment === "" || !dComment ? false : true}
                value={dComment}
                onChange={(e) => setDComment(e.target.value)}
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

        <div className="lg:w-2/4 flex flex-col gap-2 p-2 bg-gray-50 rounded">
          <span>Please specify those who are to be deducted</span>
          <span>
            If the deduction is not individual please check the box below
          </span>

          {/* is not individual */}
          <div className="flex justify-between pr-8">
            <span>is a group contribution</span>
            <Checkbox value={isGroup} onChange={() => setIsGroup(!isGroup)}>
              Checkbox
            </Checkbox>
          </div>

          {!isGroup && (
            <div>
              <div className=" ">
                <label className="font-medium" htmlFor="type">
                  Select user(s) To Deduct from:
                </label>
                <div className="flex gap-2">
                  <Dropdown className="" overlay={menu} placement="bottomLeft">
                    <div
                      className="h-8 bg-white border flex items-center px-3"
                      style={{ width: "100%" }}
                    >
                      {selectedContributor.name
                        ? selectedContributor.name
                        : selectedContributor}
                    </div>
                  </Dropdown>
                  <button
                    onClick={addContributor}
                    type="submit"
                    className="bg-green-700 px-4 text-white h-8 mb-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              <CustomTable
                cols={columns}
                rows={deductionContributors}
                isClickable={true}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewDeduction;
