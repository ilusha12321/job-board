import { View, Text, Button } from "react-native";
import { useAuth } from "../app/AuthContext";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Text>
        Hello, {user?.username} ({user?.role})
      </Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
