import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Stack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin: string;
}

const UsersManagement = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    // TODO: Implement role change functionality
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // TODO: Implement user deletion
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) {
    router.push('/api/auth/login');
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading>Manage Users</Heading>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Last Login</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge
                    colorScheme={user.role === 'admin' ? 'green' : 'blue'}
                  >
                    {user.role}
                  </Badge>
                </Td>
                <Td>{new Date(user.lastLogin).toLocaleDateString()}</Td>
                <Td>
                  <Button
                    size="sm"
                    mr={2}
                    onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                  >
                    {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Container>
  );
};

export default UsersManagement; 