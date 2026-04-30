<script setup>
import { ref, watch } from 'vue';
import { useProjectsStore } from '../stores/projects';
import ConfirmModal from './ConfirmModal.vue';

const props = defineProps({
    show: Boolean,
});

const emit = defineEmits(['close']);

watch(() => props.show, (val) => {
    document.body.style.overflow = val ? 'hidden' : '';
});

const store = useProjectsStore();

const newProjectName = ref('');
const newProjectColor = ref('#000000');
const editProjectId = ref(null);
const editName = ref('');
const editColor = ref('');

const showDeleteModal = ref(false);
const projectToDelete = ref(null);

function startEdit(project) {
    editName.value = project.name;
    editColor.value = project.color;
    editProjectId.value = project.id;
}

function saveEdit() {
    if (editProjectId.value) {
        store.updateProject(
            editProjectId.value,
            editName.value,
            editColor.value,
        );
    }
    cancelEdit();
}

function cancelEdit() {
    editProjectId.value = null;
    editName.value = '';
    editColor.value = '';
}

function confirmDelete(id) {
    projectToDelete.value = id;
    showDeleteModal.value = true;
}

function handleDelete() {
    if (projectToDelete.value) {
        store.removeProject(projectToDelete.value);
    }
    showDeleteModal.value = false;
    projectToDelete.value = null;
}

function cancelDelete() {
    showDeleteModal.value = false;
    projectToDelete.value = null;
}

function addProject() {
    if (newProjectName.value.trim()) {
        store.addProject(newProjectName.value.trim(), newProjectColor.value);
        newProjectName.value = '';
        newProjectColor.value = '#000000';
    }
}
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click="emit('close')">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <h3>Проекты</h3>
                    <button class="close-btn" @click="emit('close')">✕</button>
                </div>

                <div class="add-project">
                    <input
                        v-model="newProjectName"
                        placeholder="Название проекта"
                        class="name-input"
                    />
                    <input
                        v-model="newProjectColor"
                        type="text"
                        placeholder="#000000"
                        class="color-input"
                    />
                    <input
                        type="color"
                        :value="newProjectColor"
                        @input="newProjectColor = $event.target.value"
                        class="color-picker"
                    />
                    <button @click="addProject" class="add-btn">+</button>
                </div>

                <div class="projects-list">
                    <div
                        v-for="project in store.projects"
                        :key="project.id"
                        class="project-item"
                        :class="{ 'edit-mode': editProjectId === project.id }"
                    >
                        <template v-if="editProjectId === project.id">
                            <input v-model="editName" class="edit-name" />
                            <input
                                v-model="editColor"
                                type="text"
                                class="edit-color"
                            />
                            <input
                                type="color"
                                :value="editColor"
                                @input="editColor = $event.target.value"
                                class="color-picker"
                            />
                            <button @click="saveEdit" class="save-btn">
                                ✓
                            </button>
                            <button @click="cancelEdit" class="cancel-btn">
                                ✕
                            </button>
                        </template>
                        <template v-else>
                            <span
                                class="color-dot"
                                :style="{ background: project.color }"
                            ></span>
                            <span class="project-name">{{ project.name }}</span>
                            <button
                                @click="startEdit(project)"
                                class="edit-btn"
                            >
                                ✎
                            </button>
                            <button
                                @click="confirmDelete(project.id)"
                                class="delete-btn"
                            >
                                ✕
                            </button>
                        </template>
                    </div>
                </div>
            </div>

            <ConfirmModal
                :show="showDeleteModal"
                title="Удаление проекта"
                message="Вы уверены, что хотите удалить этот проект? Все задачи с этим проектом станут без проекта."
                @confirm="handleDelete"
                @cancel="cancelDelete"
            />
        </div>
    </Teleport>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.modal {
    background: white;
    border-radius: 12px;
    width: 600px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
}

.modal-header h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.close-btn {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;
    padding: 4px 8px;
}

.close-btn:hover {
    color: #333;
}

.add-project {
    display: flex;
    gap: 12px;
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    align-items: center;
}

.name-input {
    flex: 1;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
}

.name-input:focus {
    outline: none;
    border-color: #4f46e5;
}

.color-input {
    width: 90px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 15px;
    font-family: monospace;
}

.color-input:focus {
    outline: none;
    border-color: #4f46e5;
}

.color-picker {
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
}

.edit-mode .color-picker {
    width: 30px;
    height: 30px;
}

.add-btn {
    width: 40px;
    height: 40px;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 22px;
    cursor: pointer;
}

.add-btn:hover {
    background: #4338ca;
}

.projects-list {
    overflow-y: auto;
    padding: 12px 0;
    max-height: 400px;
}

.project-item {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 10px 24px;
    border-bottom: 1px solid #f5f5f5;
    height: 52px;
    box-sizing: border-box;
    overflow: hidden;
}

.project-item.edit-mode {
    height: 52px;
    min-height: 52px;
    overflow: visible;
}

.project-item:last-child {
    border-bottom: none;
}

.color-dot {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    flex-shrink: 0;
}

.project-name {
    flex: 1;
    font-size: 16px;
}

.edit-btn,
.delete-btn,
.save-btn,
.cancel-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    padding: 8px 10px;
    color: #999;
    min-width: 32px;
}

.edit-btn:hover {
    color: #4f46e5;
}

.delete-btn:hover {
    color: #e53e3e;
}

.save-btn {
    color: #4f46e5;
    font-size: 22px;
}

.cancel-btn {
    color: #e53e3e;
    font-size: 22px;
}

.edit-name {
    flex: 1;
    padding: 4px 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    margin: 0;
    height: 28px;
    box-sizing: border-box;
}

.edit-name:focus {
    outline: none;
    border-color: #4f46e5;
}

.edit-color {
    width: 80px;
    padding: 4px 6px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    font-family: monospace;
    height: 28px;
    box-sizing: border-box;
}

.edit-color:focus {
    outline: none;
    border-color: #4f46e5;
}
</style>
