import { Dropdown, Input, Menu } from "antd";
import React, { useState } from "react";
import AddParticpantModal from "./AddParticpantModal";

export const MonthlyIndividualForm = ({
  state,
  setState,
  individualParticipants,
  setIndividualParticipants,
}) => {
  const [showModal, setShowModal] = useState(false);

  // const [individualParticipants, setIndividualParticipants] = useState([]);

  const handleParticipantsChange = (pId) => {
    if (!individualParticipants.includes(pId)) {
      setIndividualParticipants((prev) => [...prev, pId]);
    }
  };

  const handleRemoveParticipant = (participant) => {
    const newArr = individualParticipants?.filter(
      (item) => item !== participant
    );
    setIndividualParticipants(newArr);
  };

  const participants = (
    <Menu>
      {individualParticipants.map((item, i) => (
        <Menu.Item key={i}>
          <span target="_blank" rel="noopener noreferrer">
            {item}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <>
      <AddParticpantModal
        isModalVisible={showModal}
        handleOk={() => {}}
        handleCancel={() => setShowModal(false)}
        handleChange={handleParticipantsChange}
        participants={individualParticipants}
        handleRemove={handleRemoveParticipant}
      />
      {/* contribution category: */}
      <div className="">
        <label className="font-medium" htmlFor="type">
          Input Contrubution name:
        </label>
        {/* amount  */}
        <Input
          type="text"
          placeholder="input contribution name "
          required
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
      </div>

      <div className="">
        <label className="font-medium" htmlFor="type">
          Input amount per person:
        </label>
        {/* amount  */}
        <Input
          type="number"
          placeholder="input target amount"
          value={state.amount}
          onChange={(e) => setState({ ...state, amount: e.target.value })}
        />
      </div>

      <div className="">
        <label className="font-medium" htmlFor="type">
          Active Participants
        </label>
        {/* amount  */}
        <div className="flex gap-1 flex-wrap">
          <Dropdown overlay={participants} placement="bottomLeft">
            <div
              className="h-8 bg-white border flex items-center px-3"
              style={{ width: "300px" }}
            >
              Active Participants: {individualParticipants?.length} (hover to
              view)
            </div>
          </Dropdown>

          <button
            type="button"
            className="border text-sm overflow-hidden border-green-700 hover:bg-green-700 px-4 text-green-700 hover:text-white h-8 mb-0"
            onClick={() => setShowModal(true)}
          >
            Add participant
          </button>
        </div>
      </div>
    </>
  );
};
