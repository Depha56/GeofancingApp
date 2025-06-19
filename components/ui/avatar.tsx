import React from 'react'
import { Image, ImageSourcePropType, View } from 'react-native'

interface AvatarProps {
    imgSrc: ImageSourcePropType,
    className?: string,
    containerClassName?: string
}

const Avatar = ({ imgSrc, className, containerClassName }: AvatarProps) => {
  return (
    <View className={ containerClassName }>
        <Image source= { imgSrc } width={ 48 } height={ 48 } className = { className }/>
    </View>
  )
}

export default Avatar