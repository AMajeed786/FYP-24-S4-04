import { useState, useEffect } from 'react';
import { User, fetchUsers, updateUser, deleteUser } from '../model/AdminModel'; // Import deleteUser

export const useAdminDashboardLogic = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User>({
    id: '',
    username: '',
    email: '',
    contact: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userList = await fetchUsers();
      setUsers(userList);
    };

    fetchUserData();
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (userId: string) => {
    setCurrentUserId(userId);
    const userToEdit = users.find(user => user.id === userId);
    setEditedUser(userToEdit || { id: '', username: '', email: '', contact: '', password: '' });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentUserId) return;

    await updateUser(currentUserId, editedUser);

    setUsers(prevUsers =>
      prevUsers.map(user => (user.id === currentUserId ? { ...user, ...editedUser } : user))
    );
    setIsEditing(false);
    setCurrentUserId(null);
  };

  // Function to delete a user
  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId)); // Update the state to remove the deleted user
  };

  return {
    users,
    isEditing,
    currentUserId,
    editedUser,
    handleEdit,
    handleSave,
    handleDelete, // Expose handleDelete
    handleFieldChange,
  };
};
