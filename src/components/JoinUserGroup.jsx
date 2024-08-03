import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function JoinUserGroup({ userId, token }) {
  const [code, setCode] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Función para manejar el envío del formulario solicitud POST para unirse a un grupo.
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        ` ${apiUrl}/api/usergroups/join`,
        { userId, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Bienvendio al grupo."), { autoClose: 3000 };
      console.log("Unido al grupo:", response.data);
    } catch (error) {
      console.error("Error uniéndose al grupo:", error.response?.data?.message);
      toast.error(
        `Error uniéndose al grupo: ${error.response?.data?.message}`,
        { autoClose: 3000 }
      );
    }
  };

  return (
    <>
      <h4 className="text-center">Únete a un grupo de penca</h4>
      <div className="container-user-groups">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código del grupo"
            required
            className="input-user-groups"
          />
          <button type="submit" className="btn btn-user-groups">
            Unirse al Grupo
          </button>
        </form>
      </div>
    </>
  );
}

JoinUserGroup.propTypes = {
  userId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default JoinUserGroup;
