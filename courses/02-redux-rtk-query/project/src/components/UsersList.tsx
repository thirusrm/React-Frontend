import { useQueryHook } from "../hooks/useQueryHook";

const UsersList = () => {
  const { data, isLoading, error } = useQueryHook();

  if (isLoading) {
    return <div data-testid="users-loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="users-error">Error loading users.</div>;
  }

  return (
    <div data-testid="users-list">
      {data?.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
