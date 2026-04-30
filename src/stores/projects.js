import { ref, watch, reactive } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'donenext-projects';

const defaultProjects = [
    { id: 1, name: 'buhot4et.ru', color: '#c60000' },
    { id: 2, name: 'crm.buhot4et.ru', color: '#1155cc' },
    { id: 3, name: 'admin.buhot4et.ru', color: '#c60000' },
    { id: 4, name: 'cetmolnia.ru', color: '#31107a' },
    { id: 5, name: 'buhcrm.ru', color: '#ff9900' },
    { id: 6, name: 'my.buhcrm.ru', color: '#ff9900' },
    { id: 7, name: 'tsn.buhcrm.ru', color: '#005e9c' },
    { id: 8, name: 'billing.buhcrm.ru', color: '#212529' },
];

function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultProjects;
}

export const useProjectsStore = defineStore('projects', () => {
    const state = reactive({
        projects: loadFromStorage(),
        loading: false,
    });

    watch(() => state.projects, (newValue) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    }, { deep: true });

    function loadProjects() {
        state.loading = false;
    }

    function addProject(name, color) {
        const maxId = state.projects.reduce((max, p) => Math.max(max, p.id), 0);
        state.projects.push({
            id: maxId + 1,
            name,
            color,
        });
    }

    function removeProject(id) {
        const idx = state.projects.findIndex(p => p.id === id);
        if (idx !== -1) {
            state.projects.splice(idx, 1);
        }
    }

    function updateProject(id, name, color) {
        const project = state.projects.find(p => p.id === Number(id));
        if (project) {
            project.name = name;
            project.color = color;
        }
    }

    return {
        get projects() {
            return state.projects;
        },
        get loading() {
            return state.loading;
        },
        loadProjects,
        addProject,
        removeProject,
        updateProject,
    };
});