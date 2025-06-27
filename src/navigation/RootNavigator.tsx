import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';


const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Tabs" component={TabNavigator} /> */}
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}