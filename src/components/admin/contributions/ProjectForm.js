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
          placeholder="input target amount per month"
          value={state.target}
          onChange={(e) => setState({ ...state, target: e.target.value })}
        />
      </div>

      {/* duration */}
      <div className="">
        <label className="font-medium">Project Duration(in months):</label>
        {/* date  */}
        <Input
          type="number"
          placeholder="i.e. 3"
          value={state.duration}
          onChange={(e) => setState({ ...state, duration: e.target.value })}
        />
      </div>

      {/* Start Date */}
      <div className="">
        <label className="font-medium">Starting Date:</label>
        {/* date  */}
        <Input
          type="date"
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
          onChange={(e) =>
            setState({
              ...state,
              deadline: e.target.value,
            })
          }
        />
      </div>

      {/* amount per month */}
      <div className="">
        <label className="font-medium">Amount contributed per month:</label>
        {/* amount  */}
        <Input
          type="number"
          placeholder="i.e. 10000"
          value={state.amountPerMonth}
          onChange={(e) =>
            setState({ ...state, amountPerMonth: e.target.value })
          }
        />
      </div>
    </>
  );
};
