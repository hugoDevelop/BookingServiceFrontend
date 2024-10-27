<script lang="ts">
  import "bootstrap/dist/css/bootstrap.min.css";
  import { initialize, login } from "../../services/authService";
  import type { User } from "../../models/User";
  import { getUserSettings } from "../../services/apiService";
  import { config } from "../../authConfig";

  let email = "";
  let user: User | null = null;
  let error: string | null = null;
  let isLoading = false;

  async function handleLogin() {
    isLoading = true;
    try {
      user = await getUserSettings(email);

      config.authorizationEndpoint = user.company?.authUrl || "";
      config.clientId = user.company?.authClientId || "";
      config.redirectUri = user.company?.authRedirectUrl || "";
      config.scopes = user.company?.authScope?.split(",") || [];
      config.tokenEndpoint = user.company?.authTokenUrl || "";

      await initialize();
      await login(user);
      isLoading = false;
      window.location.href = "/reservas";
    } catch (err) {
      const errorObj = err as Error;
      error = errorObj.message;
      isLoading = false;
    }
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
      {#if error}
        <div class="alert alert-danger" role="alert">{error}</div>
      {/if}
      {#if isLoading}
        <div class="spinner-border text-primary mt-2" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      {/if}
      {#if !isLoading}
        <button type="submit" class="btn btn-primary w-100">Login</button>
      {/if}
    </form>
  </div>
</div>
