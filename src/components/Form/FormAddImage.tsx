import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface ImageModel {
  url: string;
  title: string;
  description: string;
}

const typesImageAccept = ['image/jpg', 'image/png', 'image/gif'];
const sizeMaxFile = 10 * 1024 * 1024;

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Imagem Obrigatória',
      validate: {
        lessThan10MB: file => {
          const image = file[0];

          return (
            image.size < sizeMaxFile || 'A imagem deve ter no máximo 10 Mb.'
          );
        },
        acceptedFormats: file => {
          const image = file[0];
          const isTypeValid = typesImageAccept.includes(image.type);

          return isTypeValid || 'O formato deve ser JPG, PNG ou GIF';
        },
      },
    },
    title: {
      required: 'Título Obrigatório',
      minLength: {
        value: 2,
        message: 'O número mínimo de caracteres é de  2',
      },
      maxLength: {
        value: 20,
        message: 'O número máximo de caracteres é de  20',
      },
    },
    description: {
      required: 'Descrição Obrigatória',
      maxLength: {
        value: 65,
        message: 'O número máximo de caracteres é de 65',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data: ImageModel) => {
      const response = await api.post('/api/images', {
        ...data,
        url: imageUrl,
      });
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: ImageModel): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          status: 'error',
          title: 'Ops',
          description: 'A imagem é obrigatória!',
        });
        return;
      }

      await mutation.mutateAsync(data);
      toast({
        status: 'success',
        title: 'Sucesso!',
        description: 'A imagem foi cadastrada com sucesso!',
      });
    } catch {
      toast({
        status: 'error',
        title: 'Ops',
        description: 'Erro ao enviar a imagem, tente novamente!',
      });
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
