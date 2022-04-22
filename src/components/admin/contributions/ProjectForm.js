import { Input } from "antd";
import React from "react";

/**
 *
 * @returns
 * name:
 * target
 * startDate
 * deadline
 * duration
 * monthlyAmount
 */

export const ProjectForm = ({ state, setState }) => {
  return (
    <>
      {/* contribution name: */}
      <div className="">
        <label className="font-medium">Input Contrubution name:</label>
        {/* amount  */}
        <Input
          type="text"
          placeholder="input contribution name "
          required
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
      </div>

      {/* Target amount */}
      <div className="">
        <label className="font-medium">Target Amount:</label>
        {/* amount  */}
        <Input
          type="number"
          required
          placeholder="input target amount per month"
          value={state.target}
          onChange={(e) => setState({ ...state, target: e.target.value })}
        />
      </div>

      {/* Start Date */}
      <div className="">
        <label className="font-medium">Starting Date:</label>
        {/* date  */}
        <Input
          type="date"
          required
          placeholder="select the starting day"
          value={state.startDate}
          onChange={(e) =>
            setState({
              ...state,
              startDate: e.target.value,
            })
          }
        />
      </div>

      {/* deadline */}
      <div className="">
        <label className="font-medium">Deadline:</label>
        {/* date  */}
        <Input
          type="date"
          placeholder="select the deadline"
          value={state.deadline}
          required
          onChange={(e) =>
            setState({
              ...state,
              deadline: e.target.value,
            })
          }
        />
      </div>
    </>
  );
};
