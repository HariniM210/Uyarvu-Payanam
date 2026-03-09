/**
 * NotificationBell.jsx — Admin Panel Component
 *
 * Shows the admin a quick-view of recently SENT notifications.
 * This is a "sent outbox" view, NOT an inbox.
 *
 * Key points:
 *   • The bell counts TODAY's sent notifications (not unread count)
 *   • Admin emits "join_admin" so they join the "admins" socket room
 *   • Admin never joins "students" or "user_<id>" rooms
 *   • No unread badge for admin (admin is the sender, not recipient)
 *   • Shows last 15 sent notifications with type/level badges and time
 *   • Clicking each item opens a quick view; admin can delete from here
 */

import React, { useState, useRef, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useNotifications } from '../context/NotificationContext'
import styles from './NotificationBell.module.css'

const SOCKET_URL = 'http://localhost:5000'

const TYPE_META = {
    announcement: { icon: '📢', color: '#6c5ce7' },
    exam: { icon: '📝', color: '#e17055' },
    scholarship: { icon: '🎓', color: '#00b894' },
    career: { icon: '🎯', color: '#0984e3' },
    college: { icon: '🏫', color: '#fdcb6e' },
    course: { icon: '📘', color: '#a29bfe' },
    system: { icon: '⚙️', color: '#74b9ff' },
    counselling: { icon: '🤝', color: '#fd79a8' },
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false)
    const panelRef = useRef(null)
    const socketRef = useRef(null)

    const {
        notifications, // sent history
        stats,
        deleteNotification,
    } = useNotifications()

    // ── Join the "admins" socket room on mount ────────────────────────────
    // This ensures admin gets multi-tab sync events but NEVER receives
    // student notification events.
    useEffect(() => {
        const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] })
        socketRef.current = socket
        socket.on('connect', () => {
            socket.emit('join_admin')   // join "admins" room only
            console.log('🔐 [Admin Bell] Joined admins room:', socket.id)
        })
        return () => socket.disconnect()
    }, [])

    // ── Close panel when clicking outside ────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    // Show today's sent count as the badge value
    const todaySent = stats?.sentToday ?? 0
    const recent = notifications.slice(0, 15)

    return (
        <div className={styles.wrapper} ref={panelRef}>
            {/* ── Bell Button ── */}
            <button
                id="notification-bell-btn"
                className={`${styles.bell} ${todaySent > 0 ? styles.hasActivity : ''}`}
                onClick={() => setOpen((o) => !o)}
                title={`${stats?.totalSent ?? 0} notifications sent`}
                aria-label="Notification sent history"
            >
                <span className={styles.bellIcon}>📤</span>
                {todaySent > 0 && (
                    <span className={styles.badge} title={`${todaySent} sent today`}>
                        {todaySent > 99 ? '99+' : todaySent}
                    </span>
                )}
            </button>

            {/* ── Dropdown Panel ── */}
            {open && (
                <div
                    className={styles.panel}
                    id="notification-panel"
                    role="dialog"
                    aria-label="Sent Notifications"
                >
                    {/* Header */}
                    <div className={styles.panelHeader}>
                        <div className={styles.panelTitle}>
                            <span>📤</span>
                            <span>Sent Notifications</span>
                            {stats?.totalSent > 0 && (
                                <span className={styles.titleBadge}>
                                    {stats.totalSent} total
                                </span>
                            )}
                        </div>
                        <div className={styles.statsRow}>
                            <span className={styles.statChip} style={{ color: '#6c5ce7' }}>
                                📡 {stats?.broadcasts ?? 0} broadcast
                            </span>
                            <span className={styles.statChip} style={{ color: '#0984e3' }}>
                                👤 {stats?.targeted ?? 0} targeted
                            </span>
                        </div>
                    </div>

                    {/* List */}
                    <div className={styles.list}>
                        {recent.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>📭</div>
                                <p>No notifications sent yet</p>
                                <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                                    Go to Notifications page to create one
                                </span>
                            </div>
                        ) : (
                            recent.map((n) => {
                                const meta = TYPE_META[n.type] || TYPE_META.announcement
                                return (
                                    <div
                                        key={n._id}
                                        className={styles.item}
                                        id={`notif-item-${n._id}`}
                                    >
                                        {/* Accent bar */}
                                        <div
                                            className={styles.accentBar}
                                            style={{ background: meta.color }}
                                        />

                                        {/* Icon */}
                                        <div
                                            className={styles.typeIcon}
                                            style={{
                                                background: `${meta.color}22`,
                                                color: meta.color,
                                            }}
                                        >
                                            {meta.icon}
                                        </div>

                                        {/* Content */}
                                        <div className={styles.content}>
                                            <div className={styles.itemTitle}>{n.title}</div>
                                            <div className={styles.itemMsg}>{n.message}</div>
                                            <div className={styles.itemMeta}>
                                                <span
                                                    className={styles.typePill}
                                                    style={{
                                                        background: `${meta.color}22`,
                                                        color: meta.color,
                                                    }}
                                                >
                                                    {n.type}
                                                </span>
                                                {n.isBroadcast ? (
                                                    <span className={styles.broadcastPill}>
                                                        📡 All
                                                    </span>
                                                ) : (
                                                    <span className={styles.levelPill}>
                                                        👤 Targeted
                                                    </span>
                                                )}
                                                {n.targetLevel && n.targetLevel !== 'All' && (
                                                    <span className={styles.levelPill}>
                                                        {n.targetLevel}
                                                    </span>
                                                )}
                                                <span className={styles.time}>
                                                    {timeAgo(n.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Delete action */}
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => deleteNotification(n._id)}
                                                title="Delete notification"
                                                id={`delete-notif-${n._id}`}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Footer hint */}
                    <div className={styles.panelFooter}>
                        {notifications.length > 15
                            ? `Showing 15 of ${notifications.length} — visit Notifications page for full list`
                            : `📊 ${stats?.activeStudents ?? '?'} active students in system`}
                    </div>
                </div>
            )}
        </div>
    )
}
