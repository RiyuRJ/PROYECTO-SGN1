import { getToken } from '../auth/authService';

const API_URL = 'http://localhost:8080/sales/sales';

export const getSales = async () => {

    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.json();
};

export const createSale = async (sale) => {

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(sale)
    });

    return response.json();
};

export const updateSale = async (id, sale) => {

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(sale)
    });

    return response.json();
};

export const deleteSale = async (id) => {

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return response.json();
};