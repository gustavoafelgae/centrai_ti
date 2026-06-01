import { Slot } from 'expo-router';
import { UserProvider } from '../hooks/UserContext';

export default function RootLayout() {
  return (
    // O Provider faz com que todo o app tenha acesso aos dados do usuário
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
