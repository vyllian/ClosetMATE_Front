import React from 'react';
import { TouchableHighlight, View , Text, Image} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const ProfilePreview = ({
    image, username, onPress, newProfile
}:{image?:string, username:string, onPress:() => void, newProfile?:boolean}) =>{
    return(
        <View className='flex justify-center items-center w-32 gap-1'>
            {newProfile ? (
                <TouchableHighlight onPress={onPress} className='bg-black-300 p-3 rounded-full'>
                    <MaterialCommunityIcons name="plus" size={40} color="white" />
                </TouchableHighlight>
            ) : (
                <TouchableHighlight onPress={onPress}>
                    {image ? (
                        <Image source={{ uri: image }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                    ) : (
                        <MaterialCommunityIcons name="star-face" size={24} color="black" />
                    )}
                </TouchableHighlight>
            )}
            <Text className='font-philosopher text-lg text-black-200 text-center'>{username}</Text>
        </View>
    )

}