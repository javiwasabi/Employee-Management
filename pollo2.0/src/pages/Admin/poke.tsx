import React, { useState } from 'react';
import axios from 'axios';

// Definir los tipos para los usuarios
interface User {
  rut: string;
  apellidos: string;
  nombres: string;
  cargo: string;
  FeriadoLegal?: number;
  DiasAdministrativos?: number;
  HorasCompensatorias?: number;
}
const PokemonCard: React.FC = () => {

  const [rut, setRut] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nombres, setNombres] = useState('');
  const [cargo, setCargo] = useState('');
  const [feriadoLegal, setFeriadoLegal] = useState<number>(0);
  const [diasAdministrativos, setDiasAdministrativos] = useState<number>(0);
  const [horasCompensatorias, setHorasCompensatorias] = useState<number>(0);

  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: User = {
      rut,
      apellidos,
      nombres,
      cargo,
      FeriadoLegal: feriadoLegal,
      DiasAdministrativos: diasAdministrativos,
      HorasCompensatorias: horasCompensatorias,
    };

    try {
      const response = await axios.post('http://localhost:3001/users', newUser);
      setSuccessMessage(`User created: ${response.data.user.rut}`);
      setError('');
    } catch (err: any) {
      setError(err.response ? err.response.data.message : 'Error al crear el usuario');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rut:</label>
          <input
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Apellidos:</label>
          <input
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nombres:</label>
          <input
            type="text"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cargo:</label>
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feriado Legal:</label>
          <input
            type="number"
            value={feriadoLegal}
            onChange={(e) => setFeriadoLegal(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Días Administrativos:</label>
          <input
            type="number"
            value={diasAdministrativos}
            onChange={(e) => setDiasAdministrativos(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Horas Compensatorias:</label>
          <input
            type="number"
            value={horasCompensatorias}
            onChange={(e) => setHorasCompensatorias(Number(e.target.value))}
          />
        </div>
        <button type="submit">Add User</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default PokemonCard;
