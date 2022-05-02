import React,{useCallback,memo} from "react";
import Header from "./Header";
import {TouchableOpacity,Text} from 'react-native'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

const NormalDrawerHeader = ({title,navigation}) => {
    return(
       <Header
        HeaderContent={(
            <Text style={{ fontSize: 20 }}>{title}</Text>
        )}

        HeaderLeft={(
            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                    navigation.openDrawer()
                }}
            >
                <FontAwesomeIcon icon={faGripLines} size={25} />
            </TouchableOpacity>
        )}
    /> 
    )
    
}

export default memo(NormalDrawerHeader);
