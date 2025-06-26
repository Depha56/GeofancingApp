import { homeOptions } from '@/components/common/home-nav-options';
import FarmSummaryInfo from '@/components/pages/farm-summary';
import GeofenceSetupScreen from '@/components/pages/setup-screen';
import { useAuth } from '@/firebase/auth-context';
import { useTracking } from '@/firebase/tracking-context';
import { useNavigation } from 'expo-router';
import {  useEffect, useState } from 'react';
import { View } from 'react-native';

export default function Settings() {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const { user } = useAuth();
    const { farmRadius, farmCenterCoordinates, collarIds } = useTracking();
    const [isEditFarm, setIsEditFarm ] = useState(false);
    const updateCenterCoordinates: [number, number] = farmCenterCoordinates ? [farmCenterCoordinates.longitude, farmCenterCoordinates.latitude] : [30.1127, -1.9577]

    useEffect(() => {
        navigation.setOptions(homeOptions(user, setMenuVisible, menuVisible));
    }, [navigation, menuVisible, user]);


    return (
        <View className="flex-1 bg-gray-50 p-4">
           {/* Farm Summary Card */}
           {!isEditFarm 
            ? <FarmSummaryInfo setIsEditFarm={ setIsEditFarm }/> 
            : <GeofenceSetupScreen 
                updateCenter={ updateCenterCoordinates } 
                updateRadius={ farmRadius! } 
                updateCollarId={ collarIds[0] }
                setIsEditFarm ={ setIsEditFarm } />
            }
        </View>
    );
}
