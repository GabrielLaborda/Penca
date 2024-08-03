import { useState } from "react";
import "./Rules.css";

const Rules = () => {
  const [showRules, setShowRules] = useState(false);

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <div className="rules">
      <h3 onClick={toggleRules} className="rules-title">
        Reglas
      </h3>
      {showRules && (
        <div className="rules-content">
          <p>
            Los puntos se calculan con el resultado de los 90 minutos más el
            tiempo de descuento. No se incluye la prórroga ni los penales.
          </p>
          <h6>
            Los puntajes se acreditan en base a los siguientes resultados:
          </h6>
          <p>
            <strong>Resultado exacto:</strong> 6 puntos.
          </p>
          <p>
            <strong>
              Acierto del ganador + acierto de goles de un equipo:
            </strong>
            4 puntos.
          </p>
          <p>
            <strong>Acierto del ganador o empate sin acierto de goles:</strong>{" "}
            3 puntos.
          </p>
          <p>
            <strong>Acierto de goles de un equipo:</strong> 1 punto.
          </p>
          <p>
            <strong>
              No acierto del ganador ni empate y no acierto de goles de ningún
              equipo:
            </strong>{" "}
            0 puntos.
          </p>
        </div>
      )}
    </div>
  );
};

export default Rules;
