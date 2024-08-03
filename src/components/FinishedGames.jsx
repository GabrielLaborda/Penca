import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Form, Field } from "react-final-form";
import { Table } from "react-bootstrap";
import "./FinishedGames.css";

const FinishedGames = ({ token, userId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // useEffect para obtener los grupos de usuario al cargar el componente.

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/usergroups/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data);
        setSelectedGroup(response.data.length > 0 ? response.data[0]._id : ""); // Set default group
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };

    fetchGroups();
  }, [apiUrl, token, userId]);

  // useEffect para obtener los resultados de los partidos cuando se selecciona un grupo.

  useEffect(() => {
    if (!selectedGroup) return;

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/prediction/results/${userId}?groupId=${selectedGroup}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError(err.response?.data?.message || "Error fetching results");
        setLoading(false);
      }
    };

    fetchResults();
  }, [apiUrl, token, userId, selectedGroup]);

  // Calcular el total de puntos obtenidos.

  const totalPoints = results.reduce((sum, res) => sum + res.points, 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Manejar el cambio de grupo seleccionado.

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  return (
    <>
      <h2 className="text-center title">Partidos Finalizados</h2>
      <div className="d-flex justify-content-center">
        <Form
          onSubmit={() => {}}
          render={({ form }) => (
            <div className="group-select-form">
              <label htmlFor="group-select" className="select-groups-label">
                Seleccionar Grupo:
              </label>
              <Field
                name="groupSelect"
                component="select"
                value={selectedGroup}
                onChange={(e) => {
                  handleGroupChange(e);
                  form.change("groupSelect", e.target.value);
                }}
                className="select-input"
              >
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.name}
                  </option>
                ))}
              </Field>
            </div>
          )}
        />
      </div>

      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>Partido</th>
            <th>Pronóstico</th>
            <th>Resultado</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.prediction._id}>
              <td>
                {result.match.homeTeam} vs {result.match.awayTeam}
              </td>
              <td>
                {result.prediction.homeScore} - {result.prediction.awayScore}
              </td>
              <td>
                {result.match.homeScore} - {result.match.awayScore}
              </td>
              <td>{result.points}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center">
        <span className="puntosTotales">Puntos Totales: {totalPoints}</span>
      </div>
    </>
  );
};

FinishedGames.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default FinishedGames;
