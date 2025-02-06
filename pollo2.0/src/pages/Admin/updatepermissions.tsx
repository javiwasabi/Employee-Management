import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = "http://localhost:3001";

const UpdatePermissions: React.FC = () => {
    const [rut, setRut] = useState<string>('');
    const [permissions, setPermissions] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const [hasCreatePermission, setHasCreatePermission] = useState<boolean>(false);
    const navigate = useNavigate();

   
    const handleRutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRut(event.target.value);
    };


    const handlePermissionClick = (permission: string) => {
        setPermissions(prevPermissions => {
            if (!prevPermissions.includes(permission)) {
                return [...prevPermissions, permission];
            }
            return prevPermissions; 
        });
    };


    const handleUpdatePermissions = async () => {
        try {
            const response = await axios.put(`${BACKEND_URL}/users/update-permissions`, {
                rut: rut,
                permissions: permissions
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error al actualizar los permisos');
            console.error(error);
        }
    };

    

    return (
        <div className="bg-gradient-to-r from-gray-600 to-white min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full sm:w-96">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Actualizar permisos de usuario</h2>
                <div className="mb-4">
                    <label htmlFor="rut" className="block text-sm font-medium text-gray-600">RUT:</label>
                    <input
                        type="text"
                        id="rut"
                        value={rut}
                        onChange={handleRutChange}
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <h3 className="text-lg font-medium text-center text-gray-600 mt-6 mb-4">¿Qué permiso quieres agregarle al usuario?</h3>
                
                <div className="flex justify-center space-x-4 mb-6">
                    {["crear", "eliminar", "ver"].map(permission => (
                        <button
                            key={permission}
                            onClick={() => handlePermissionClick(permission)}
                            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
                        >
                            {permission}
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-700">Permisos seleccionados:</h4>
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                        {permissions.map(permission => (
                            <li key={permission}>{permission}</li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={handleUpdatePermissions}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
                >
                    Actualizar Permisos
                </button>

                {message && <p className="mt-4 text-center text-sm text-gray-500">{message}</p>}
            </div>
        </div>
    );
};

export default UpdatePermissions;
