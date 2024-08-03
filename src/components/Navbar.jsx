import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  // Funcion para cerrar sesión.

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <>
      <div className="navBar text-center">
        <img
          className="navBarLogo img-fluid my-3"
          src="./img/Logo.png"
          alt="logo"
        />
        {userName && (
          <div className="navBarUser">
            <span>{userName}, ¡te damos la bienvenida!</span>
            <button className="btn btn-logout ms-3" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
