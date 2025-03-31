import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
    const navigation = useNavigation()
    useEffect(()=> {
        navigation.setOptions({
            headerLeft:()=> <Text>Left</Text>,
            
            headerRight:()=><Text>Center</Text>,
            
            headerTitle:() => (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text>HE</Text>
                            </View>
                        ),
            headerTitleAlign:"center",
            headerShadowVisible:true
        })
    }, [navigation])
    return (
        <View className="bg-primary h-full w-full flex items-center justify-center px-3">
            <Text>Hello from world</Text>
        </View>
    );
}