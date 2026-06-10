const API = 'http://localhost:8080';

/* LOGIN */

export const login = async (email, password) => {

    const response = await fetch(`${API}/auth/login`, {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    return response.json();
};

/* SAVE TOKEN */

export const saveToken = (token, role, email) => {

    localStorage.setItem('token', token);

    localStorage.setItem('role', role);

    localStorage.setItem('email', email);

    const expiration = new Date().getTime() + (60 * 60 * 1000);

    localStorage.setItem('token_expiration', expiration);
};

export const getRole = () => {

    return localStorage.getItem('role');
};

export const getEmail = () => {

    return localStorage.getItem('email');
};

/* GET TOKEN */

export const getToken = () => {

    const token = localStorage.getItem('token');

    const expiration = localStorage.getItem('token_expiration');

    if(!token || !expiration){

        return null;
    }

    const now = new Date().getTime();

    if(now > expiration){

        logout();

        return null;
    }

    return token;
};

/* AUTH TOKEN */
export const authFetch = async (url, options = {}) => {

    const token = getToken();

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    return fetch(url, {
        ...options,
        headers
    });
};

/* LOGOUT */

export const logout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('role');

    localStorage.removeItem('email');

    localStorage.removeItem('token_expiration');
};