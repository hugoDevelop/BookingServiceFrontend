<script lang="ts">
    import "bootstrap/dist/css/bootstrap.min.css";
    import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"; // Importar Bootstrap JavaScript
    import { onMount } from "svelte";
    import { getClientes, saveCliente, updateCliente, deleteCliente } from "../../services/apiService";
    import type { Cliente } from "../../models/Cliente";
    import Header from "../../lib/components/Header.svelte";
    import { authStore } from "$lib/store/authStore";
    import { get } from "svelte/store";

    let clientes: Cliente[] = [];
    let error: string | null = null;
    let isLoading = true;
    let nombre = "";
    let email = "";
    let telefono = "";
    let isSaving = false;
    let isEditing = false;
    let editClienteId: number | null = null;
    const { user } = get(authStore);

    if (typeof window !== 'undefined') {
        (window as any).bootstrap = bootstrap;
    }

    onMount(async () => {
        const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
        (window as any).bootstrap = bootstrap;

        try {
            clientes = await getClientes();
        } catch (err) {
            const errorObj = err as Error;
            error = errorObj.message;
        } finally {
            isLoading = false;
        }
    });

    async function agregarCliente() {
        isSaving = true;
        try {
            const newCliente = { nombre, email, telefono, companyId: user?.companyId };
            await saveCliente(newCliente);
            clientes = await getClientes(); // Refrescar la lista de clientes
            nombre = "";
            email = "";
            telefono = "";
            const modalElement = document.getElementById('addClienteModal');
            if (modalElement) {
                const modal = new (window as any).bootstrap.Modal(modalElement); // Utilizar window.bootstrap
                modal.hide();
            }
        } catch (err) {
            const errorObj = err as Error;
            error = errorObj.message;
        } finally {
            isSaving = false;
        }
    }

    async function editarCliente() {
        isSaving = true;
        try {
            const updatedCliente = { ClienteId: editClienteId, nombre, email, telefono, companyId: user?.companyId };
            if (editClienteId !== null) {
                await updateCliente(editClienteId, updatedCliente);
            }
            clientes = await getClientes(); // Refrescar la lista de clientes
            nombre = "";
            email = "";
            telefono = "";
            editClienteId = null;
            isEditing = false;
            const modalElement = document.getElementById('addClienteModal');
            if (modalElement) {
                const modal = new (window as any).bootstrap.Modal(modalElement); // Utilizar window.bootstrap
                modal.hide();
            }
        } catch (err) {
            console.log(err);
            const errorObj = err as Error;
            error = errorObj.message;
        } finally {
            isSaving = false;
        }
    }

    async function borrarCliente(clienteId: number) {
        try {
            await deleteCliente(clienteId);
            clientes = await getClientes(); // Refrescar la lista de clientes
        } catch (err) {
            const errorObj = err as Error;
            error = errorObj.message;
        }
    }

    function abrirModalAgregar() {
        nombre = "";
        email = "";
        telefono = "";
        isEditing = false;
        const modalElement = document.getElementById('addClienteModal');
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement); // Utilizar window.bootstrap
            modal.show();
        }
    }

    function abrirModalEditar(cliente: Cliente) {
        nombre = cliente.nombre;
        email = cliente.email;
        telefono = cliente.telefono;
        editClienteId = cliente.clienteId;
        isEditing = true;
        const modalElement = document.getElementById('addClienteModal');
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement); // Utilizar window.bootstrap
            modal.show();
        }
    }

    function limpiarModal() {
        nombre = "";
        email = "";
        telefono = "";
        editClienteId = null;
        isEditing = false;
    }
</script>

<Header />
<div class="container mt-5">
    <h1 class="text-center mb-4">Lista de Clientes</h1>
    {#if error}
        <div class="alert alert-danger" role="alert">{error}</div>
    {/if}
    {#if isLoading}
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    {/if}
    <div class="mb-3">
        <button class="btn btn-success" on:click={abrirModalAgregar}>Agregar Cliente</button>
    </div>
    {#if !isLoading && clientes.length > 0}
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Compañía</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each clientes as cliente}
                        <tr>
                            <th scope="row">{cliente.clienteId}</th>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.company?.name}</td>
                            <td>
                                <button class="btn btn-primary btn-sm me-2" on:click={() => abrirModalEditar(cliente)}>Editar</button>
                                <button class="btn btn-danger btn-sm" on:click={() => borrarCliente(cliente.clienteId)}>Borrar</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
    {#if !isLoading && clientes.length === 0}
        <p class="text-center">No hay clientes disponibles.</p>
    {/if}
</div>

<!-- Modal para agregar/editar cliente -->
<div class="modal fade" id="addClienteModal" tabindex="-1" aria-labelledby="addClienteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addClienteModalLabel">{isEditing ? 'Editar Cliente' : 'Agregar Cliente'}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form on:submit|preventDefault={isEditing ? editarCliente : agregarCliente}>
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" bind:value={nombre} required />
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" bind:value={email} required />
                    </div>
                    <div class="mb-3">
                        <label for="telefono" class="form-label">Teléfono</label>
                        <input type="text" class="form-control" id="telefono" bind:value={telefono} required />
                    </div>
                    <button type="submit" class="btn btn-primary" disabled={isSaving}>
                        {#if isSaving}
                            Guardando...
                        {:else}
                            {isEditing ? 'Guardar Cambios' : 'Guardar'}
                        {/if}
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>