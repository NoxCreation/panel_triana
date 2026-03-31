import React from 'react';
import { useLottie } from "lottie-react";
import { Flex } from '@chakra-ui/react';

interface Props {
    lottieJson: any
    height?: string
    width?: string
}

const LottieAnimation = ({
    lottieJson,
    height,
    width
}: Props) => {

    const options = {
        animationData: lottieJson,
        autoplay: true,
        loop: true,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const { View } = useLottie(options, {
        width: width ? width : 400,
        height: height ? height : 400
    });

    return <Flex justifyContent={'center'} w={'100%'}>{View}</Flex>;

};


export default LottieAnimation;
