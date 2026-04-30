<script setup>
import { watch } from 'vue';

const props = defineProps({
    show: Boolean,
    title: {
        type: String,
        default: 'Подтверждение',
    },
    message: {
        type: String,
        default: 'Вы уверены?',
    },
    confirmText: {
        type: String,
        default: 'Удалить',
    },
});

const emit = defineEmits(['confirm', 'cancel']);

watch(() => props.show, (val) => {
    document.body.style.overflow = val ? 'hidden' : '';
});
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click="emit('cancel')">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <h3>{{ title }}</h3>
                </div>
                <div class="modal-body">
                    <p>{{ message }}</p>
                </div>
                <div class="modal-actions">
                    <button class="cancel-btn" @click="emit('cancel')">Отмена</button>
                    <button class="confirm-btn" @click="emit('confirm')">{{ confirmText }}</button>
                </div>
            </div>
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
    z-index: 200;
}

.modal {
    background: white;
    border-radius: 12px;
    width: 360px;
    padding: 24px;
}

.modal-header h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 16px 0;
}

.modal-body p {
    font-size: 15px;
    color: #555;
    margin: 0 0 20px 0;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.cancel-btn {
    padding: 10px 20px;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    color: #333;
}

.cancel-btn:hover {
    background: #eee;
}

.confirm-btn {
    padding: 10px 20px;
    background: #e53e3e;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
}

.confirm-btn:hover {
    background: #c53030;
}
</style>