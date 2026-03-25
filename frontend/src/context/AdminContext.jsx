import React, { createContext, useContext, useState } from 'react';
import {
  DYNAMIC_FORM_FIELDS,
  OBSERVATION_CATEGORIES,
  LOCATIONS,
  DEPARTMENTS,
  MOCK_USERS,
  MOCK_OBSERVATIONS,
  MOCK_ACTION_ITEMS,
} from '../data/mockData';

const AdminContext = createContext(null);

// Seed audit log entries
const INITIAL_AUDIT_LOG = [
  {
    id: 1,
    timestamp: '2025-05-28 09:14:32',
    user: 'Ahmed Kamal',
    role: 'super_admin',
    action: 'USER_ROLE_UPDATED',
    target: 'Sana Mirza',
    detail:
      'Role changed: employee → hseq_officer',
  },
  {
    id: 2,
    timestamp: '2025-05-27 14:22:10',
    user: 'Ahmed Kamal',
    role: 'super_admin',
    action: 'FORM_FIELD_ADDED',
    target: 'Inspection',
    detail:
      'Added field: "Third Party Inspector Present" (radio)',
  },
  {
    id: 3,
    timestamp: '2025-05-26 11:05:44',
    user: 'Ahmed Kamal',
    role: 'super_admin',
    action: 'CATEGORY_ADDED',
    target: 'Observation Categories',
    detail:
      'Added category: "Radiation Safety"',
  },
  {
    id: 4,
    timestamp: '2025-05-25 16:33:21',
    user: 'Ahmed Kamal',
    role: 'super_admin',
    action: 'LOCATION_DELETED',
    target: 'Locations',
    detail:
      'Removed location: "Old Pump House (Decommissioned)"',
  },
  {
    id: 5,
    timestamp: '2025-05-24 08:50:09',
    user: 'Ahmed Kamal',
    role: 'super_admin',
    action: 'REMINDER_CONFIG_UPDATED',
    target: 'Reminder Settings',
    detail:
      'First reminder changed: 7 days → 5 days before due date',
  },
  {
    id: 6,
    timestamp: '2025-05-23 10:12:55',
    user: 'Ahmed Kamal',
    role: 'super_admin',
    action: 'OBSERVATION_DELETED',
    target: 'OBS-2025-004',
    detail:
      'Deleted: Duplicate entry removed',
  },
  {
    id: 7,
    timestamp: '2025-05-22 15:40:18',
    user: 'Ahmed Kamal',
    role: 'super_admin',
    action: 'USER_CREATED',
    target: 'focal.elec@prl.com.pk',
    detail:
      'New user created: Kamran Ali (focal_person, Electrical)',
  },
  {
    id: 8,
    timestamp: '2025-05-21 09:28:37',
    user: 'Ahmed Kamal',
    role: 'super_admin',
    action: 'FORM_FIELD_REORDERED',
    target: 'Mock Drill',
    detail:
      'Field "Response Time" moved from position 4 → 3',
  },
];

// Reminder config seed data
const INITIAL_REMINDER_CONFIG = {
  firstReminder: 5, // days before due
  secondReminder: 2, // days before due
  overdueReminder: 1, // days interval after overdue
  emailSubjectTemplate:
    'Action Required: {itemId} — {title} due on {dueDate}',
  emailBodyTemplate:
    'Dear {assigneeName},\n\nThis is a reminder that the following HSEQ item assigned to you is due on {dueDate}:\n\nItem: {itemId} — {title}\nCategory: {category}\nPriority: {priority}\n\nPlease log in to the HSEQ Portal to update the status.\n\nRegards,\nHSEQ Department\nPakistan Refinery Limited',
  smsEnabled: false,
  smsTemplate: 'PRL HSEQ: {itemId} due {dueDate}. Login to portal.',
};

