<script lang="ts">
    import { authStore } from "../store/authStore";
    import { get } from "svelte/store";
    import { onMount } from "svelte";
    import { logout } from "../../services/authService"; // Importar la función de logout
  
    let isAuthenticated = false;
    let companyName = "";
    let userName = "";
  
    onMount(() => {
      const { isAuthenticated: authStatus, user } = get(authStore);
      companyName = user?.company?.name || "";
      userName = user?.name || "";
      isAuthenticated = authStatus;
    });
  
    async function handleLogout() {
      await logout();
      window.location.href = "/login";
    }
  </script>
  
  {#if isAuthenticated}
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">{companyName}</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="/reservas">Reservas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/clientes">Clientes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/servicios">Servicios</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle"></i> {userName}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#" on:click={handleLogout}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  {/if}
  
  <style>
    .navbar {
      margin-bottom: 20px;
    }
  </style>