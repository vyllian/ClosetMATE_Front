import { View, Text, Image } from "react-native";
import React from 'react';
import {Tabs} from 'expo-router';
import icons from '@/constants/icons';

const TabIcon = ({
    focused, icon, title,
}:{
    focused:boolean; icon:any; title:string;
}) => (
    <View className="flex-1 mt-3 flex items-center">
        <Image source={icon} tintColor={focused ? '#000' : '#636363'} resizeMode="contain" className="size-7"/>
        {/* <Text className={`${focused ? 'text-primary-300 font-rubik-medium' : 'text-black-200 font-rubik'} text-xs w-full text-center mt-1`}>
            {title}
        </Text> */}
    </View>
)

const TabsLayout = () => {
    return(
        <Tabs
        screenOptions={{
            tabBarShowLabel:false,
            tabBarStyle:{
                backgroundColor:'#ffffff',
                position:'absolute',
                minHeight:60,
            }
        }}>
            <Tabs.Screen
                name="wardrobe"
                options={{
                  title: "Wardrobe1",
                  headerShown: false,
                  tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.closet} title="Wardrobe2" />
                  ),
                }}
            /> 
            <Tabs.Screen
                name="index"
                options={{
                  title: "Home",
                  headerShown: false,
                  tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.calendar} title="Home" />
                  ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                  title: "Profile",
                  headerShown: false,
                  tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.profile} title="Profile" />
                  ),
                }}
            />
        </Tabs>
    )
}

export default TabsLayout;