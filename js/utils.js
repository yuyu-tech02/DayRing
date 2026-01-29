/**
 * ユーティリティ関数モジュール
 * 汎用的なヘルパー関数を提供
 */

import { COLORS } from './config.js';
import { getAutoColorIndex, incrementAutoColorIndex } from './state.js';

/**
 * ユニークなIDを生成
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 時間文字列（HH:MM）を分に変換
 */
export function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * 分を時間文字列（HH:MM）に変換
 */
export function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * 時間範囲をフォーマット
 */
export function formatTimeRange(start, end) {
    return `${start} - ${end}`;
}

/**
 * 次の自動カラーを取得
 */
export function getNextAutoColor() {
    const index = getAutoColorIndex();
    const color = COLORS[index % COLORS.length];
    incrementAutoColorIndex();
    return color;
}

/**
 * HTMLエスケープ
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
