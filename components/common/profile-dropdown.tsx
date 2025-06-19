import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/firebase/auth-context';
import { useRouter } from 'expo-router';

interface ProfileDropdownProps {
    setMenuVisible: (visible: boolean) => void;
}
const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ setMenuVisible }) => {
    const { logout, loading } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        setMenuVisible(false);
        await logout();
    };

    return (
        <View className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[120px]">
            <TouchableOpacity
                onPress={() => {
                    setMenuVisible(false);
                    router.push('/(tabs)/profile');
                }}
                className="p-3 flex-row items-center"
            >
                <MaterialIcons name="person" size={20} color="black" style={{ marginRight: 8 }} />
                <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleLogout}
                className="p-3 flex-row items-center"
                disabled={loading}
            >
                <MaterialIcons name="logout" size={20} color="black" style={{ marginRight: 8 }} />
                <Text>{loading ? "Logging out..." : "Logout"}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileDropdown