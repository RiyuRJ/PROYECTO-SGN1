import { getToken } from '../auth/authService';

const API_URL = 'http://localhost:8080/users/users';

export const getUsers = async () => {

    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.json();
};

export const createUser = async (user) => {

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(user)
    });

    return response.json();
};

export const updateUser = async (id, user) => {

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(user)
    });

    return response.json();
};

export const deleteUser = async (id) => {

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.json();
};