<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import { initialize, login, msalInstance } from "../../services/authService";

  let email = "";

  async function handleLogin() {
    await initialize();
    await login(); // Inicia el flujo de autenticación con OAuth2
  }
</script>

<div class="d-flex justify-content-center align-items-center vh-100">
  <div class="card p-4" style="width: 22rem;">
    <h2 class="card-title text-center mb-4">Login</h2>
    <form on:submit|preventDefault={handleLogin}>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          bind:value={email}
          class="form-control"
          id="email"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
  </div>
</div>
