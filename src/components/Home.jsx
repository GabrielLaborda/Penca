import { useEffect, useState } from "react";
import Pronostico from "./Pronostico";
import FinishedGames from "./FinishedGames";
import Ranking from "./Ranking";
import UserGroups from "./UserGroups";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./Home.css";
import { FaChartLine } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import axios from "axios";
import Instruction from "./Instructions";
import Rules from "./Rules";

const Home = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  // useEffect para obtener el token y userId del localStorage al cargar el componente.

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("userId");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUserId(savedUser);
    }
  }, []);

  // useEffect para obtener los grupos de usuario cuando el token esté disponible.

  useEffect(() => {
    if (token) {
      const fetchGroups = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/api/usergroups/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setGroups(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching groups:", error);
          setLoading(false);
        }
      };
      fetchGroups();
    }
  }, [apiUrl, token, userId]);

  if (!token || !userId || loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Tabs
        defaultActiveKey="Pronostico"
        id="fill-tab-example"
        className="mb-3 tabs custom-tabs"
        fill
      >
        <Tab
          eventKey="Pronostico"
          title={
            <>
              <FaChartLine />
            </>
          }
        >
          <Pronostico token={token} userId={userId} />
        </Tab>
        <Tab
          eventKey="Finalizados"
          title={
            <>
              <FaCheckCircle />
            </>
          }
        >
          <FinishedGames token={token} userId={userId} />
        </Tab>
        <Tab
          eventKey="Ranking"
          title={
            <>
              <FaTrophy />
            </>
          }
        >
          <Ranking token={token} groups={groups} />
        </Tab>
        <Tab
          eventKey="Grupos"
          title={
            <>
              <FaUsers />
            </>
          }
        >
          <UserGroups token={token} userId={userId} />
        </Tab>
      </Tabs>
      <Instruction />
      <Rules />
    </>
  );
};

export default Home;
