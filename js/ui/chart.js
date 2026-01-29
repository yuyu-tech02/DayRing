
import { SLEEP_COLOR, CHART_CONFIG, TIME_LABELS } from '../config.js';
import { getTasks } from '../state.js';
import { getElements } from '../elements.js';
import { timeToMinutes } from '../utils.js';
import { openEditModal } from './modal.js';

/**
 * 時間ラベルを生成
 */
export function generateTimeLabels() {
    const elements = getElements();
    elements.timeLabels.innerHTML = '';
    const radius = CHART_CONFIG.labelRadius;

    TIME_LABELS.hours.forEach((hour, i) => {
        const angle = (hour / 24) * 360 - 90;
        const rad = angle * (Math.PI / 180);
        //円グラフの中心(50%,50%)を基準にラベルを配置
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);

        const label = document.createElement('span');
        label.className = 'time-label';
        label.textContent = TIME_LABELS.labels[i];
        label.style.left = `${x}%`;
        label.style.top = `${y}%`;
        elements.timeLabels.appendChild(label);
    });
}

/**
 * セグメントを描画
 */
function drawSegment(task, startSlot, endSlot) {
    const elements = getElements();
    const circumference = CHART_CONFIG.circumference;
    const totalMinutes = CHART_CONFIG.totalMinutes;

    const startMin = startSlot * 10;
    const endMin = endSlot * 10;
    const duration = endMin - startMin;

    const startRatio = startMin / totalMinutes;
    const durationRatio = duration / totalMinutes;

    const offset = -circumference * startRatio;
    const length = circumference * durationRatio;

    const segment = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    segment.setAttribute('class', 'circle-segment');
    segment.setAttribute('cx', '100');
    segment.setAttribute('cy', '100');
    segment.setAttribute('r', String(CHART_CONFIG.radius));
    segment.setAttribute('stroke', task.color);
    segment.setAttribute('stroke-dasharray', `${length} ${circumference}`);
    segment.setAttribute('stroke-dashoffset', offset.toString());
    segment.setAttribute('data-task-id', task.id);
    segment.addEventListener('click', () => openEditModal(task.id));
    elements.segmentsGroup.appendChild(segment);
}

/**
 * 円グラフセグメントを生成
 */
export function generateSegments() {
    const elements = getElements();
    const tasks = getTasks();

    elements.segmentsGroup.innerHTML = '';
    const wakeTime = timeToMinutes(elements.wakeTimeInput.value);
    const sleepTime = timeToMinutes(elements.sleepTimeInput.value);
    const circumference = CHART_CONFIG.circumference;
    const totalMinutes = CHART_CONFIG.totalMinutes;

    // 睡眠時間セグメントを描画するヘルパー関数
    function drawSleepSegment(startMinutes, durationMinutes) {
        const durationRatio = durationMinutes / totalMinutes;
        const length = circumference * durationRatio;
        const offset = -circumference * (startMinutes / totalMinutes);

        const segment = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        segment.setAttribute('class', 'circle-segment');
        segment.setAttribute('cx', '100');
        segment.setAttribute('cy', '100');
        segment.setAttribute('r', String(CHART_CONFIG.radius));
        segment.setAttribute('stroke', SLEEP_COLOR);
        segment.setAttribute('stroke-dasharray', `${length} ${circumference}`);
        segment.setAttribute('stroke-dashoffset', `${offset}`);
        elements.segmentsGroup.appendChild(segment);
    }

    // 睡眠時間セグメント（sleepTime → wakeTime）
    if (sleepTime > wakeTime) {
        // 深夜をまたぐ場合：2つのセグメントに分ける
        // 1. sleepTime → 24:00（0時）
        drawSleepSegment(sleepTime, 24 * 60 - sleepTime);
        // 2. 0:00 → wakeTime
        if (wakeTime > 0) {
            drawSleepSegment(0, wakeTime);
        }
    } else if (sleepTime < wakeTime) {
        // 同日内の場合（02:00→08:00など）：1つのセグメント
        drawSleepSegment(sleepTime, wakeTime - sleepTime);
    }

    // タスクセグメント
    // 時間帯ごとにグループ化
    const timeSlots = {};

    tasks.forEach(task => {
        const startMin = timeToMinutes(task.startTime);
        const endMin = timeToMinutes(task.endTime);

        // 10分単位でスロットに割り当て
        for (let min = startMin; min < endMin; min += 10) {
            const slotKey = Math.floor(min / 10);
            if (!timeSlots[slotKey]) {
                timeSlots[slotKey] = [];
            }
            timeSlots[slotKey].push(task);
        }
    });

    // 連続する同じ優先タスクをまとめて描画
    let currentTask = null;
    let segmentStart = null;

    for (let slot = 0; slot < 144; slot++) {
        const tasksInSlot = timeSlots[slot] || [];
        const topTask = tasksInSlot.length > 0
            ? tasksInSlot.reduce((a, b) => a.priority < b.priority ? a : b)
            : null;

        if (topTask !== currentTask || (topTask && currentTask && topTask.id !== currentTask.id)) {
            // 前のセグメントを描画
            if (currentTask && segmentStart !== null) {
                drawSegment(currentTask, segmentStart, slot);
            }
            currentTask = topTask;
            segmentStart = topTask ? slot : null;
        }
    }

    // 最後のセグメントを描画
    if (currentTask && segmentStart !== null) {
        drawSegment(currentTask, segmentStart, 144);
    }
}
