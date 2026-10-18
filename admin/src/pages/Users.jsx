import React from 'react';
import SimpleCrud from '../components/SimpleCrud';
export default function Users() {
  return <SimpleCrud title="Admin Users" endpoint="/api/v1/users" fields={[
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email' },
    { name: 'password', label: 'Password' },
    { name: 'role', label: 'Role', type: 'select', options: ['superadmin','admin','staff'], default: 'staff' },
    { name: 'isActive', label: 'Active', type: 'boolean', default: true },
  ]} />;
}