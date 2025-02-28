import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiUsers, FiMusic, FiFolder, FiSettings } from 'react-icons/fi';

interface NavItemProps {
  icon: any;
  children: string;
  path: string;
}

const NavItem = ({ icon, children, path }: NavItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === path;
  const activeBg = useColorModeValue('blue.500', 'blue.400');
  const inactiveBg = useColorModeValue('gray.700', 'gray.600');
  const activeColor = 'white';
  const inactiveColor = 'gray.100';

  return (
    <Link
      as={NextLink}
      href={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        _hover={{
          bg: isActive ? activeBg : inactiveBg,
          color: activeColor,
        }}
        transition="all 0.2s"
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          color={isActive ? activeColor : inactiveColor}
        />
        <Text fontSize="sm" fontWeight={isActive ? 'bold' : 'normal'}>
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

const AdminSidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: FiHome, path: '/admin' },
    { name: 'Lyrics', icon: FiMusic, path: '/admin/lyrics' },
    { name: 'Categories', icon: FiFolder, path: '/admin/categories' },
    { name: 'Users', icon: FiUsers, path: '/admin/users' },
    { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
  ];

  return (
    <Box
      bg={useColorModeValue('gray.900', 'gray.800')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.800', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <VStack align="stretch" spacing={1} mt={8}>
        {navItems.map((item) => (
          <NavItem key={item.name} icon={item.icon} path={item.path}>
            {item.name}
          </NavItem>
        ))}
      </VStack>
    </Box>
  );
};

export default AdminSidebar; 