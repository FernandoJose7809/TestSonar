export const fetchPermisos = async () => {
    const response = await fetch(`${Apiurl}permisos/`, {
    headers: {
        'Authorization': `Token ${localStorage.getItem('token')}`
    }
    });
    return response.json();
};  