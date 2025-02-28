import AntDesign from "@expo/vector-icons/AntDesign"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { router } from "expo-router"
import { TouchableHighlight, View } from "react-native"

export const TopNavigation = (({arrowAction, binAction}:{arrowAction:() => void, binAction:() => void})=>{
    return(
        <View className='flex-row justify-between items-center w-full absolute top-safe-or-0'>
        <TouchableHighlight onPress={arrowAction} underlayColor='#fbcce7' className='size-fit'>
            <AntDesign name="arrowleft" size={32} color="black" />
        </TouchableHighlight>
        <TouchableHighlight onPress={binAction} underlayColor='#fbcce7' className=''>
            <MaterialCommunityIcons name="trash-can-outline" size={32} color="#bc4444" />
        </TouchableHighlight>
    </View>
    )
})