<script>
  import users from './stores/userStore';
  import theme from './stores/themeStore';
  
  // Form data
  let formData = { name: '', email: '', role: 'User' };
  let searchQuery = '';
  let editMode = false;
  let editId = null;
  let showModal = false;

  // Theme toggle
  function toggleTheme() {
    $theme = $theme === 'light' ? 'dark' : 'light';
  }

  // Add new user
  function addUser() {
    users.update(currentUsers => [
      ...currentUsers,
      { id: Date.now(), ...formData }
    ]);
    formData = { name: '', email: '', role: 'User' };
    showModal = false;
  }

  // Delete user
  function deleteUser(id) {
    users.update(currentUsers => 
      currentUsers.filter(user => user.id !== id)
    );
  }

  // Edit user
  function startEdit(user) {
    formData = { ...user };
    editMode = true;
    editId = user.id;
    showModal = true;
  }

  // Save edit
  function saveEdit() {
    users.update(currentUsers =>
      currentUsers.map(user =>
        user.id === editId ? { ...formData, id: editId } : user
      )
    );
    editMode = false;
    editId = null;
    formData = { name: '', email: '', role: 'User' };
    showModal = false;
  }

  // Filter users based on search
  $: filteredUsers = $users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<main class={$theme}>
  <h1>User Administration Panel</h1>

  <div class="controls">
    <!-- Theme Toggle -->
    <button class="theme-toggle" on:click={toggleTheme}>
      {$theme === 'light' ? '🌙' : '☀️'}
    </button>

    <!-- Search Box -->
    <div class="search">
      <input
        type="text"
        placeholder="Search users..."
        bind:value={searchQuery}
      >
    </div>

    <button on:click={() => showModal = true}>Add New User</button>
  </div>

  <!-- Modal Form -->
  {#if showModal}
    <div
      class="modal-backdrop"
      role="button"
      tabindex="0"
      aria-label="Close modal"
      on:click={() => showModal = false}
      on:keydown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') { showModal = false; } }}
    >
   
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        on:click|stopPropagation
        tabindex="0"
        on:keydown={(e) => { /* trap focus or handle escape if needed */ }}
      >
        <form on:submit|preventDefault={editMode ? saveEdit : addUser}>
          <h2>{editMode ? 'Edit User' : 'Add New User'}</h2>
          <input
            type="text"
            placeholder="Name"
            bind:value={formData.name}
            required
          >
          <input
            type="email"
            placeholder="Email"
            bind:value={formData.email}
            required
          >
          <select bind:value={formData.role}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
          </select>
          <div class="modal-actions">
            <button type="submit">
              {editMode ? 'Update User' : 'Add User'}
            </button>
            <button type="button" on:click={() => showModal = false}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Users Table -->
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredUsers as user}
        <tr>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <button class="icon-button edit" on:click={() => startEdit(user)} title="Edit user">
              <i class="fas fa-edit"></i>
            </button>
            <button class="icon-button delete" on:click={() => deleteUser(user.id)} title="Delete user">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<style>
  :global(body) {
    margin: 0;
    transition: background-color 0.3s, color 0.3s;
  }

  :global(body.dark) {
    background-color: #1a1a1a;
    color: #ffffff;
  }

  main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    overflow-y: hidden;
  }

  .controls {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 3rem;
    padding: 1rem;
  }

  .search {
    flex: 1;
    margin: 0 1rem;
  }

  .theme-toggle {
    font-size: 2rem;
    cursor: pointer;
    background: none;
    border: none;
  }

  input, select {
    padding: 0.5rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
  }

  th, td {
    border: 1px solid var(--border-color);
    padding: 0.5rem;
    text-align: left;
  }

  th {
    background-color: var(--header-bg);
  }
   .icon-button {
    background: none;
    border: none;
    padding: 0.5rem;
    margin: 0 0.25rem;
    cursor: pointer;
    transition: transform 0.2s ease;
    min-height: auto;
  }

  .icon-button:hover {
    transform: scale(1.1);
  }

  .icon-button.edit {
    color: #4CAF50;
  }

  .icon-button.delete {
    color: #f44336;
  }

  .icon-button:hover {
    opacity: 0.8;
    color: inherit;
  }


  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }

  .modal {
    background-color: var(--modal-bg);
    padding: 1rem;
    border-radius: 8px;
    min-width: 200px;
    animation: slideIn 0.3s ease;
  }

  .modal-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    min-height: 35px;
    cursor: pointer;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    background-color: var(--button-bg);
    color: var(--button-text);
  }

  button:hover {
    opacity: 0.8;
    color: red;
  }

  /* Theme Variables */
  :global(.light) {
    --border-color: #ddd;
    --header-bg: #f4f4f4;
    --modal-bg: #ffffff;
    --button-bg: #f4f4f4;
    --button-text: #000000;
  }

  :global(.dark) {
    --border-color: #444;
    --header-bg: #333;
    --modal-bg: #2a2a2a;
    --button-bg: #444;
    --button-text: #ffffff;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  /* Make table responsive */
  @media (max-width: 600px) {

     * {
    box-sizing: border-box;
  }

   body {
    margin: 0;
    padding: 0;
    width: 100%;
  }
     main {
    padding: 0.5rem;
    margin: 0 ;
    width: 100%;
    box-sizing: border-box;
  }

   .controls {
    grid-template-columns:  1fr;
    gap: 0.5rem;
    margin-bottom: 2rem;
    padding: 0.5rem;
  }
  .search {
      margin: 0;
      width: 100%;
    }
   .theme-toggle {
    font-size: 1rem;
  }
  input, select {
    padding: 0.5rem;
    margin-right: 0.4rem;
    margin-bottom: 1rem;
    width: 100%;
    
  }
  table {
    font-size: 0.5rem;
    display: block;
    overflow-x: auto;
    width: 100%;
    border-collapse: collapse;
    margin-top: 2rem;
    -webkit-overflow-scrolling: touch;
  }

  th, td {
    padding: 0.4rem;
    min-width: 80px;
  }

  th {
    background-color: var(--header-bg);
  }
  .modal {
      width: 90%;
      margin: 0 auto;
      max-height: 90vh;
      overflow-y: auto;
      padding: 1rem;
    }

    input, select {
      width: 100%;
      margin: 0.5rem 0;
      padding: 0.5rem;
      box-sizing: border-box;
    }

    .modal-actions {
      flex-direction: column;
      width: 100%;
    }

    .modal-actions button {
      width: 100%;
      margin: 0.25rem 0;
    }
     h1 {
      font-size: 1.2rem;
      margin: 0.5rem 0;
    }

    .icon-button {
      padding: 0.3rem;
    }

    button {
      width: 100%;
      margin: 0.25rem 0;
    }

    .theme-toggle {
      font-size: 1.5rem;
      width: auto;
      justify-self: center;
    }

}
  
</style>