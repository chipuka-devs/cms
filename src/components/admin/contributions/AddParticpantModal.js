import { Input, Modal, Select } from "antd";
import React, { useContext } from "react";
import { Context } from "../../../utils/MainContext";

const AddParticpantModal = ({
  isModalVisible = "true",
  // handleOk,
  handleCancel,
  handleChange,
  participants,
  handleRemove,
}) => {
  const { allUsers } = useContext(Context);

  const [selected, setSelected] = React.useState("");

  return (
    <div>
      <>
        <Modal
          title="Add individual contribution participants"
          visible={isModalVisible}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <label className="font-medium" htmlFor="type">
            Add Participant
          </label>
          <div className="flex gap-2">
            <Select
              size={"md"}
              value={selected}
              placeholder={"--please select user to add--"}
              onChange={(user) => {
                handleChange(user);
                setSelected(user);
              }}
              className="flex-grow"
            >
              {allUsers.map((user) => (
                <Select.Option key={user?.id}>
                  {/* {i.toString(36) + i} */}
                  {user?.name}
                </Select.Option>
              ))}
            </Select>

            <button
              type="submit"
              className="bg-green-700 px-4 text-white h-8 mb-0"
              onClick={() => setSelected("")}
            >
              {"ADD "}
            </button>
          </div>

          <div className=" py-2">
            <span className="font-medium">Current participants</span>
            {participants?.map((p) => (
              <div className="flex gap-2 my-1">
                <Input
                  type="text"
                  disabled
                  placeholder="input contribution name "
                  // required
                  value={p}
                  // onChange={(e) => setState({ ...state, name: e.target.value })}
                />
                <button
                  type="submit"
                  className="bg-red-600 px-4 text-white h-8 mb-0"
                  onClick={() => handleRemove(p)}
                >
                  {"remove "}
                </button>
              </div>
            ))}
          </div>
        </Modal>
      </>
    </div>
  );
};

export default AddParticpantModal;
