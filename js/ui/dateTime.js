/**
 * 日付・時刻表示モジュール
 */

import { getElements } from '../elements.js';

/**
 * 日付表示を更新
 */
export function updateDateDisplay() {
    const elements = getElements();
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
    elements.dateDisplay.textContent = now.toLocaleDateString('ja-JP', options);
}

/**
 * 現在時刻表示を更新
 */
export function updateCurrentTime() {
    const elements = getElements();
    const now = new Date();
    elements.currentTime.textContent =
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * 時刻表示の定期更新を開始（1分ごと）
 */
export function startTimeUpdater() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);
}
