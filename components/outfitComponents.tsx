import React from 'react';
import { View, Image } from 'react-native';

export const outfitPreview =({imageUrl}:{imageUrl:string}) =>{
    return (
        <View className='size-16 border border-black-300 rounded-xl items-center justify-center'>
            <Image source={{uri:imageUrl}} className='size-fit' resizeMode='contain'/>
        </View>
    )
}