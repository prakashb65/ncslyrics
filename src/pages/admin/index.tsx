import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Card,
  CardBody,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Icon,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FiUsers, FiMusic, FiFolder, FiSettings } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const cardBg = useColorModeValue('gray.800', 'gray.700');
  const cardHoverBg = useColorModeValue('gray.700', 'gray.600');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <Box p={8}>Loading...</Box>;
  if (error) return <Box p={8}>{error.message}</Box>;

  const stats = [
    { label: 'Total Users', value: '0', icon: FiUsers, helpText: 'Registered users' },
    { label: 'Total Lyrics', value: '0', icon: FiMusic, helpText: 'Published lyrics' },
    { label: 'Categories', value: '0', icon: FiFolder, helpText: 'Active categories' },
  ];

  const actions = [
    { title: 'Manage Lyrics', desc: 'Add, edit, or remove song lyrics', path: '/admin/lyrics', icon: FiMusic },
    { title: 'Manage Categories', desc: 'Create and organize categories', path: '/admin/categories', icon: FiFolder },
    { title: 'Manage Users', desc: 'View and manage user accounts', path: '/admin/users', icon: FiUsers },
    { title: 'Settings', desc: 'Configure admin panel settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="container.xl">
        <Stack spacing={8}>
          <Box>
            <Heading size="lg" mb={2}>Welcome back, {user?.name}</Heading>
            <Text color="gray.400">Manage your application from here</Text>
          </Box>

          {/* Stats Overview */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {stats.map((stat, idx) => (
              <Card key={idx} bg={cardBg} border="1px" borderColor="gray.700">
                <CardBody>
                  <Stat>
                    <Flex align="center" mb={2}>
                      <Icon as={stat.icon} boxSize={6} color="blue.400" mr={2} />
                      <StatLabel fontSize="lg">{stat.label}</StatLabel>
                    </Flex>
                    <StatNumber fontSize="3xl">{stat.value}</StatNumber>
                    <StatHelpText color="gray.400">{stat.helpText}</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Quick Actions */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            {actions.map((action, idx) => (
              <Card
                key={idx}
                bg={cardBg}
                border="1px"
                borderColor="gray.700"
                cursor="pointer"
                onClick={() => router.push(action.path)}
                _hover={{ bg: cardHoverBg, transform: 'translateY(-2px)' }}
                transition="all 0.2s"
              >
                <CardBody>
                  <Flex align="center" mb={3}>
                    <Icon as={action.icon} boxSize={6} color="blue.400" mr={3} />
                    <Heading size="md">{action.title}</Heading>
                  </Flex>
                  <Text color="gray.400">{action.desc}</Text>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;