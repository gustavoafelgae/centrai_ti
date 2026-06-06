import { Slot } from 'expo-router';
import { UserProvider } from '../hooks/UserContext';
import { TicketProvider } from '../hooks/TicketContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <TicketProvider>
        <Slot />
      </TicketProvider>
    </UserProvider>
  );
}