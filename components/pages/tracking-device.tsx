import MapBoxReactNative from '@/components/ui/maps' 
import React from 'react'
import {  View } from 'react-native'

const MainTrackingAnimal = () => {
  return (
    <View className="flex-1 relative">
        {/* Map */}
        <View className="flex-1 relative -z-10">
            {/* Mapbox Component */}
            <MapBoxReactNative />
        </View>
    </View>
  )
}

export default MainTrackingAnimal