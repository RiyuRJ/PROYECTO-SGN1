import { authFetch } from '../auth/authService';

const API = 'http://localhost:8080';

/* GET PRODUCTS */

export const getProducts = async () => {

    const response = await authFetch(
        `${API}/products/products`
    );

    return response.json();
};

/* CREATE PRODUCT */

export const createProduct = async (product) => {

    const response = await authFetch(

        `${API}/products/products`,

        {
            method: 'POST',

            body: JSON.stringify(product)
        }
    );

    return response.json();
};

/* UPDATE PRODUCT */

export const updateProduct = async (id, product) => {

    const response = await authFetch(

        `${API}/products/products/${id}`,

        {
            method: 'PUT',

            body: JSON.stringify(product)
        }
    );

    return response.json();
};

/* DELETE PRODUCT */

export const deleteProduct = async (id) => {

    const response = await authFetch(

        `${API}/products/products/${id}`,

        {
            method: 'DELETE'
        }
    );

    return response.json();
};