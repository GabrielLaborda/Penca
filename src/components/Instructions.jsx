import { useState } from "react";
import "./Instructions.css";

const Instruction = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  return (
    <div className="instrucciones">
      <h3 onClick={toggleInstructions} className="instructions-title">
        Manual de Instrucciones
      </h3>
      {showInstructions && (
        <div className="instructions-content">
          <h6>
            <strong>¡Bienvenido a la Penca de Fútbol!</strong>
          </h6>

          <h4>1. Registro y Acceso</h4>
          <p>
            <strong>Registro de Usuario:</strong>
            <br />
            Dirígete a la página de registro y proporciona tu información
            básica, como nombre, correo electrónico y una contraseña. Una vez
            registrado, dirígete a la página de inicio de sesión para ingresar
            con tu correo electrónico y contraseña.
          </p>
          <p>
            <strong>Inicio de Sesión:</strong>
            <br />
            Accede a la aplicación utilizando tu correo electrónico y
            contraseña.
          </p>

          <h4>2. Navegación por la Aplicación</h4>
          <p>
            <strong>Página Principal:</strong>
            <br />
            En la página principal, encontrarás cuatro pestañas principales:{" "}
            <strong>Pronóstico</strong>, <strong>Partidos Finalizados</strong>,{" "}
            <strong>Ranking</strong> y <strong>Grupos</strong>.
          </p>
          <p>
            <strong>Pronóstico:</strong>
            <br />
            Aquí podrás hacer tus predicciones para los partidos futuros.
            Selecciona el grupo en el que deseas realizar la predicción (por
            defecto, el grupo General). Introduce el puntaje que crees que
            tendrá el equipo local y el visitante. Haz clic en Guardar
            Pronóstico para registrar tus predicciones. Se abrirá una ventana de
            confirmación donde puedes decidir si deseas aplicar la predicción
            solo al grupo seleccionado o a todos los grupos.
          </p>
          <p>
            <strong>Partidos Finalizados:</strong>
            <br />
            Consulta los resultados de los partidos que ya se han jugado. Puedes
            revisar los puntajes finales y comparar tus predicciones con los
            resultados reales.
          </p>
          <p>
            <strong>Ranking:</strong>
            <br />
            Consulta el ranking de los usuarios en cada grupo. Al seleccionar un
            grupo, podrás ver el ranking actualizado de los usuarios y sus
            puntajes. Al hacer clic en un usuario, se mostrará una ventana con
            los detalles de sus predicciones y puntajes por partido.
          </p>
          <p>
            <strong>Grupos:</strong>
            <br />
            Visualiza los grupos a los que estás unido o que has creado.
          </p>
        </div>
      )}
    </div>
  );
};

export default Instruction;
