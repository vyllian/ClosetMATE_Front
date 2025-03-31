import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { TouchableHighlight, View , Image} from "react-native"
import { TopNavigation } from './topNavigation';


export const SmallItemPreview =  ({image, favourite, onPress}:
    {image:string, favourite:boolean, onPress:()=>void}
    ) => {
        
        return(
            <View className=' items-center justify-center max-w-32'>
                <TouchableHighlight onPress={onPress}  underlayColor="white" className='bg-white p-2 rounded-t-xl'>
                    <Image source={{uri:image}} className='size-28' resizeMode='contain'/>
                </TouchableHighlight>
                <View className='border-t border-black-300 bg-white w-full items-end p-1 rounded-b-xl'>
                    {favourite ? (
                            <MaterialIcons name="favorite" size={20} color="#fb3f4a" />
                        ):(
                            <MaterialIcons name="favorite-border" size={20} color="#fb3f4a" />
                        )}
                </View>
            </View>
        )
    }

