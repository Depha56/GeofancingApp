import React from 'react'
import { Image, View } from 'react-native'

interface AvatarProps {
    imgSrc: string,
    className?: string,
    containerClassName?: string
}

const Avatar = ({ imgSrc, className, containerClassName }: AvatarProps) => {
  return (
    <View className={ containerClassName }>
        <Image source= { { uri: imgSrc } } width={ 48 } height={ 48 } className = { className }/>
    </View>
  )
}

export default Avatar