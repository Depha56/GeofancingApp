import { Image, Text, TouchableOpacity, View } from "react-native";
import Avatar from "../ui/avatar";
import ProfileDropdown from "./profile-dropdown";
import bars from '@/assets/images/bars.png';
import { Dispatch } from "react";
import { UserType } from "@/firebase/auth-context";

export const homeOptions = (user: UserType, setMenuVisible: Dispatch<React.SetStateAction<boolean>>, menuVisible: boolean) => ({
    headerLeft: () => (
        <Avatar
            imgSrc={ user?.photoURL }
            containerClassName="rounded-full bg-white ml-3 border border-black/20"
            className="w-12 h-12 rounded-full"
        />
    ),
    headerTitle: () => (
        <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-white">{ user?.fullName }</Text>
                <Text className="text-xs text-gray-300">{ user?.address  ||  user?.role }</Text>
            </View>
        ),
    headerRight: () => (
        <View className="relative">
            <TouchableOpacity onPress={() => setMenuVisible((v) => !v)}>
                <Image source={bars} className="w-10 h-10 mr-3" />
            </TouchableOpacity>
            {menuVisible && (
                <ProfileDropdown setMenuVisible={setMenuVisible} />
            )}
        </View>
    ),
    headerTitleAlign: "center",
    headerShadowVisible: true,
    headerStyle: {
        backgroundColor: '#103060'
    },
})