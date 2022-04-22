import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout current="4" breadcrumbs={["ADMIN", "income-statement"]}>
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
              <th className="border-gray-100 border-[1px] p-2 ">Debit</th>
              <th className="border-gray-100 border-[1px] p-2 ">Credit</th>
            </tr>
          </thead>

          <tbody>
            {/* {income?.contributions?.map()} */}
            <tr className=" w-full text-base text-black font-medium">
              <td className="border-black border-[1px] p-2 w-6/12">
                Breakfast Contribution
              </td>
              <td className="border-black border-[1px] p-2 ">
                {income?.expenditures[0]?.value}
              </td>
              <td className="border-black border-[1px] p-2 ">
                {income?.contributions[0]?.value}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td className="border-black font-bold border-[1px] p-2 ">
                Total Contributions
              </td>
              <td className=" border-gray-100 text-white  bg-[#002140]  p-2 ">
                6000
              </td>
              <td className="border-gray-100 text-white bg-[#002140] border-[1px] p-2 ">
                8000
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </AdminLayout>
  );
};
