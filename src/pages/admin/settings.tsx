import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import {
  Container,
  Stack,
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Divider,
  useToast,
  VStack,
} from '@chakra-ui/react';

export default function AdminSettings() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const toast = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) {
    router.push('/api/auth/login');
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Here you would typically make an API call to change the password
    toast({
      title: 'Password change functionality will be implemented with your authentication service',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={8} bg="gray.900" borderRadius="xl" minH="calc(100vh - 4rem)">
      <Stack spacing={8}>
        <Heading color="white" size="lg">Admin Settings</Heading>

        {/* Profile Section */}
        <Box bg="gray.800" p={6} borderRadius="lg">
          <VStack spacing={6} align="start">
            <Heading size="md" color="white">Profile Information</Heading>
            
            <Stack direction={{ base: 'column', md: 'row' }} spacing={6} align="center" w="full">
              <Avatar
                size="xl"
                src={user.picture || undefined}
                name={user.name || 'Admin User'}
              />
              <Box flex="1">
                <Text color="gray.300" fontSize="sm">Name</Text>
                <Text color="white" fontSize="lg" fontWeight="medium">{user.name}</Text>
                
                <Text color="gray.300" fontSize="sm" mt={4}>Email</Text>
                <Text color="white" fontSize="lg" fontWeight="medium">{user.email}</Text>
              </Box>
            </Stack>
          </VStack>
        </Box>

        {/* Password Change Section */}
        <Box bg="gray.800" p={6} borderRadius="lg">
          <VStack spacing={6} align="start" w="full">
            <Heading size="md" color="white">Change Password</Heading>
            
            {!isChangingPassword ? (
              <Button
                colorScheme="blue"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </Button>
            ) : (
              <form onSubmit={handlePasswordChange} style={{ width: '100%' }}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel color="gray.100">Current Password</FormLabel>
                    <Input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value
                      })}
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.100">New Password</FormLabel>
                    <Input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value
                      })}
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.100">Confirm New Password</FormLabel>
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value
                      })}
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                    />
                  </FormControl>

                  <Button type="submit" colorScheme="blue" mt={4}>
                    Update Password
                  </Button>
                </Stack>
              </form>
            )}
          </VStack>
        </Box>

        {/* Logout Section */}
        <Box bg="gray.800" p={6} borderRadius="lg">
          <VStack spacing={6} align="start" w="full">
            <Heading size="md" color="white">Session</Heading>
            
            <Button
              colorScheme="red"
              onClick={() => router.push('/api/auth/logout')}
            >
              Logout
            </Button>
          </VStack>
        </Box>
      </Stack>
    </Container>
  );
} 