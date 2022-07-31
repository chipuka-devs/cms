import React from "react";
import useContributions from "../../utils/hooks/useContributions";

export const IncomeStatement = () => {
  const { getGroupedExpenditures, getTotalGroupedContributions } =
    useContributions();

  const [income, setIncome] = React.useState({
    expenditures: getGroupedExpenditures(),
    contributions: getTotalGroupedContributions(),
  });

  React.useEffect(() => {
    const expenditures = getGroupedExpenditures();
    const contributions = getTotalGroupedContributions();

    setIncome({ expenditures, contributions });
  }, [getGroupedExpenditures, getTotalGroupedContributions]);

  let tCont = 0;
  let tDed = 0;
  let tBal = 0;

  return (
    <>
      {/* <pre>{JSON.stringify(groupedContributions)}</pre> */}

      <div className="w-10/12 bg-white p-5 mx-auto">
        {/* header */}
        <div className="">
          <div className="flex justify-center p-4">
            <span className="text-2xl font-bold uppercase text-gray-700">
              Income Statement
            </span>
          </div>
        </div>

        {/* table */}
        <table className="w-full">
          <thead className="">
            <tr className=" bg-[#002140] w-full text-base uppercase text-white font-normal">
              <th className="border-gray-100 border-[1px] p-2 w-6/12">Title</th>
              <th className="border-gray-100 border-[1px] p-2 ">
                Contributions
              </th>
              <th className="border-gray-100 border-[1px] p-2 ">
                Expenditures
              </th>
              <th className="border-gray-100 border-[1px] p-2 ">Balance</th>
            </tr>
          </thead>

          {/* <pre>{JSON.stringify(stmt)}</pre> */}
          <tbody>
            {income?.contributions?.map((stmt) => {
              const name = stmt?.name;
              const contributions = stmt.value ? stmt.value : 0;
              const d = income?.expenditures?.filter(
                (item) => item?.id === stmt?.id
              )[0];
              const deductions = d ? d.value : 0;
              const balance = parseInt(contributions) - parseInt(deductions);

              tCont += contributions;
              tDed += deductions;
              tBal += balance;

              return (
                <tr className=" w-full text-base text-black font-medium">
                  <td className="border-black border-[1px] p-2 w-6/12">
                    {name}
                  </td>
                  <td className="border-black border-[1px] p-2 ">
                    {contributions}
                  </td>
                  <td className="border-black border-[1px] p-2 ">
                    {deductions}
                  </td>
                  <td
                    className={`border-black border-[1px] p-2 ${
                      balance > 0 && "text-green-700"
                    }  ${balance < 0 && "text-red-700"}  ${
                      balance === 0 && "text-blue-600"
                    }   `}
                  >
                    {balance}
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="font-medium text-base">
              <td className="border-gray-100 font-bold border-[1px] p-2 text-white bg-[#002140]">
                TOTAL
              </td>
              <td className=" border-gray-100 text-white  bg-[#002140]  p-2 ">
                {tCont}
              </td>
              <td className="border-gray-100 text-white bg-[#002140] border-[1px] p-2 ">
                {tDed}
              </td>
              <td
                className={`border-gray-100 text-white bg-[#002140] border-[1px] p-2 `}
              >
                {tBal}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};
