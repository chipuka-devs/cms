import {
  Button,
  DatePicker,
  Divider,
  Dropdown,
  Input,
  Menu,
  Popconfirm,
  Spin,
} from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { CustomTable } from "../../../components/CustomTable";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";
import { Context } from "../../../utils/MainContext";

export const VoluntaryContributions = () => {
  const { allUsers } = useContext(Context);

  const [voluntaryContribution, setVoluntaryContribution] = useState({
    user: {
      name: "--please Select user--",
    },
    name: "",
    amount: "",
    doc: new Date().toDateString(),
  });
  const [voluntaryContributions, setVoluntaryContributions] = useState([]);

  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });
  const [isUpdating, setIsUpdating] = useState(false);

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

    if (!voluntaryContribution.amount) {
      error("Empty Field", "Please enter a contribution amount");

      return;
    }

    if (!voluntaryContribution.name) {
      error("Error", "Please Select Contribution");
      return;
    }

    const { name, user, amount } = voluntaryContribution;

    try {
      if (isUpdating) {
        // console.log(currentContribution);
        await updateDoc(
          doc(db, "user_contributions", voluntaryContribution?.key),
          {
            amount: voluntaryContribution.amount,
            user: voluntaryContribution?.user?.uid,
            contribution: voluntaryContribution.name,
          }
        );

        setIsUpdating(false);

        success("Success!", "Contribution updated successfully!");
      }
      // add contribution
      if (!isUpdating && voluntaryContribution?.amount) {
        await addDoc(collection(db, "user_contributions"), {
          amount: amount,
          user: user.uid,
          type: "voluntary",
          contribution: name,
          doc: Timestamp.fromDate(new Date(voluntaryContribution?.doc)),
        });

        success("Success!", "Contribution added successfully!");
      }

      stopLoading();
      setVoluntaryContribution({
        user: {
          name: "--please Select user--",
        },
        name: "",
        amount: "",
      });
    } catch (err) {
      error("Error", err.message);
      stopLoading();
    }
  };

  const handleUpdate = (contrib) => {
    // setUpdate((prev) => ({ ...prev, mode: true, contribution: contrib }));
    setIsUpdating(true);
    console.log(contrib);
    // setSelectedContribution({ name: contrib?.purpose, id: contrib?.cid });
    // setSelectedUser({ name: contrib?.member, uid: contrib?.uid });
    setVoluntaryContribution((prev) => ({
      ...prev,
      user: { name: contrib?.member, uid: contrib?.uid },
      name: contrib?.purpose,
      amount: contrib?.amount,
      key: contrib?.key,
    }));
  };

  const handleDelete = async (id) => {
    // setUpdate((prev) => ({ ...prev, mode: true, contribution: contrib }));
    try {
      await deleteDoc(doc(db, "user_contributions", id));

      stopLoading();

      success("Success!", "Contribution Deleted Successfully!");
    } catch (err) {
      setLoading({
        ...loading,
        isLoading: false,
        loadingMessage: "",
      });

      error("Error:", err.message);
    }
  };

  useEffect(() => {
    startLoading("Fetching Users . . .");
    const fetchUserContributions = () => {
      const q = query(
        collection(db, "user_contributions"),
        where("type", "==", "voluntary")
      );
      onSnapshot(q, (docs) => {
        const cList = [];
        docs.forEach((d) => {
          const currentUser = allUsers.filter(
            (item) => item.uid === d.data().user
          )[0];

          cList.unshift({
            date: d.data()?.doc?.seconds
              ? new Date(d.data()?.doc?.seconds * 1000).toLocaleDateString()
              : new Date(d.data().timestamp).toLocaleDateString(),
            purpose: d.data()?.contribution,
            amount: d.data()?.amount,
            member: currentUser.name,
            uid: currentUser?.id,
            key: d?.id,
          });
        });

        setVoluntaryContributions(cList);

        stopLoading();
      });
    };

    fetchUserContributions();
  }, [allUsers]);

  const uMenu = (
    <Menu>
      {allUsers.map((item, i) => (
        <Menu.Item
          key={i}
          onClick={() =>
            setVoluntaryContribution((prev) => ({ ...prev, user: item }))
          }
        >
          <span target="_blank" rel="noopener noreferrer">
            {item.name}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      //   render: (text) => <Link to={"/"}>{text}</Link>,
    },
    {
      title: "Member",
      dataIndex: "member",
      key: "member",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, item) => parseInt(item?.amount).toLocaleString(),
    },

    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, data) => (
        <>
          <Button
            className="bg-blue-600 font-medium text-gray-100"
            onClick={() => {
              handleUpdate(data);
            }}
          >
            Edit
          </Button>
          &nbsp;
          <Popconfirm
            title="Are you sure to delete this Contribution?"
            onConfirm={() => handleDelete(data?.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              className="bg-red-600 font-medium text-gray-100"
              // onClick={() => handleDelete(data)}
            >
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <Divider className="font-medium">Voluntary Contributions</Divider>

        <form className="mx-auto my-2" onSubmit={handleSubmit}>
          <div className="flex items-end gap-1 w-full ">
            <div className="">
              <label className="font-medium" htmlFor="type">
                Select User:
              </label>
              <Dropdown overlay={uMenu} placement="bottomLeft">
                <div
                  className="h-8 bg-white border flex items-center px-3"
                  style={{ width: "300px" }}
                >
                  {voluntaryContribution?.user?.name}
                </div>
              </Dropdown>
            </div>

            <div className="">
              <label className="font-medium" htmlFor="type">
                Contribution Title:
              </label>
              {/* Contribution Name */}
              <Input
                type="text"
                placeholder="contribution title i.e celebration "
                required
                value={voluntaryContribution?.name}
                onChange={(e) =>
                  setVoluntaryContribution((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
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
                value={voluntaryContribution?.amount}
                onChange={(e) =>
                  setVoluntaryContribution((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
            </div>

            {!isUpdating && (
              <div className="">
                <label className="font-medium" htmlFor="type">
                  Contribution Date:
                </label>
                <br />
                {/* amount  */}
                <DatePicker
                  defaultValue={moment(voluntaryContribution?.doc)}
                  onChange={(_date, dateString) =>
                    setVoluntaryContribution((prev) => ({
                      ...prev,

                      doc: new Date(dateString).toLocaleDateString(),
                    }))
                  }
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-green-700 px-4 text-white h-8 mb-0"
            >
              ADD
            </button>
          </div>
        </form>
        <CustomTable
          cols={columns}
          rows={voluntaryContributions}
          style
          showBg={false}
          summary={{
            show: true,
            title: "Total Contributions (kshs)",
            amount:
              voluntaryContributions.length > 0 &&
              voluntaryContributions?.reduce(
                (prev, next) => parseInt(prev) + parseInt(next?.amount),
                0
              ),
          }}
        />
      </Spin>
    </>
  );
};
