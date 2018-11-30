import React from "react";
import { View, Image } from "react-native";
import Placeholder from "rn-placeholder";

import FastImage from "../../components/fastImage";
import IC_DF from "@resources/icons/avatar-default.png";

const avartar = props => {
    const style = { backgroundColor: props.bgColor };
    return (
        <View style={[style, { alignItems: 'center', width: props.size, height: props.size, borderRadius: props.size / 2 }]}>
            <FastImage
                source={IC_DF}
                style={{ width: props.size, height: props.size, borderRadius: props.size / 2 }} />
        </View>
    );
};

export default Placeholder.connect(avartar);