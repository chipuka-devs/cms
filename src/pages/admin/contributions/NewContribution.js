import { Dropdown, Input, Menu, Spin } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import { error, success } from "../../../components/Notifications";
import { db } from "../../../utils/firebase";
import { Context } from "../../../utils/MainContext";

const NewContribution = () => {
  const { allUsers, allContributions } = useContext(Context);

  const [loading, setLoading] = useState({
    isLoading: false,
    loadingMessage: "loading...",
  });
  const [selectedContribution, setSelectedContribution] = useState(
    "--Please select Contribution --"
  );
  const [selectedUser, setSelectedUser] = useState("--Please select User --");
  const [newContribution, setNewContribution] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading({ isLoading: true, loadingMessage: "Adding contribution..." });

    if (!newContribution.amount) {
      error("Error", "Please input contribution amount");
      return;
    }
    if (!selectedUser.name) {
      error("Error", "Please Select User");
      return;
    }
    if (!selectedContribution.name) {
      error("Error", "Please Select Contribution");
      return;
    }

    try {
      // add contribution
      if (newContribution && newContribution.amount) {
        await addDoc(collection(db, "user_contributions"), {
          amount: newContribution.amount,
          user: selectedUser.uid,
          contribution: selectedContribution.id,
          doc: new Date().toLocaleDateString(),
        });
      }

      if (newContribution.pledge) {
        await addDoc(collection(db, "pledges"), {
          amount: newContribution.pledge,
          user: selectedUser.id,
          contribution: selectedContribution.id,
        });
      }

      setLoading({ isLoading: false });

      success("Success!", "Contribution added successfully!");
    } catch (err) {
      error("Error", err.message);
    }
  };

  const menu = (
    <Menu>
      {allContributions.map((item, i) => {
        return (
          <Menu.Item
            key={i}
            onClick={() => {
              setSelectedContribution(item);
            }}
          >
            <span target="_blank" rel="noopener noreferrer">
              {item.name}
            </span>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const usersMenu = (
    <Menu>
      {allUsers.map((item, i) => {
        return (
          <Menu.Item
            key={i}
            onClick={() => {
              setSelectedUser(item);
            }}
          >
            <span target="_blank" rel="noopener noreferrer">
              {item.name}
            </span>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  //   const tableData = setTableData();

  return (
    <AdminLayout current="1" breadcrumbs={["Admin", "contributions", `new`]}>
      <Spin
        spinning={loading.isLoading}
        size="large"
        tip={loading.loadingMessage}
      >
        <form className=" w-8/12" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 w-full ">
            <div className="">
              <label className="font-medium" htmlFor="type">
                Select User To add:
              </label>
              <Dropdown overlay={usersMenu} placement="bottomLeft">
                <div
                  className="h-8 bg-white border flex items-center px-3 w-full"
                  st
                >
                  {selectedUser && selectedUser.name
                    ? selectedUser.name
                    : selectedUser}
                </div>
              </Dropdown>
            </div>

            <div className="">
              <label className="font-medium" htmlFor="type">
                Input Contribution:
              </label>
              <Dropdown overlay={menu} placement="bottomLeft">
                <div
                  className="h-8 bg-white border flex items-center px-3 w-full"
                  st
                >
                  {selectedContribution && selectedContribution.name
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
                onChange={(e) =>
                  setNewContribution({
                    ...newContribution,
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
                placeholder="Pledge amount i.e 200 (optional)"
                onChange={(e) =>
                  setNewContribution({
                    ...newContribution,
                    pledge: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 px-4 text-white h-8 mb-0 font-medium"
            >
              ADD CONTRIBUTION
            </button>
          </div>
        </form>
      </Spin>
    </AdminLayout>
  );
};

export default NewContribution;
