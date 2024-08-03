import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateUserGroup.css";

function CreateUserGroup({ userId, token }) {
  const [name, setName] = useState("");
  const [userGroups, setUserGroups] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  // useEffect para obtener los grupos que administra el usuario al cargar el componente
  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/usergroups/admin/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Almacenar los grupos en el estado
        setUserGroups(response.data);
      } catch (error) {
        console.error(
          "Error obteniendo los grupos:",
          error.response?.data?.message
        );
        toast.error(
          `Error obteniendo los grupos: ${error.response?.data?.message}`,
          { autoClose: 3000 }
        );
      }
    };

    fetchUserGroups();
  }, [apiUrl, userId, token]);

  // Envío del formulario para crear un nuevo grupo.
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/api/usergroups/create`,
        { name, adminId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Grupo creado"), { autoClose: 3000 };
      setUserGroups((prevGroups) => [...prevGroups, response.data]);
    } catch (error) {
      console.error("Error creando el grupo:", error.response?.data?.message);
      toast.error(`Error creando el grupo: ${error.response?.data?.message}`, {
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <h4 className="create-groups-title">Crea tu grupo de penca</h4>
      <div className="container-user-groups">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del grupo"
            required
            className="input-user-groups"
          />
          <button type="submit" className="btn btn-user-groups">
            Crear Grupo
          </button>
        </form>
      </div>
      {userGroups.length > 0 && (
        <>
          <h5 className="text-center">Grupos que administras</h5>
          <div className="container-table">
            <Table striped bordered hover className="mb-5 table-admin-group">
              <thead>
                <tr>
                  <th>Nombre del grupo</th>
                  <th>Código</th>
                </tr>
              </thead>
              <tbody>
                {userGroups.map((group) => (
                  <tr key={group._id}>
                    <td>{group.name}</td>
                    <td>{group.code}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}

CreateUserGroup.propTypes = {
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default CreateUserGroup;
