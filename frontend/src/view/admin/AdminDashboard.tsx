import React from 'react';
import { useAdminDashboardLogic } from '../../controller/AdminDashboardController';
import './AdminDashboard.css';
import UserHeader from '../../component/userHeader';

const AdminDashboard: React.FC = () => {
  const {
    users,
    isEditing,
    currentUserId,
    editedUser,
    handleEdit,
    handleSave,
    handleDelete,
    handleFieldChange,
  } = useAdminDashboardLogic();

  return (
    <div>
      <UserHeader />
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {isEditing && user.id === currentUserId ? (
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username || ''}
                    onChange={handleFieldChange}
                  />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {isEditing && user.id === currentUserId ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email || ''}
                    onChange={handleFieldChange}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {isEditing && user.id === currentUserId ? (
                  <input
                    type="text"
                    name="contact"
                    value={editedUser.contact || ''}
                    onChange={handleFieldChange}
                  />
                ) : (
                  user.contact
                )}
              </td>
              <td>
                {isEditing && user.id === currentUserId ? (
                  <input
                    type="password"
                    name="password"
                    value={editedUser.password || ''}
                    onChange={handleFieldChange}
                  />
                ) : (
                  '******'
                )}
              </td>
              <td>
                {isEditing && user.id === currentUserId ? (
                  <button onClick={handleSave}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user.id)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
