import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import UpdateMatchResultForm from "./UpdateMatchResultForm";
import LoadMatchesForm from "./LoadMatchForm";

const Admin = () => {
  const [matches, setMatches] = useState([]);
  const [token, setToken] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // useEffect para recuperar el token del localStorage al cargar el componente.

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Función para obtener los partidos desde el servidor.

  const fetchMatches = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/matches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMatches(response.data);
    } catch (error) {
      console.error("Error obteniendo partidos:", error.response.data.message);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    if (token) {
      fetchMatches();
    }
  }, [token, fetchMatches]);

  return (
    <div>
      <h2 className="text-center my-4">Cargar Partidos</h2>
      <LoadMatchesForm />
      <h2 className="text-center mb-4">Administrar Resultados de Partidos</h2>
      {matches.map((match) => (
        <UpdateMatchResultForm
          key={match._id}
          match={match}
          token={token}
          fetchMatches={fetchMatches}
        />
      ))}
    </div>
  );
};

export default Admin;
