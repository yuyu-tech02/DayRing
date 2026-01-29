/**
 * タスクリスト表示モジュール
 */

import { getTasks } from '../state.js';
import { getElements } from '../elements.js';
import { timeToMinutes, formatTimeRange, escapeHtml } from '../utils.js';
import { openEditModal } from './modal.js';

/**
 * タスクリストを更新
 */
export function updateTaskList() {
    const elements = getElements();
    const tasks = getTasks();

    if (tasks.length === 0) {
        elements.taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">○</div>
                <p>タスクを追加してください</p>
            </div>
        `;
        elements.taskCount.textContent = 'タスクなし';
        return;
    }

    // 時間帯ごとにグループ化して表示
    const sortedTasks = [...tasks].sort((a, b) => {
        const aStart = timeToMinutes(a.startTime);
        const bStart = timeToMinutes(b.startTime);
        if (aStart !== bStart) return aStart - bStart;
        return a.priority - b.priority;
    });

    // 同じ時間帯のタスクをグループ化
    const displayItems = [];
    const processed = new Set();

    sortedTasks.forEach(task => {
        if (processed.has(task.id)) return;

        const overlapping = sortedTasks.filter(t =>
            !processed.has(t.id) &&
            timeToMinutes(t.startTime) < timeToMinutes(task.endTime) &&
            timeToMinutes(t.endTime) > timeToMinutes(task.startTime)
        );

        if (overlapping.length > 1) {
            const sorted = overlapping.sort((a, b) => a.priority - b.priority);
            const primary = sorted[0];
            const others = sorted.slice(1);

            displayItems.push({
                ...primary,
                extraCount: others.length
            });

            overlapping.forEach(t => processed.add(t.id));
        } else {
            displayItems.push({ ...task, extraCount: 0 });
            processed.add(task.id);
        }
    });

    elements.taskList.innerHTML = displayItems.map((item, i) => `
        <div class="task-item" data-task-id="${item.id}" style="animation-delay: ${i * 0.05}s">
            <div class="task-color-dot" style="background: ${item.color}"></div>
            <div class="task-info">
                <div class="task-name">${escapeHtml(item.name)}</div>
                <div class="task-time">${formatTimeRange(item.startTime, item.endTime)}</div>
            </div>
            ${item.extraCount > 0 ? `<span class="task-extra">他${item.extraCount}件</span>` : ''}
        </div>
    `).join('');

    // クリックイベント追加
    document.querySelectorAll('.task-item').forEach(el => {
        el.addEventListener('click', () => openEditModal(el.dataset.taskId));
    });

    elements.taskCount.textContent = `${tasks.length}件のタスク`;
}
