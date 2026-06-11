import { getToken } from '../auth/authService';

const API_URL = 'http://localhost:8080/clients/clients';

export const getClients = async () => {

    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.json();
};

export const createClient = async (client) => {

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(client)
    });

    return response.json();
};

export const updateClient = async (id, client) => {

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(client)
    });

    return response.json();
};

export const deleteClient = async (id) => {

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.json();
};