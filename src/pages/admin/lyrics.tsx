import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Box,
  Container,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useDisclosure,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface Category {
  id: string;
  name: string;
}

interface Lyric {
  id: string;
  title: string;
  artist: string;
  category?: string;  // Made optional
  lyrics: string;
}

interface FormData {
  title: string;
  artist: string;
  category: string;
  lyrics: string;
}

const LyricsManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const toast = useToast();
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentLyric, setCurrentLyric] = useState<Lyric | null>(null);

  // Add form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    artist: '',
    category: '',
    lyrics: '',
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchLyrics();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error fetching categories',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchLyrics = async () => {
    try {
      const response = await fetch('/api/lyrics');
      if (!response.ok) throw new Error('Failed to fetch lyrics');
      const data = await response.json();
      setLyrics(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      toast({
        title: 'Error fetching lyrics',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = currentLyric ? `/api/lyrics/${currentLyric.id}` : '/api/lyrics';
      const method = currentLyric ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save lyric');
      
      fetchLyrics(); // Refresh the list
      onClose();
      setFormData({
        title: '',
        artist: '',
        category: '',
        lyrics: '',
      });
      setCurrentLyric(null);
      
      toast({
        title: `Lyric ${currentLyric ? 'updated' : 'added'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving lyric:', error);
      toast({
        title: 'Error saving lyric',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (lyric: Lyric) => {
    setCurrentLyric(lyric);
    setFormData({
      title: lyric.title,
      artist: lyric.artist,
      category: lyric.category || '',
      lyrics: lyric.lyrics,
    });
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lyric?')) {
      try {
        const response = await fetch(`/api/lyrics/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete lyric');
        
        fetchLyrics(); // Refresh the list
        
        toast({
          title: 'Lyric deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting lyric:', error);
        toast({
          title: 'Error deleting lyric',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) {
    router.push('/api/auth/login');
    return null;
  }

  return (
    <Container maxW="container.xl" py={8} bg="gray.900" borderRadius="xl">
      <Stack spacing={6}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading color="white">Manage Lyrics</Heading>
          <Button colorScheme="blue" onClick={() => {
            setCurrentLyric(null);
            setFormData({
              title: '',
              artist: '',
              category: '',
              lyrics: '',
            });
            onOpen();
          }}>
            Add New Lyric
          </Button>
        </Box>

        <Table variant="simple" bg="gray.800" color="white" borderRadius="lg" overflow="hidden">
          <Thead bg="gray.700">
            <Tr>
              <Th color="gray.100">Title</Th>
              <Th color="gray.100">Artist</Th>
              <Th color="gray.100">Category</Th>
              <Th color="gray.100">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lyrics.map((lyric) => (
              <Tr key={lyric.id} _hover={{ bg: 'gray.700' }}>
                <Td color="gray.100">{lyric.title}</Td>
                <Td color="gray.100">{lyric.artist}</Td>
                <Td color="gray.100">{lyric.category || 'Uncategorized'}</Td>
                <Td>
                  <Button size="sm" mr={2} onClick={() => handleEdit(lyric)} colorScheme="blue">
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDelete(lyric.id)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg="gray.800" color="white">
            <ModalHeader>
              {currentLyric ? 'Edit Lyric' : 'Add New Lyric'}
            </ModalHeader>
            <ModalCloseButton color="gray.100" />
            <ModalBody pb={6}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color="gray.100">Title</FormLabel>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                      placeholder="Enter title"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.100">Artist</FormLabel>
                    <Input
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                      placeholder="Enter artist name"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="gray.100">Category (Optional)</FormLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Select category (optional)"
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.100">Lyrics</FormLabel>
                    <Textarea
                      value={formData.lyrics}
                      onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                      rows={10}
                      bg="gray.700"
                      color="white"
                      borderColor="gray.600"
                      _hover={{ borderColor: 'gray.500' }}
                      _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                      placeholder="Enter lyrics"
                    />
                  </FormControl>

                  <Button type="submit" colorScheme="blue" mt={4}>
                    {currentLyric ? 'Update Lyric' : 'Add Lyric'}
                  </Button>
                </Stack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Stack>
    </Container>
  );
};

export default LyricsManagement; 