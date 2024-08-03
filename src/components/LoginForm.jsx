import { Form, Field } from "react-final-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  // Función para manejar el envío del formulario.

  const onSubmit = async (values) => {
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      for (const error in errors) {
        toast.error(errors[error], { autoClose: 3000 });
      }
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, values);
      const token = response.data.token;
      localStorage.setItem("token", token);

      const userId = response.data.user._id;
      localStorage.setItem("userId", userId);

      const userName = response.data.user.username;
      localStorage.setItem("userName", userName);

      {
        response.data.user.role === "admin"
          ? navigate("/admin")
          : navigate("/home");
      }
    } catch (error) {
      console.error(
        "Error en el inicio de sesión:",
        error.response.data.message
      );
      toast.error(
        `Error en el inicio de sesión: ${error.response.data.message}`,
        { autoClose: 3000 }
      );
    }
  };

  // Función para validar los valores del formulario.

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Este campo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Correo electrónico inválido";
    }
    if (!values.password) {
      errors.password = "Este campo es obligatorio";
    }
    return errors;
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="container-md">
            <h2 className="text-center mb-4">Iniciar sesión</h2>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <Field
                name="email"
                component="input"
                type="email"
                className="form-control"
                placeholder="Ingresa tu correo electrónico"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <Field
                name="password"
                component="input"
                type="password"
                className="form-control"
                placeholder="Ingresa tu contraseña"
              />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-register mx-auto mb-3">
                Iniciar sesión
              </button>
            </div>
            <span>No tienes usuario? </span>
            <Link to="/register" className="link-login">
              Registrate aqui
            </Link>
          </form>
        )}
      />
    </>
  );
};

export default LoginForm;
