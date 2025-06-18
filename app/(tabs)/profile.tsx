import { View, Text, Image } from "react-native";

const Profile = () => {
    return (
        <View className="flex-1 items-center justify-center bg-white p-6">
            <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/75.jpg" }}
                className="w-32 h-32 rounded-full mb-6 border-4 border-blue-500"
            />
            <Text className="text-2xl font-bold mb-2 text-gray-800">
                John Doe
            </Text>
            <Text className="text-base text-gray-600 mb-1">
                📞 +1 234 567 8901
            </Text>
            <Text className="text-base text-gray-600 mb-1">
                📧 johndoe@email.com
            </Text>
            <Text className="text-base text-gray-600">
                🏠 123 Main St, Springfield, USA
            </Text>
        </View>
    );
};

export default Profile;
