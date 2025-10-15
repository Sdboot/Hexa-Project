import { writable } from 'svelte/store';

// Get initial theme from localStorage or default to 'light'
const storedTheme = localStorage.getItem('theme') || 'light';
const theme = writable(storedTheme);

// Subscribe to changes and update localStorage and body class
theme.subscribe(value => {
    localStorage.setItem('theme', value);
    if (typeof document !== 'undefined') {
        document.body.className = value;
    }
});

export default theme;