import Avatar from '@/components/ui/avatar';
import { useNavigation } from 'expo-router';
import { Fragment, useEffect, useState } from 'react';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import verificationIcon from '@/assets/images/user-default.png';
import bars from '@/assets/images/bars.png';
import ProfileDropdown from '@/components/menus/profile-dropdown';
import { useAuth } from '@/firebase/auth-context';
import MainTrackingAnimal from '@/components/pages/home/tracking-device';
import { useTracking } from '@/firebase/tracking-context';
import GeofenceSetupScreen from '../../components/pages/setup-screen';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const { user } = useAuth();
    const { homeId } = useTracking();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Avatar
                    imgSrc={verificationIcon}
                    containerClassName="rounded-full bg-white ml-3 border border-black/20"
                    className="w-12 h-12 rounded-full"
                />
            ),
            headerTitle: () => (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-lg text-white">{ user?.fullName }</Text>
                    <Text className="text-xs text-gray-300">Kigali, Bweramvura</Text>
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
        });
    }, [navigation, menuVisible, user]);

    return (
        <Fragment>
            {homeId ? <MainTrackingAnimal /> : <GeofenceSetupScreen />}
        </Fragment>
    );
}