import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './RecContra.css'; // Asegúrate de crear este archivo CSS

const RecContra = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar el correo de recuperación
        setMessage('Se ha enviado un correo de recuperación a ' + email);
        
        // Redirigir a otra página después de enviar el correo
        setTimeout(() => {
            history.push('/NuevaContra'); // Cambia '/otra-pagina' por la ruta deseada
        }, 2000); // Espera 2 segundos antes de redirigir
    };

    return (
        <div className="card-container">
            <div className="card">
                <h2>Recuperación de Contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Enviar</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default RecContra;