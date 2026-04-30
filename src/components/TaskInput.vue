<script setup>
import { ref } from 'vue';
import { useProjectsStore } from '../stores/projects';

const emit = defineEmits(['add-task']);
const projectsStore = useProjectsStore();

const newTask = ref('');
const selectedProject = ref(null);
const error = ref('');

function handleAdd() {
    error.value = '';
    
    if (!newTask.value.trim()) {
        return;
    }
    
    if (!selectedProject.value) {
        error.value = 'Выберите проект';
        return;
    }

    emit('add-task', {
        title: newTask.value.trim(),
        project: selectedProject.value.name,
        project_color: selectedProject.value.color,
    });

    newTask.value = '';
    selectedProject.value = null;
}
</script>

<template>
    <div class="input-row">
        <input
            v-model="newTask"
            placeholder="Новая задача..."
            @keyup.enter="handleAdd"
            class="title-input"
            :class="{ error: error }"
        />

        <select v-model="selectedProject" class="project-select" :class="{ error: error }">
            <option :value="null" disabled>Укажите проект</option>
            <option
                v-for="project in projectsStore.projects"
                :key="project.id"
                :value="project"
            >
                {{ project.name }}
            </option>
        </select>

        <button @click="handleAdd" class="add-btn">+</button>
    </div>
    <p v-if="error" class="error-text">{{ error }}</p>
</template>

<style scoped>
.input-row {
    display: grid;
    grid-template-columns: 1fr 150px 40px;
    gap: 8px;
    margin-bottom: 8px;
}

.title-input {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.title-input:focus {
    outline: none;
    border-color: #4f46e5;
}

.title-input.error, .project-select.error {
    border-color: #e53e3e;
}

.project-select {
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background: white;
}

.add-btn {
    width: 40px;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.15s;
}

.add-btn:hover {
    background: #4338ca;
}

.error-text {
    color: #e53e3e;
    font-size: 13px;
    margin-bottom: 16px;
}
</style>