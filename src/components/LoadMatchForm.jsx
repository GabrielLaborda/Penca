import { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import axios from "axios";
import { format, parseISO } from "date-fns";

const LoadMatchesForm = () => {
  const [teams, setTeams] = useState([]);
  const [stadiums, setStadiums] = useState([]);
  const [token, setToken] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // useEffect para cargar el token y obtener equipos y estadios al montar el componente.

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }

    // Función asincrónica para obtener equipos y estadios de la API.

    const fetchData = async () => {
      try {
        const [teamsResponse, stadiumsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/teams`),
          axios.get(`${apiUrl}/api/stadiums`),
        ]);
        setTeams(teamsResponse.data);
        setStadiums(stadiumsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  // Función para manejar el envío del formulario.

  const onSubmit = async (values, form) => {
    try {
      const formattedDate = format(
        parseISO(values.date),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      );
      const matchData = {
        ...values,
        date: formattedDate,
      };

      const response = await axios.post(`${apiUrl}/api/matches`, matchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Partido cargado:", response.data);
      form.reset();
    } catch (error) {
      console.error(
        "Error cargando partido:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="container-md">
            <div className="mb-3">
              <label htmlFor="team1" className="form-label">
                Equipo 1
              </label>
              <Field name="team1" component="select" className="form-control">
                <option value="">Selecciona un equipo</option>
                {teams.map((team) => (
                  <option key={team._id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </Field>
            </div>
            <div className="mb-3">
              <label htmlFor="team2" className="form-label">
                Equipo 2
              </label>
              <Field name="team2" component="select" className="form-control">
                <option value="">Selecciona un equipo</option>
                {teams.map((team) => (
                  <option key={team._id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </Field>
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Fecha
              </label>
              <Field
                name="date"
                component="input"
                type="datetime-local"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="stadium" className="form-label">
                Estadio
              </label>
              <Field name="stadium" component="select" className="form-control">
                <option value="">Selecciona un estadio</option>
                {stadiums.map((stadium) => (
                  <option key={stadium._id} value={stadium.name}>
                    {stadium.name} ({stadium.location})
                  </option>
                ))}
              </Field>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-success">
                Cargar Partido
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
};

export default LoadMatchesForm;
