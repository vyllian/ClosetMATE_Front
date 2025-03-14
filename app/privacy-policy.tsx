import { privacyPolicy } from '@/constants/agreements';
import React from 'react';
import {ScrollView, Text} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () =>{
    return (
        <SafeAreaView className='px-3'>
            <ScrollView>
                <Text className='text-black-100'>{privacyPolicy}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}
export default PrivacyPolicy;
