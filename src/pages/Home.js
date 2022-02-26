import { Divider, Spin } from "antd";
import { useState, useEffect, useContext } from "react";
import NormalLayout from "../components/NormalLayout";
import { Context } from "../utils/MainContext";
import { CustomTable } from "./admin/Admin";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";

const Home = () => {
  const [myContributions, setMyContributions] = useState();
  const [loading, setLoading] = useState(false);

  const { user } = useContext(Context);
  const uid = user && user.uid;

  const stopLoading = () => {
    setLoading(false);
  };

  const startLoading = (message) => {
    setLoading(true);
  };

  useEffect(() => {
    const fetchContributions = () => {
      startLoading("Fetching contributions . . .");
      const q = query(
        collection(db, "user_contributions"),
        where("uid", "==", uid)
      );

      onSnapshot(q, (docs) => {
        let uList = [];
        docs.forEach((d) => uList.push(d.data()));

        setMyContributions(uList[0]);
        stopLoading();
      });
    };

    fetchContributions();
  }, [uid, user]);

  const columns = [
    {
      title: "Contribution",
      dataIndex: "contribution",
      key: "contribution",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (_, c) => <span>{c.conts[0].date}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, c) => {
        const amount = c.conts
          .map((item) => item.amount)
          .reduce((prev, next) => prev + next);

        return <span>{amount}</span>;
      },
    },

    {
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      render: (_) => (
        <div className="flex gap-1">
          <button className="p-2 bg-blue-700 text-white">Edit</button>
        </div>
      ),
    },
  ];

  const tableData =
    myContributions &&
    myContributions.contributions &&
    myContributions.contributions;

  return (
    <NormalLayout>
      <div>
        <Divider>
          <span className="text-lg">{user.name} Contributions</span>
        </Divider>

        {/* {loading ? (
    <div>Loading . . .</div>
  ) : ( */}
        <Spin
          spinning={loading}
          size="large"
          tip={"Fetching your contributions . . ."}
        >
          <CustomTable
            cols={columns}
            rows={tableData}
            summary={{
              show: true,
              title: "Total Contributions (kshs):",
              amount: myContributions && myContributions.total,
            }}
          />
        </Spin>
        {/* )} */}
      </div>
    </NormalLayout>
  );
};

export default Home;
