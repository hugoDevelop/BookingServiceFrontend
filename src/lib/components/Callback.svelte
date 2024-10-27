<script>
    import { config } from '../../authConfig';
    import { onMount } from 'svelte';
  
    onMount(async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
  
      if (code) {
        const response = await fetch(config.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            redirect_uri: config.redirectUri,
            code: code,
            grant_type: 'authorization_code'
          })
        });
  
        const data = await response.json();
        console.log('Access Token:', data.access_token);
      }
    });
  </script>
  
  <p>Processing login...</p>