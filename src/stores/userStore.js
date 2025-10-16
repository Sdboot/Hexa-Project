import { writable } from 'svelte/store';

// Load initial users from localStorage
const storedUsers = localStorage.getItem('users');
const initialUsers = storedUsers ? JSON.parse(storedUsers) : [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
];

// Create store
const users = writable(initialUsers);

// Subscribe to changes and update localStorage
users.subscribe(value => {
    localStorage.setItem('users', JSON.stringify(value));
});

export default users;

