import { Form, Field } from "react-final-form";
import axios from "axios";
import "./RegisterForm.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  // Función de validación para los campos del formulario.

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Este campo es obligatorio";
    }
    if (!values.email) {
      errors.email = "Este campo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Correo electrónico inválido";
    }
    if (!values.password) {
      errors.password = "Este campo es obligatorio";
    } else if (values.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    return errors;
  };

  // Función de envío del formulario.

  const onSubmit = async (values, form) => {
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      for (const error in errors) {
        toast.error(errors[error]), { autoClose: 3000 };
      }
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/users`, values);
      console.log(response.data);

      toast.success("Registro exitoso"), { autoClose: 3000 };
      form.reset();
      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error.response.data.message);
      toast.error(`Error en el registro: ${error.response.data.message}`),
        { autoClose: 3000 };
    }
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="container-md">
            <h2 className="text-center mb-4">Registro</h2>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nombre de usuario
              </label>
              <Field
                name="username"
                component="input"
                type="text"
                className="form-control"
                placeholder="Ingresa tu nombre"
              />
            </div>

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
                placeholder="Ingresa una contraseña de 6 o mas digitos"
              />
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-register mx-auto mb-3">
                Registrarse
              </button>
            </div>
            <Link to="/" className="link-register">
              Volver a Iniciar Sesion
            </Link>
          </form>
        )}
      />
    </>
  );
};

export default RegisterForm;
