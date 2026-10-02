import Modal from './Modal';

export default function ConfirmDialog({ task, busy, onConfirm, onCancel }) {
  return (
    <Modal title="Delete task?" onClose={onCancel}>
      <p>
        Are you sure you want to delete <strong>{task.title}</strong>? This cannot be
        undone.
      </p>
      <div className="form-actions">
        <button className="btn" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button className="btn btn-danger-solid" onClick={onConfirm} disabled={busy}>
          {busy ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}