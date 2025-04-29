import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { TouchableHighlight, View , Image} from "react-native"
import { TopNavigation } from './topNavigation';


export const SmallItemPreview =  ({image, favourite, onPress}:
    {image:string, favourite:boolean, onPress:()=>void}
    ) => {
        
        return(
            <TouchableHighlight onPress={onPress}  underlayColor="white" className='rounded-xl'>
                <View className=' items-center justify-center w-32 bg-white border-black-300 border rounded-xl'>
                    <View className='w-full p-2'>
                        <Image source={{uri:image}} className='size-28' resizeMode='contain'/>
                    </View>
                    <View className='border-t border-black-300  w-full items-end p-1 '>
                        {favourite ? (
                            <MaterialIcons name="favorite" size={20} color="#fb3f4a" />
                        ):(
                            <MaterialIcons name="favorite-border" size={20} color="#fb3f4a" />
                        )}
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

