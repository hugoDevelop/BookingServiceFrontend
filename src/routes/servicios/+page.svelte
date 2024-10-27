<script lang="ts">
    import "bootstrap/dist/css/bootstrap.min.css";
    import { onMount } from "svelte";
    import { getServicios, saveServicio, updateServicio, deleteServicio } from "../../services/apiService";
    import type { Servicio } from "../../models/Servicio";
    import Header from "../../lib/components/Header.svelte";
    import { authStore } from "$lib/store/authStore";
    import { get } from "svelte/store";

    let servicios: Servicio[] = [];
    let error: string | null = null;
    let isLoading = true;
    let nombre = "";
    let precio = 0;
    let isSaving = false;
    let isEditing = false;
    let editServicioId: number | null = null;
    const { user } = get(authStore);

    onMount(async () => {
        // Importar Bootstrap JavaScript solo en el cliente
        const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
        (window as any).bootstrap = bootstrap;

        try {
            servicios = await getServicios();
        } catch (err) {
            const errorObj = err as Error;
            error = errorObj.message;
        } finally {
            isLoading = false;
        }
    });

    async function agregarServicio() {
        isSaving = true;
        try {
            const newServicio = { nombre, precio, companyId: user?.companyId };
            await saveServicio(newServicio);
            servicios = await getServicios(); // Refrescar la lista de servicios
            nombre = "";
            precio = 0;
            const modalElement = document.getElementById('addServicioModal');
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

    async function editarServicio() {
        isSaving = true;
        try {
            const updatedServicio = { ServicioId: editServicioId, nombre, precio, companyId: user?.companyId };
            if (editServicioId !== null) {
                await updateServicio(editServicioId, updatedServicio);
            }
            servicios = await getServicios(); // Refrescar la lista de servicios
            nombre = "";
            precio = 0;
            editServicioId = null;
            isEditing = false;
            const modalElement = document.getElementById('addServicioModal');
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

    async function borrarServicio(servicioId: number) {
        try {
            await deleteServicio(servicioId);
            servicios = await getServicios(); // Refrescar la lista de servicios
        } catch (err) {
            const errorObj = err as Error;
            error = errorObj.message;
        }
    }

    function abrirModalAgregar() {
        nombre = "";
        precio = 0;
        isEditing = false;
        const modalElement = document.getElementById('addServicioModal');
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement); // Utilizar window.bootstrap
            modal.show();
        }
    }

    function abrirModalEditar(servicio: Servicio) {
        nombre = servicio.nombre;
        precio = servicio.precio;
        editServicioId = servicio.servicioId;
        isEditing = true;
        const modalElement = document.getElementById('addServicioModal');
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement); // Utilizar window.bootstrap
            modal.show();
        }
    }
</script>

<Header />
<div class="container mt-5">
    <h1 class="text-center mb-4">Lista de Servicios</h1>
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
        <button class="btn btn-success" on:click={abrirModalAgregar}>Agregar Servicio</button>
    </div>
    {#if !isLoading && servicios.length > 0}
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Compañía</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each servicios as servicio}
                        <tr>
                            <th scope="row">{servicio.servicioId}</th>
                            <td>{servicio.nombre}</td>
                            <td>{servicio.precio}</td>
                            <td>{servicio.company?.name}</td>
                            <td>
                                <button class="btn btn-primary btn-sm me-2" on:click={() => abrirModalEditar(servicio)}>Editar</button>
                                <button class="btn btn-danger btn-sm" on:click={() => borrarServicio(servicio.servicioId)}>Borrar</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
    {#if !isLoading && servicios.length === 0}
        <p class="text-center">No hay servicios disponibles.</p>
    {/if}
</div>

<!-- Modal para agregar/editar servicio -->
<div class="modal fade" id="addServicioModal" tabindex="-1" aria-labelledby="addServicioModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addServicioModalLabel">{isEditing ? 'Editar Servicio' : 'Agregar Servicio'}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form on:submit|preventDefault={isEditing ? editarServicio : agregarServicio}>
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" bind:value={nombre} required />
                    </div>
                    <div class="mb-3">
                        <label for="precio" class="form-label">Precio</label>
                        <input type="number" class="form-control" id="precio" bind:value={precio} required />
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