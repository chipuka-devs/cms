import { Input } from "antd";
import React from "react";

export const MonthlyForm = ({ state, setState }) => {
  return (
    <>
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
          Input Amount:
        </label>
        {/* amount  */}
        <Input
          type="number"
          placeholder="input target amount"
          value={state.amount}
          onChange={(e) => setState({ ...state, amount: e.target.value })}
        />
      </div>
    </>
  );
};
