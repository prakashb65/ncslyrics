import { useState } from 'react';
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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface Lyric {
  id: string;
  title: string;
  artist: string;
  category: string;
  lyrics: string;
}

const LyricsManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  const [currentLyric, setCurrentLyric] = useState<Lyric | null>(null);

  // Add form state
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    category: '',
    lyrics: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save lyrics
    onClose();
  };

  const handleEdit = (lyric: Lyric) => {
    setCurrentLyric(lyric);
    setFormData(lyric);
    onOpen();
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete functionality
    if (window.confirm('Are you sure you want to delete this lyric?')) {
      // API call to delete
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
          <Heading>Manage Lyrics</Heading>
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

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Artist</Th>
              <Th>Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {lyrics.map((lyric) => (
              <Tr key={lyric.id}>
                <Td>{lyric.title}</Td>
                <Td>{lyric.artist}</Td>
                <Td>{lyric.category}</Td>
                <Td>
                  <Button size="sm" mr={2} onClick={() => handleEdit(lyric)}>
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
          <ModalContent>
            <ModalHeader>
              {currentLyric ? 'Edit Lyric' : 'Add New Lyric'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Artist</FormLabel>
                    <Input
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      required
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      {/* TODO: Add categories dynamically */}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Lyrics</FormLabel>
                    <Textarea
                      value={formData.lyrics}
                      onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                      required
                      rows={10}
                    />
                  </FormControl>

                  <Button type="submit" colorScheme="blue" mr={3}>
                    {currentLyric ? 'Update' : 'Save'}
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