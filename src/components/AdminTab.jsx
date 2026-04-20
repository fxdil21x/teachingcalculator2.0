export default function AdminTab({ users, onApprove, onReject, onDelete }) {
  return (
    <div className="tab-content active">
      <h2>Admin Panel</h2>
      <div>
        {users.length === 0 && <p>No users found.</p>}
        {users.map((user) => (
          <div className="entry-item" key={user.id}>
            <div>
              <strong>{user.email}</strong>
              <br />
              <small>Status: {user.status}</small>
            </div>
            <div className="admin-actions">
              <button type="button" onClick={() => onApprove(user.id)}>
                Approve
              </button>
              <button type="button" className="reject" onClick={() => onReject(user.id)}>
                Reject
              </button>
              <button type="button" className="reject" onClick={() => onDelete(user.id, user.email)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
