import { View, Text, Image } from "react-native";
import React from 'react';
import {Tabs} from 'expo-router';
import icons from '@/constants/icons';
import { ProfileProvider } from "@/components/ProfileContext";

const TabIcon = ({
    focused, icon
}:{
    focused:boolean; icon:any;
}) => (
    <View className="flex-1 mt-3 flex items-center">
        <Image source={icon} tintColor={focused ? '#000' : '#636363'} resizeMode="contain" className="size-7"/>
    </View>
)

const TabsLayout = () => {
  return(
      <ProfileProvider>
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
                    <TabIcon focused={focused} icon={icons.closet} />
                  ),
                }}
                /> 
            <Tabs.Screen
                name="index"
                options={{
                  title: "Home",
                  headerShown: false,
                  tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.calendar} />
                  ),
                }}
                />
            <Tabs.Screen
                name="profile"
                options={{
                  title: "Profile",
                  headerShown: false,
                  tabBarIcon: ({ focused }) => (
                    <TabIcon focused={focused} icon={icons.profile}  />
                  ),
                }}
                />
          </Tabs>
        </ProfileProvider>
    )
}

export default TabsLayout;