import { useNavigation } from 'expo-router';
import { Fragment, useEffect, useState } from 'react';
import { useAuth } from '@/firebase/auth-context';
import MainTrackingAnimal from '@/components/pages/tracking-device';
import { useTracking } from '@/firebase/tracking-context';
import GeofenceSetupScreen from '@/components/pages/setup-screen';
import { homeOptions } from '@/components/common/home-nav-options';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const { user } = useAuth();
    const { farmId } = useTracking();

    useEffect(() => {
        navigation.setOptions(homeOptions(user, setMenuVisible, menuVisible));
    }, [navigation, menuVisible, user]);

    return (
        <Fragment>
            {farmId ? <MainTrackingAnimal /> : <GeofenceSetupScreen />}
        </Fragment>
    );
}