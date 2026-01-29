/**
 * モーダル操作モジュール
 */

import { COLORS } from '../config.js';
import {
    getTasks, setTasks,
    getEditingTaskId, setEditingTaskId,
    addTask, updateTask, removeTask, findTask
} from '../state.js';
import { getElements } from '../elements.js';
import { generateId, timeToMinutes, getNextAutoColor, formatTimeRange, escapeHtml } from '../utils.js';
import { saveTasks } from '../storage.js';

// レンダリング関数への参照（循環依存回避のため後から設定）
let renderCallback = null;

export function setRenderCallback(callback) {
    renderCallback = callback;
}

/**
 * カラーピッカーを生成
 */
function generateColorPicker(selectedColor = null) {
    const elements = getElements();

    elements.colorPicker.innerHTML = `
        <div class="color-option auto ${!selectedColor ? 'selected' : ''}" data-color="auto" title="自動"></div>
        ${COLORS.map(color => `
            <div class="color-option ${selectedColor === color ? 'selected' : ''}" 
                data-color="${color}" 
                style="background: ${color}"></div>
        `).join('')}
    `;

    document.querySelectorAll('.color-option').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
            el.classList.add('selected');
        });
    });
}

/**
 * モーダルを閉じる
 */
export function closeModal() {
    const elements = getElements();
    elements.taskModal.classList.remove('active');
    setEditingTaskId(null);
}

/**
 * タスクを保存
 */
function saveTask() {
    const elements = getElements();
    const editingTaskId = getEditingTaskId();

    const name = elements.taskNameInput.value.trim();
    const startTime = elements.startTimeInput.value;
    const endTime = elements.endTimeInput.value;
    const priority = parseInt(elements.priorityInput.value) || 1;
    const selectedColor = document.querySelector('.color-option.selected');
    const colorValue = selectedColor?.dataset.color;
    const color = colorValue === 'auto' ? getNextAutoColor() : colorValue;

    if (!name) {
        elements.taskNameInput.focus();
        return;
    }

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
        alert('終了時間は開始時間より後にしてください');
        return;
    }

    if (editingTaskId) {
        updateTask(editingTaskId, { name, startTime, endTime, priority, color });
    } else {
        addTask({
            id: generateId(),
            name,
            startTime,
            endTime,
            priority,
            color
        });
    }

    saveTasks();
    closeModal();
    if (renderCallback) renderCallback();
}

/**
 * タスクを削除
 */
function deleteTask() {
    const editingTaskId = getEditingTaskId();
    if (!editingTaskId) return;

    if (confirm('このタスクを削除しますか？')) {
        removeTask(editingTaskId);
        saveTasks();
        closeModal();
        if (renderCallback) renderCallback();
    }
}

/**
 * 追加モーダルを開く
 */
export function openAddModal() {
    const elements = getElements();

    setEditingTaskId(null);
    elements.modalTitle.textContent = 'タスクを追加';
    elements.taskNameInput.value = '';
    elements.startTimeInput.value = '09:00';
    elements.endTimeInput.value = '10:00';
    elements.priorityInput.value = '1';
    generateColorPicker();

    elements.formActions.innerHTML = `
        <button class="btn btn-secondary" id="cancelBtn">キャンセル</button>
        <button class="btn btn-primary" id="saveBtn">保存</button>
    `;

    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('saveBtn').addEventListener('click', saveTask);

    elements.taskModal.classList.add('active');
    elements.taskNameInput.focus();
}

/**
 * 編集モーダルを開く
 */
export function openEditModal(taskId) {
    const elements = getElements();
    const task = findTask(taskId);
    if (!task) return;

    setEditingTaskId(taskId);
    elements.modalTitle.textContent = 'タスクを編集';
    elements.taskNameInput.value = task.name;
    elements.startTimeInput.value = task.startTime;
    elements.endTimeInput.value = task.endTime;
    elements.priorityInput.value = task.priority;
    generateColorPicker(task.color);

    elements.formActions.innerHTML = `
        <button class="btn btn-danger" id="deleteBtn">削除</button>
        <button class="btn btn-primary" id="saveBtn">更新</button>
    `;

    document.getElementById('deleteBtn').addEventListener('click', deleteTask);
    document.getElementById('saveBtn').addEventListener('click', saveTask);

    elements.taskModal.classList.add('active');
}

