import React from 'react'
import { Image, ImageSourcePropType, Text, View } from 'react-native'
import headerBg from "@/assets/images/verification-bg.png";

interface HeaderProps {
    icon: ImageSourcePropType,
    title: string
}

const Header = ({ icon, title }: HeaderProps) => {
  return (
    <View className="relative">
        <Image source={ headerBg } className="object-contain"/>
        <View className="absolute z-20 w-full h-full justify-center items-center">
            <Image source={ icon } className="w-16 h-16"/>
            <Text className="text-white text-3xl mt-2 font-[SpaceMono]">{ title }</Text>
        </View>
    </View>
  )
}

export default Header