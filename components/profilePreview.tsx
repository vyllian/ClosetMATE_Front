import React from 'react';
import { TouchableHighlight, View , Text, Image} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const ProfilePreview = ({
    image, username, onPress, newProfile
}:{image?:string, username:string, onPress:() => void, newProfile?:boolean}) =>{
    return(
        <View className='flex justify-center items-center w-32'>
            {newProfile ? (
                <TouchableHighlight onPress={onPress} underlayColor='#fbcce7'>
                    <View className='items-center justify-center'>
                        <View className='bg-black-300 size-20 rounded-full items-center justify-center'>
                            <MaterialCommunityIcons name="plus" size={44} color="white" />
                        </View>
                        <Text className='font-philosopher text-lg text-black-200 text-center'>{username}</Text>
                    </View>
                </TouchableHighlight>
            ) : (
                <TouchableHighlight onPress={onPress} underlayColor='#fbcce7' >
                    <View className=' '>
                        <View className='size-20 bg-white rounded-full border-white border-2 items-center justify-center'>
                        {image ? (
                            <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : (
                            <MaterialCommunityIcons name="star-face" size={44} color="black" className='' />
                        )}
                        </View>
                        <Text className='font-philosopher-bold text-lg text-black text-center'>{username}</Text>
                    </View>
                </TouchableHighlight>
            )}
        </View>
    )

}