export function AdminProvider({ children }) {
  // Mutable copies of all data
  const [formFields, setFormFields] = useState({ ...DYNAMIC_FORM_FIELDS });
  const [categories, setCategories] = useState([...OBSERVATION_CATEGORIES]);
  const [locations, setLocations] = useState([...LOCATIONS]);
  const [departments, setDepartments] = useState([...DEPARTMENTS]);
  const [users, setUsers] = useState([...MOCK_USERS]);
  const [observations, setObservations] = useState([...MOCK_OBSERVATIONS]);
  const [actionItems, setActionItems] = useState([...MOCK_ACTION_ITEMS]);
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT_LOG);
  const [reminderConfig, setReminderConfig] = useState(INITIAL_REMINDER_CONFIG);

  const logAction = (user, action, target, detail) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date()
        .toLocaleString('en-PK', { hour12: false })
        .replace(',', ''),
      user: user?.name || 'System',
      role: user?.role || 'system',
      action,
      target,
      detail,
    };
    setAuditLog((prev) => [entry, ...prev]);
  };

  // ── FORM FIELDS ──────────────────────────────────────────
  const addFormField = (activityType, field, currentUser) => {
    setFormFields((prev) => ({
      ...prev,
      [activityType]: [...(prev[activityType] || []), field],
    }));
    logAction(
      currentUser,
      'FORM_FIELD_ADDED',
      activityType,
      `Added field: "${field.label}" (${field.type})`
    );
  };

  const updateFormField = (activityType, fieldIndex, updatedField, currentUser) => {
    setFormFields((prev) => {
      const updated = [...(prev[activityType] || [])];
      updated[fieldIndex] = updatedField;
      return { ...prev, [activityType]: updated };
    });
    logAction(
      currentUser,
      'FORM_FIELD_UPDATED',
      activityType,
      `Updated field at position ${fieldIndex + 1}: "${updatedField.label}"`
    );
  };

  const deleteFormField = (activityType, fieldIndex, currentUser) => {
    const fieldLabel = formFields[activityType]?.[fieldIndex]?.label;
    setFormFields((prev) => {
      const updated = (prev[activityType] || []).filter((_, i) => i !== fieldIndex);
      return { ...prev, [activityType]: updated };
    });
    logAction(
      currentUser,
      'FORM_FIELD_DELETED',
      activityType,
      `Deleted field: "${fieldLabel}"`
    );
  };

  const reorderFormFields = (activityType, newFields, currentUser) => {
    setFormFields((prev) => ({ ...prev, [activityType]: newFields }));
    logAction(
      currentUser,
      'FORM_FIELD_REORDERED',
      activityType,
      `Fields reordered (${newFields.length} fields)`
    );
  };

  // ── CATEGORIES ────────────────────────────────────────────
  const addCategory = (cat, currentUser) => {
    setCategories((prev) => [...prev, cat]);
    logAction(currentUser, 'CATEGORY_ADDED', 'Observation Categories', `Added: "${cat}"`);
  };

  const updateCategory = (oldCat, newCat, currentUser) => {
    setCategories((prev) => prev.map((c) => (c === oldCat ? newCat : c)));
    logAction(
      currentUser,
      'CATEGORY_UPDATED',
      'Observation Categories',
      `Renamed: "${oldCat}" → "${newCat}"`
    );
  };

  const deleteCategory = (cat, currentUser) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    logAction(currentUser, 'CATEGORY_DELETED', 'Observation Categories', `Deleted: "${cat}"`);
  };

  // ── LOCATIONS ─────────────────────────────────────────────
  const addLocation = (loc, currentUser) => {
    setLocations((prev) => [...prev, loc]);
    logAction(currentUser, 'LOCATION_ADDED', 'Locations', `Added: "${loc}"`);
  };

  const updateLocation = (oldLoc, updatedLoc, currentUser) => {
    setLocations((prev) => prev.map((l) => (l === oldLoc ? updatedLoc : l)));
    logAction(
      currentUser,
      'LOCATION_UPDATED',
      'Locations',
      `Renamed: "${oldLoc}" → "${updatedLoc}"`
    );
  };

  const deleteLocation = (loc, currentUser) => {
    setLocations((prev) => prev.filter((l) => l !== loc));
    logAction(currentUser, 'LOCATION_DELETED', 'Locations', `Removed: "${loc}"`);
  };

  // ── DEPARTMENTS ───────────────────────────────────────────
  const addDepartment = (dept, currentUser) => {
    setDepartments((prev) => [...prev, dept]);
    logAction(currentUser, 'DEPT_ADDED', 'Departments', `Added: "${dept}"`);
  };

  const updateDepartment = (oldDept, updatedDept, currentUser) => {
    setDepartments((prev) => prev.map((d) => (d === oldDept ? updatedDept : d)));
    logAction(
      currentUser,
      'DEPT_UPDATED',
      'Departments',
      `Renamed: "${oldDept}" → "${updatedDept}"`
    );
  };

  const deleteDepartment = (dept, currentUser) => {
    setDepartments((prev) => prev.filter((d) => d !== dept));
    logAction(currentUser, 'DEPT_DELETED', 'Departments', `Removed: "${dept}"`);
  };

  // ── USERS ─────────────────────────────────────────────────
  const addUser = (user, currentUser) => {
    const newUser = {
      ...user,
      id: Date.now(),
      avatar: user.name
        .split(' ')
        .map((n) => (n[0] ? n[0] : ''))
        .join('')
        .toUpperCase()
        .slice(0, 2),
    };
    setUsers((prev) => [...prev, newUser]);
    logAction(
      currentUser,
      'USER_CREATED',
      user.email,
      `New user: ${user.name} (${user.role}, ${user.department})`
    );
  };

  const updateUserRole = (userId, newRole, currentUser) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    logAction(
      currentUser,
      'USER_ROLE_UPDATED',
      target?.name,
      `Role: ${target?.role} → ${newRole}`
    );
  };

  const updateUser = (userId, updates, currentUser) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const merged = { ...u, ...updates };
        if (updates.name) {
          merged.avatar = updates.name
            .split(' ')
            .map((n) => (n[0] ? n[0] : ''))
            .join('')
            .toUpperCase()
            .slice(0, 2);
        }
        return merged;
      })
    );
    logAction(
      currentUser,
      'USER_UPDATED',
      target?.name,
      `Updated: ${Object.keys(updates).join(', ')}`
    );
  };

  const updateUserStatus = (userId, active, currentUser) => {
    updateUser(
      userId,
      { active },
      currentUser
    );
    // (logAction already executed inside updateUser)
  };

  const deleteUser = (userId, currentUser) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    logAction(currentUser, 'USER_DELETED', target?.name, `User removed: ${target?.email}`);
  };

  // ── OBSERVATIONS (admin) ──────────────────────────────────
  const updateObservation = (id, updates, currentUser) => {
    setObservations((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    logAction(
      currentUser,
      'OBSERVATION_UPDATED',
      id,
      `Fields updated: ${Object.keys(updates).join(', ')}`
    );
  };

  const deleteObservation = (id, currentUser) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
    logAction(currentUser, 'OBSERVATION_DELETED', id, 'Observation permanently deleted');
  };

  // ── ACTION ITEMS (admin) ──────────────────────────────────
  const updateActionItem = (id, updates, currentUser) => {
    setActionItems((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    logAction(
      currentUser,
      'ACTION_UPDATED',
      id,
      `Fields updated: ${Object.keys(updates).join(', ')}`
    );
  };

  const deleteActionItem = (id, currentUser) => {
    setActionItems((prev) => prev.filter((a) => a.id !== id));
    logAction(currentUser, 'ACTION_DELETED', id, 'Action item permanently deleted');
  };

  // ── REMINDERS ─────────────────────────────────────────────
  const updateReminderConfig = (updates, currentUser) => {
    setReminderConfig((prev) => ({ ...prev, ...updates }));
    logAction(
      currentUser,
      'REMINDER_CONFIG_UPDATED',
      'Reminder Settings',
      `Updated: ${Object.keys(updates).join(', ')}`
    );
  };

  return (
    <AdminContext.Provider
      value={{
        // Data
        formFields,
        categories,
        locations,
        departments,
        users,
        observations,
        actionItems,
        auditLog,
        reminderConfig,
        // Form field actions
        addFormField,
        updateFormField,
        deleteFormField,
        reorderFormFields,
        // Category actions
        addCategory,
        updateCategory,
        deleteCategory,
        // Location actions
        addLocation,
        updateLocation,
        deleteLocation,
        // Dept actions
        addDepartment,
        updateDepartment,
        deleteDepartment,
        // User actions
        addUser,
        updateUserRole,
        updateUser,
        updateUserStatus,
        deleteUser,
        // Observation admin
        updateObservation,
        deleteObservation,
        // Action item admin
        updateActionItem,
        deleteActionItem,
        // Reminder
        updateReminderConfig,
        // Direct setters for portal pages (so they share the same data)
        setObservations,
        setActionItems,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);

