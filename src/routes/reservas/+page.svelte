<script lang="ts">
    import "bootstrap/dist/css/bootstrap.min.css";
    import { onMount } from "svelte";
    import { getReservas, saveReserva, updateReserva, deleteReserva, getClientes, getServicios } from "../../services/apiService";
    import type { Reserva } from "../../models/Reserva";
    import type { Cliente } from "../../models/Cliente";
    import type { Servicio } from "../../models/Servicio";
    import Header from "../../lib/components/Header.svelte";

    let reservas: Reserva[] = [];
    let clientes: Cliente[] = [];
    let servicios: Servicio[] = [];
    let error: string | null = null;
    let isLoading = true;
    let fechaReserva: string = "";
    let clienteId: number | null = null;
    let servicioId: number | null = null;
    let isSaving = false;
    let isEditing = false;
    let editReservaId: number | null = null;

    onMount(async () => {
        // Importar Bootstrap JavaScript solo en el cliente
        const bootstrap = await import("bootstrap/dist/js/bootstrap.bundle.min.js");
        (window as any).bootstrap = bootstrap;

        try {
            reservas = await getReservas();
            clientes = await getClientes();
            servicios = await getServicios();
        } catch (err) {
            const errorObj = err as Error;
            error = errorObj.message;
        } finally {
            isLoading = false;
        }
    });

    async function agregarReserva() {
        isSaving = true;
        try {
            const newReserva: Reserva = {
                reservaId: 0, // El ID se generará en el backend
                fechaReserva: new Date(fechaReserva),
                clienteId: clienteId!,
                servicioId: servicioId!
            };
            await saveReserva(newReserva);
            reservas = await getReservas(); // Refrescar la lista de reservas
            fechaReserva = "";
            clienteId = null;
            servicioId = null;
            const modalElement = document.getElementById('addReservaModal');
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

    async function editarReserva() {
        isSaving = true;
        try {
            const updatedReserva: Reserva = {
                reservaId: editReservaId!,
                fechaReserva: new Date(fechaReserva),
                clienteId: clienteId!,
                servicioId: servicioId!
            };
            if (editReservaId !== null) {
                await updateReserva(editReservaId, updatedReserva);
            }
            reservas = await getReservas(); // Refrescar la lista de reservas
            fechaReserva = "";
            clienteId = null;
            servicioId = null;
            editReservaId = null;
            isEditing = false;
            const modalElement = document.getElementById('addReservaModal');
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

    async function borrarReserva(reservaId: number) {
        try {
            await deleteReserva(reservaId);
            reservas = await getReservas(); // Refrescar la lista de reservas
        } catch (err) {
            const errorObj = err as Error;
            error = errorObj.message;
        }
    }

    function abrirModalAgregar() {
        fechaReserva = "";
        clienteId = null;
        servicioId = null;
        isEditing = false;
        const modalElement = document.getElementById('addReservaModal');
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement); // Utilizar window.bootstrap
            modal.show();
        }
    }

    function abrirModalEditar(reserva: Reserva) {
        fechaReserva = new Date(reserva.fechaReserva).toISOString().split('T')[0];
        clienteId = reserva.cliente?.clienteId || null;
        servicioId = reserva.servicio?.servicioId || null;
        editReservaId = reserva.reservaId;
        isEditing = true;
        const modalElement = document.getElementById('addReservaModal');
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement); // Utilizar window.bootstrap
            modal.show();
        }
    }

    function limpiarModal() {
        fechaReserva = "";
        clienteId = null;
        servicioId = null;
        editReservaId = null;
        isEditing = false;
    }
</script>

<Header />
<div class="container mt-5">
    <h1 class="text-center mb-4">Lista de Reservas</h1>
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
        <button class="btn btn-success" on:click={abrirModalAgregar}>Agregar Reserva</button>
    </div>
    {#if !isLoading && reservas.length > 0}
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Servicio</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {#each reservas as reserva}
                        <tr>
                            <th scope="row">{reserva.reservaId}</th>
                            <td>{new Date(reserva.fechaReserva).toLocaleDateString()}</td>
                            <td>{reserva.cliente?.nombre}</td>
                            <td>{reserva.servicio?.nombre}</td>
                            <td>
                                <button class="btn btn-primary btn-sm me-2" on:click={() => abrirModalEditar(reserva)}>Editar</button>
                                <button class="btn btn-danger btn-sm" on:click={() => borrarReserva(reserva.reservaId)}>Borrar</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
    {#if !isLoading && reservas.length === 0}
        <p class="text-center">No hay reservas disponibles.</p>
    {/if}
</div>

<!-- Modal para agregar/editar reserva -->
<div class="modal fade" id="addReservaModal" tabindex="-1" aria-labelledby="addReservaModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="addReservaModalLabel">{isEditing ? 'Editar Reserva' : 'Agregar Reserva'}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form on:submit|preventDefault={isEditing ? editarReserva : agregarReserva}>
                    <div class="mb-3">
                        <label for="fechaReserva" class="form-label">Fecha</label>
                        <input type="date" class="form-control" id="fechaReserva" bind:value={fechaReserva} required />
                    </div>
                    <div class="mb-3">
                        <label for="clienteId" class="form-label">Cliente</label>
                        <select class="form-select" id="clienteId" bind:value={clienteId} required>
                            <option value="" disabled selected>Seleccione un cliente</option>
                            {#each clientes as cliente}
                                <option value={cliente.clienteId}>{cliente.nombre}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="servicioId" class="form-label">Servicio</label>
                        <select class="form-select" id="servicioId" bind:value={servicioId} required>
                            <option value="" disabled selected>Seleccione un servicio</option>
                            {#each servicios as servicio}
                                <option value={servicio.servicioId}>{servicio.nombre}</option>
                            {/each}
                        </select>
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