import { useEffect, useState, useCallback } from "react";
import { Form, Field } from "react-final-form";
import axios from "axios";
import PropTypes from "prop-types";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./Pronostico.css";

function Pronostico({ token, userId }) {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [teams, setTeams] = useState({});
  const [stadiums, setStadiums] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [applyToAllGroups, setApplyToAllGroups] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState(null);
  const [currentPredictionValues, setCurrentPredictionValues] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL;

  // Cargar equipos al montar el componente.
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/teams`);
        const teamsData = response.data.reduce((acc, team) => {
          acc[team.name] = team.flagUrl;
          return acc;
        }, {});
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, [apiUrl]);

  // Cargar estadios al montar el componente.
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/stadiums`);
        setStadiums(response.data);
      } catch (error) {
        console.error("Error fetching the stadium data", error);
      }
    };
    fetchStadiums();
  }, [apiUrl]);

  // Cargar partidos.
  const fetchMatches = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/matches`);
      const now = new Date();
      const upcomingMatches = response.data.filter(
        (match) => new Date(match.matchDate) > now
      );
      setMatches(upcomingMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  }, [apiUrl]);

  // Cargar pronósticos del usuario.
  const fetchPredictions = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/prediction/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPredictions(response.data);
    } catch (error) {
      console.error(
        "Error obteniendo los pronósticos:",
        error.response?.data?.message
      );
    }
  }, [apiUrl, userId, token]);

  // Llamar a las funciones de carga de partidos y pronósticos al montar el componente.
  useEffect(() => {
    if (token) {
      fetchMatches();
      fetchPredictions();
    }
  }, [token, fetchMatches, fetchPredictions]);

  // Cargar grupos del usuario.
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/usergroups/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data);

        // Mostrar por defecto los pronosticos del grupo General.
        const generalGroup = response.data.find(
          (group) => group.name.toLowerCase() === "general"
        );
        if (generalGroup) {
          setSelectedGroup(generalGroup._id);
        } else {
          setSelectedGroup(response.data[0]?._id || "");
        }
      } catch (error) {
        console.error("Error fetching groups:", error.response?.data?.message);
      }
    };
    fetchGroups();
  }, [apiUrl, userId, token]);

  // Manejar la acción de guardar pronóstico.
  const handleSave = (values, matchId) => {
    // Verificar si los valores no están vacíos y son números válidos
    if (
      values.homeScore === undefined ||
      values.awayScore === undefined ||
      isNaN(values.homeScore) ||
      isNaN(values.awayScore)
    ) {
      return;
    }
    setCurrentMatchId(matchId);
    setCurrentPredictionValues(values);
    setShowModal(true);
  };

  // Confirmar el guardado del pronóstico.
  const handleConfirmSave = async () => {
    const data = {
      ...currentPredictionValues,
      userId: userId,
      matchId: currentMatchId,
      groupId: applyToAllGroups ? null : selectedGroup,
    };
    try {
      const response = await axios.put(`${apiUrl}/api/prediction/save`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(
        `Pronóstico guardado${applyToAllGroups ? " para todos los grupos" : ""}`
      );
      console.log("Resultado actualizado:", response.data);
      fetchPredictions(); // Refresh the predictions list after updating
      setShowModal(false);
    } catch (error) {
      toast.error(
        `Error actualizando el resultado: ${error.response?.data?.message}`
      );
      console.error(
        "Error actualizando el resultado:",
        error.response?.data?.message
      );
    }
  };

  // Función para capitalizar la primera letra de una cadena.
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Filtrar partidos con base en los pronósticos.
  const filteredMatches = matches.map((match) => {
    const prediction = predictions.find(
      (pred) =>
        pred.matchId &&
        pred.matchId._id === match._id &&
        pred.groupId === selectedGroup
    );

    return {
      match,
      prediction: prediction || {},
    };
  });

  return (
    <div>
      <h2 className="title mb-0">Realiza tu pronóstico</h2>
      <h2 className="title">
        Grupo{" "}
        {groups.find((group) => group._id === selectedGroup)?.name || "General"}
      </h2>
      <div className="group-select">
        <div className="group-select-form">
          <label htmlFor="group-select" className="select-groups-label">
            Seleccionar Grupo:
          </label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="select-input"
          >
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredMatches.map(({ match, prediction }) => {
        if (!match) {
          console.error("Match data is missing for prediction:", prediction);
          return null; // Skip rendering if match data is missing
        }
        const matchDate = new Date(match.matchDate);
        if (!isValid(matchDate)) {
          console.error("Invalid date:", match.matchDate);
          return null;
        }

        const formattedDate = format(matchDate, "eeee d 'de' MMMM", {
          locale: es,
        });
        const formattedTime = format(matchDate, "HH:mm");
        const capitalizedDate = capitalizeFirstLetter(formattedDate);

        const stadiumInfo = stadiums.find(
          (stadium) => stadium.name === match.stadium
        );

        return (
          <Form
            key={match._id}
            onSubmit={(values) => handleSave(values, match._id)}
            initialValues={{
              homeScore: prediction.homeScore,
              awayScore: prediction.awayScore,
            }}
            render={({ handleSubmit }) => (
              <div className="d-flex justify-content-center">
                <form onSubmit={handleSubmit} className="form-container">
                  <h4 className="form-header">{capitalizedDate}</h4>
                  <h5 className="timeMatch">{formattedTime}</h5>
                  <h6 className="stadium">{match.stadium}</h6>
                  {stadiumInfo ? (
                    <p className="stadium-info">
                      {`${stadiumInfo.location}, capacidad ${stadiumInfo.capacity}`}
                    </p>
                  ) : (
                    <p className="stadium-info">
                      Información del estadio no disponible
                    </p>
                  )}
                  <div className="team-container">
                    <div className="team">
                      {teams[match.homeTeam] && (
                        <img
                          src={teams[match.homeTeam]}
                          alt={`${match.homeTeam} flag`}
                          className="team-flag"
                        />
                      )}
                      <span className="team-name">{match.homeTeam}</span>
                    </div>
                    <Field
                      name="homeScore"
                      component="input"
                      type="number"
                      className="form-control team-score"
                    />
                    <span className="vs-text">Vs</span>
                    <Field
                      name="awayScore"
                      component="input"
                      type="number"
                      className="form-control team-score"
                    />
                    <div className="team">
                      {teams[match.awayTeam] && (
                        <img
                          src={teams[match.awayTeam]}
                          alt={`${match.awayTeam} flag`}
                          className="team-flag"
                        />
                      )}
                      <span className="team-name">{match.awayTeam}</span>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-pronostico">
                    Guardar Pronóstico
                  </button>
                </form>
              </div>
            )}
          />
        );
      })}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="text-black"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmación de Guardado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas guardar este pronóstico
          {applyToAllGroups
            ? " para todos los grupos"
            : ` para el grupo ${
                groups.find((group) => group._id === selectedGroup)?.name
              }`}
          ?
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="applyToAllGroups"
              checked={applyToAllGroups}
              onChange={() => setApplyToAllGroups(!applyToAllGroups)}
            />
            <label className="form-check-label" htmlFor="applyToAllGroups">
              Aplicar a todos los grupos
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmSave}>
            Confirmar
          </Button>
          <Button className="btn-cancel" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

Pronostico.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default Pronostico;
