import { Stack } from 'expo-router';
import { UserProvider } from '../hooks/UserContext';
import { TicketProvider } from '../hooks/TicketContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <TicketProvider>
        <Stack  />
      </TicketProvider>
    </UserProvider>
  );
}