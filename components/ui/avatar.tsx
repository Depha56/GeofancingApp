import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { Image, View } from 'react-native'

interface AvatarProps {
    imgSrc?: string,
    className?: string,
    containerClassName?: string
}

const Avatar = ({ imgSrc, className, containerClassName }: AvatarProps) => {
  return (
    <View className={ containerClassName }>
        {   imgSrc ?
            <Image source={{ uri: imgSrc }} width={48} height={48} className={className} />
            : <FontAwesome name="user-circle-o" size={37} color="#a0745c" /> }
    </View>
  )
}

export default Avatar