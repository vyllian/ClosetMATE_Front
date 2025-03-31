import AntDesign from "@expo/vector-icons/AntDesign"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { router } from "expo-router"
import { TouchableHighlight, View } from "react-native"

export const TopNavigation = (({arrowAction, binAction}:{arrowAction:() => void, binAction?:() => void})=>{
    return(
        <View className='flex-row justify-between items-center w-11/12 absolute top-2 left-2'>
        <TouchableHighlight onPress={arrowAction} underlayColor='trasperent' className='size-fit'>
            <AntDesign name="arrowleft" size={32} color="black" />
        </TouchableHighlight>
        {binAction &&(
            <TouchableHighlight onPress={binAction} underlayColor='trasperent' className=''>
                <MaterialCommunityIcons name="trash-can-outline" size={32} color="#bc4444" />
            </TouchableHighlight>
        )}
    </View>
    )
})