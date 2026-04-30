const API_URL = 'http://localhost:3000/api';

// Базовая функция для запросов
async function fetchApi(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// Tasks API
export const tasks = {
    getByDate(date) {
        return fetchApi(`/tasks/${date}`);
    },

    create(date, title, project, project_color) {
        return fetchApi('/tasks', {
            method: 'POST',
            body: JSON.stringify({ date, title, project, project_color }),
        });
    },

    update(id, done) {
        return fetchApi(`/tasks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ done }),
        });
    },

    delete(id) {
        return fetchApi(`/tasks/${id}`, {
            method: 'DELETE',
        });
    },
};

// Notes API
export const notes = {
    getByDate(date) {
        return fetchApi(`/notes/${date}`);
    },

    save(date, text) {
        return fetchApi(`/notes/${date}`, {
            method: 'PUT',
            body: JSON.stringify({ text }),
        });
    },
};

// Projects API
export const projects = {
    getAll() {
        return fetchApi('/projects');
    },

    create(name, color) {
        return fetchApi('/projects', {
            method: 'POST',
            body: JSON.stringify({ name, color }),
        });
    },
};
