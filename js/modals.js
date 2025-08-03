class ModalManager {
    constructor() {
        this.activeModal = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Cerrar modal al hacer click en el overlay
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                this.closeModal(event.target.id);
            }
        });

        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            this.activeModal = modalId;

            // Foco en el primer elemento focuseable
            const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }

            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            this.activeModal = null;

            // Restaurar scroll del body
            document.body.style.overflow = '';
        }
    }

    createConfirmModal(options = {}) {
        const {
            title = 'Confirmar acción',
            message = '¿Estás seguro de que deseas continuar?',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            onConfirm = () => { },
            onCancel = () => { },
            type = 'danger' // 'danger', 'warning', 'info'
        } = options;

        // Crear modal dinámicamente
        const modalId = 'dynamic-confirm-modal';
        let existingModal = document.getElementById(modalId);

        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div class="modal" id="${modalId}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="modalManager.closeModal('${modalId}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="modalManager.handleCancel('${modalId}')">
                            ${cancelText}
                        </button>
                        <button class="btn btn-${type}" onclick="modalManager.handleConfirm('${modalId}')">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Guardar callbacks
        this.confirmCallback = onConfirm;
        this.cancelCallback = onCancel;

        this.openModal(modalId);
    }

    handleConfirm(modalId) {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
        this.closeModal(modalId);
        this.cleanup();
    }

    handleCancel(modalId) {
        if (this.cancelCallback) {
            this.cancelCallback();
        }
        this.closeModal(modalId);
        this.cleanup();
    }

    cleanup() {
        this.confirmCallback = null;
        this.cancelCallback = null;

        // Remover modal dinámico después de un delay
        setTimeout(() => {
            const modal = document.getElementById('dynamic-confirm-modal');
            if (modal) {
                modal.remove();
            }
        }, 300);
    }
}

// Instancia global del manejador de modales
const modalManager = new ModalManager();

// Funciones de conveniencia
function showConfirmDialog(options) {
    modalManager.createConfirmModal(options);
}

function showDeleteConfirm(itemName, onConfirm) {
    showConfirmDialog({
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger',
        onConfirm: onConfirm
    });
}

function showSuccessModal(message) {
    modalManager.createConfirmModal({
        title: '¡Éxito!',
        message: message,
        confirmText: 'Continuar',
        cancelText: '',
        type: 'success',
        onConfirm: () => { }
    });
}

function showErrorModal(message) {
    modalManager.createConfirmModal({
        title: 'Error',
        message: message,
        confirmText: 'Entendido',
        cancelText: '',
        type: 'danger',
        onConfirm: () => { }
    });
}