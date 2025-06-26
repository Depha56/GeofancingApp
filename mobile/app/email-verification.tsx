import Header from '@/components/layout/header';
import React, { useEffect } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import verificationIcon from "@/assets/images/verification-icon.png";
import { useNavigation } from 'expo-router';


const EmailVerification = () => {
  
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <View className="items-center">
        <Header
            icon={ verificationIcon }
            title="Verification"
        />
        <Text className="w-3/4 text-lg">Enter the code sent to your phone number +250 78 ******12</Text>

        <View className="flex-row gap-x-4 mt-5">
            <TextInput className="w-16 h-16 border border-black/20 pl-7 text-2xl" maxLength={1}/>
            <TextInput className="w-16 h-16 border border-black/20 pl-7 text-2xl" maxLength={1}/>
            <TextInput className="w-16 h-16 border border-black/20 pl-7 text-2xl" maxLength={1}/>
            <TextInput className="w-16 h-16 border border-black/20 pl-7 text-2xl" maxLength={1}/>
        </View>

        <Text className="text-lg mt-5">Code will expire in <Text className="text-[#6BBA1F]">00:30</Text></Text>
        <TouchableOpacity 
            className="mt-10 px-6 py-3 rounded-xl bg-primary"
        >
            <Text className="text-white text-lg font-semibold">Verify</Text>
        </TouchableOpacity>
    </View>
  )
}

export default EmailVerification