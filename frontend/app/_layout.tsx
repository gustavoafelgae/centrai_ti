// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '../src/hooks/UserContext';
import { TicketProvider } from '../src/hooks/TicketContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <TicketProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ gestureEnabled: false }} />
          <Stack.Screen name="home" options={{ gestureEnabled: false }} />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="profile/index" />
          <Stack.Screen name="profile/edit"/>
          <Stack.Screen name="analyst" />
          <Stack.Screen name="servicos/index" />
          <Stack.Screen name="servicos/[id]" />
          <Stack.Screen name="tickets/index" />
          <Stack.Screen name="tickets/[id]" />
          <Stack.Screen name="tickets/new" />
        </Stack>
      </TicketProvider>
    </UserProvider>
  );
}