import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        mx="auto"
        w="auto"
        h="auto"
        maxW={[280, 480, 900]}
        maxH={[350, 450, 600]}
      >
        <ModalBody>
          <Image
            src={imgUrl}
            maxW={[280, 480, 900]}
            maxH={[350, 450, 600]}
            alt="Image View"
          />
        </ModalBody>

        <ModalFooter bg="pGray.700" h="10" py="6" borderBottomRadius={4}>
          <Link href={imgUrl} isExternal fontSize="1rem" mr="auto">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
