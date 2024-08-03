import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form, Field } from "react-final-form";
import "./Ranking.css";

const Ranking = ({ token, groups }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPredictions, setUserPredictions] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL;

  // useEffect para establecer el grupo inicial cuando se carga el componente.

  useEffect(() => {
    if (groups.length > 0) {
      const initialGroup =
        groups.find((group) => group.name === "General")?._id || groups[0]._id;
      setSelectedGroup(initialGroup);
    }
  }, [groups]);

  // Función para obtener el ranking de usuarios para un grupo específico.

  const fetchRanking = useCallback(
    async (groupId) => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/prediction/ranking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { groupId },
        });
        const allData = response.data;

        // Filtrar usuarios que pertenecen al grupo seleccionado
        const groupMembers =
          groups.find((group) => group._id === groupId)?.members || [];
        const filteredRanking = allData.filter(
          (data) => groupMembers.includes(data.userId) && data.user !== "Admin"
        );

        setRanking(filteredRanking);
        setError(null);
      } catch (err) {
        console.error("Error fetching ranking:", err);
        setError(err.response?.data?.message || "Error fetching ranking");
      } finally {
        setLoading(false);
      }
    },
    [apiUrl, token, groups]
  );

  // Efecto para cargar el ranking cuando cambia el grupo seleccionado.

  useEffect(() => {
    if (selectedGroup) {
      fetchRanking(selectedGroup);
    }
  }, [selectedGroup, fetchRanking]);

  // Maneja el cambio de grupo en el formulario de selección.

  const handleGroupChange = (e) => {
    const newGroupId = e.target.value;
    setSelectedGroup(newGroupId);
  };

  // Maneja el clic en un usuario para abrir el modal con sus predicciones.

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserPredictions(user.userId, selectedGroup);
    setModalShow(true);
  };

  // Función para obtener las predicciones de un usuario para un grupo específico.

  const fetchUserPredictions = async (userId, groupId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/prediction/${userId}`, {
        params: { groupId },
      });
      const predictions = response.data;

      const now = new Date();

      const filteredPredictions = predictions.filter((prediction) => {
        const matchDate = new Date(prediction.matchId.matchDate);
        return matchDate < now;
      });

      setUserPredictions(filteredPredictions);
      const totalPoints = filteredPredictions.reduce(
        (sum, prediction) => sum + prediction.points,
        0
      );
      setTotalPoints(totalPoints);
    } catch (error) {
      console.error("Error fetching user predictions:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <h2 className="text-center title">Ranking</h2>
      <div className="d-flex justify-content-center">
        <Form
          initialValues={{ groupSelect: selectedGroup }}
          onSubmit={() => {}}
          render={({ form, values }) => (
            <div className="group-selection-form">
              <label htmlFor="group-select" className="select-groups-label">
                Seleccionar Grupo:
              </label>
              <Field
                name="groupSelect"
                component="select"
                value={values.groupSelect}
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
      <Table striped bordered hover className="text-center table">
        <thead>
          <tr>
            <th>Posicion</th>
            <th>Participante</th>
            <th>Puntos Totales</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((user, index) => (
            <tr key={index} onClick={() => handleUserClick(user)}>
              <td>{index + 1}</td>
              <td className="text-start">{user.user}</td>
              <td>{user.totalPoints}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        className="text-black"
      >
        <Modal.Header closeButton>
          <Modal.Title>Predicciones de {selectedUser?.user}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover className="text-center modal-table">
            <thead>
              <tr>
                <th>Partido</th>
                <th>Pronóstico</th>
                <th>Resultado Real</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {userPredictions
                .filter((prediction) => prediction.matchId) // Filtrar predicciones con matchId definido
                .map((prediction) => (
                  <tr key={prediction._id}>
                    <td>
                      {prediction.matchId.homeTeam} vs{" "}
                      {prediction.matchId.awayTeam}
                    </td>
                    <td>
                      {prediction.homeScore} - {prediction.awayScore}
                    </td>
                    <td>
                      {prediction.matchId.homeScore} -{" "}
                      {prediction.matchId.awayScore}
                    </td>
                    <td>{prediction.points}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <div className="total-points">
            <strong>Total de puntos: {totalPoints}</strong>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Ranking.propTypes = {
  token: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired,
};

export default Ranking;
