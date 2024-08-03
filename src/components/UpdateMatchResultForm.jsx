import { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import axios from "axios";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "./UpdateMatchResultForm.css";

const UpdateMatchResultForm = ({ match, token, fetchMatches }) => {
  const [teams, setTeams] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL;

  // useEffect llamada a la API para traer la informacion de los equipos.

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

  // Manejo del envío del formulario.

  const onSubmit = async (values) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/matches/${match._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Resultado actualizado:", response.data);
      fetchMatches(); // Refresh the matches list after updating
    } catch (error) {
      console.error(
        "Error actualizando el resultado:",
        error.response.data.message
      );
    }
  };

  // Formatear y capitalizar la fecha del partido.

  const formattedDate = format(new Date(match.matchDate), "eeee d 'de' MMMM", {
    locale: es,
  });

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const capitalizedDate = capitalizeFirstLetter(formattedDate);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        homeScore: match.homeScore,
        awayScore: match.awayScore,
      }}
      render={({ handleSubmit }) => (
        <div className="d-flex justify-content-center">
          <form onSubmit={handleSubmit} className="form-container">
            <h4 className="form-header">{capitalizedDate}</h4>
            <h6 className="stadium">{match.stadium}</h6>
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
              <div>
                <Field
                  name="homeScore"
                  component="input"
                  type="number"
                  className="form-control team-score"
                />
              </div>
              <span className="vs-text">Vs</span>
              <div className="d-flex justify-content-center align-items-center">
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
            </div>
            <button type="submit" className="btn update-button">
              Actualizar Resultado
            </button>
          </form>
        </div>
      )}
    />
  );
};

UpdateMatchResultForm.propTypes = {
  match: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    homeTeam: PropTypes.string.isRequired,
    awayTeam: PropTypes.string.isRequired,
    homeScore: PropTypes.number.isRequired,
    awayScore: PropTypes.number.isRequired,
    matchDate: PropTypes.string.isRequired,
    stadium: PropTypes.string.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
  fetchMatches: PropTypes.func.isRequired,
};

export default UpdateMatchResultForm;
