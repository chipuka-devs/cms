import { Divider, Spin } from "antd";
import { useState, useEffect, useContext } from "react";
import NormalLayout from "../components/NormalLayout";
import { Context } from "../utils/MainContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";
import { CustomTable } from "../components/CustomTable";

const Home = () => {
  const [myContributions, setMyContributions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(Context);
  const { allUsers, allContributions } = useContext(Context);
  const [contributionNames, setContributionNames] = useState([]);

  const uid = user && user.uid;

  const stopLoading = () => {
    setLoading(false);
  };

  const startLoading = (message) => {
    setLoading(true);
  };

  useEffect(() => {
    let conts = [];
    allContributions &&
      allContributions.forEach((c) =>
        conts.push({ text: c.name, value: c.name })
      );

    setContributionNames(conts);
  }, [allContributions, allUsers]);

  useEffect(() => {
    const fetchContributions = () => {
      startLoading("Fetching contributions . . .");
      const q = query(
        collection(db, "user_contributions"),
        where("user", "==", uid)
      );

      onSnapshot(q, (docs) => {
        let uList = [];
        docs.forEach((d) => {
          // const currentUser = allUsers.filter(
          //   (item) => item.uid === d.data().user
          // )[0];
          const currentContribution = allContributions.filter(
            (item) => item.id === d.data().contribution
          )[0];

          //   cList.push(d.data());

          const contributionDetails = {
            key: d.id,
            date: d.data().doc,
            amount: d.data().amount,
            classification: currentContribution && currentContribution.category,
            purpose: currentContribution && currentContribution.name,
          };

          currentContribution && uList.push(contributionDetails);
        });

        setMyContributions(uList);
        stopLoading();
      });
    };

    fetchContributions();
  }, [allContributions, allUsers, uid, user]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      //   render: (text) => <Link to={"/"}>{text}</Link>,
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },

    {
      title: "Classification",
      dataIndex: "classification",
      //   key: "classification",
      filters: [
        { text: "Monthly", value: "monthly" },
        { text: "Project", value: "project" },
      ],
      onFilter: (value, record) => record.classification.startsWith(value),
    },

    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
      filters: [...contributionNames],
      onFilter: (value, record) => record.purpose.startsWith(value),
    },
  ];

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
          <CustomTable cols={columns} rows={myContributions} />
        </Spin>
        {/* )} */}
      </div>
    </NormalLayout>
  );
};

export default Home;
