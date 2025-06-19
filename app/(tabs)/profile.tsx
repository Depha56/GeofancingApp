import { StatusBar } from "expo-status-bar";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const Profile = () => {
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="dark" />

      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-white w-full rounded-3xl shadow-xl p-6 items-center relative">

          <TouchableOpacity
            className="absolute top-4 right-4 p-2 rounded-full bg-blue-100"
            accessibilityLabel="Edit Profile"
          >
            <FontAwesome6 name="edit" size={20} color="#2563EB" />
          </TouchableOpacity>

          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }}
            className="w-32 h-32 rounded-full mb-4 border-4 border-blue-500"
          />

          <Text className="text-2xl font-bold text-gray-800 mb-1">John Doe</Text>
          <Text className="text-sm text-gray-500 mb-4">Software Engineer</Text>

          <View className="w-full px-4">
            <View className="mb-2">
              <Text className="text-gray-500 text-sm">Phone</Text>
              <Text className="text-gray-800 font-medium">+1 234 567 8901</Text>
            </View>
            <View className="mb-2">
              <Text className="text-gray-500 text-sm">Email</Text>
              <Text className="text-gray-800 font-medium">johndoe@email.com</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Address</Text>
              <Text className="text-gray-800 font-medium">123 Main St, Springfield, USA</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Profile;
