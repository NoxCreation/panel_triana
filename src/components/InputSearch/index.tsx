import React from 'react'
import { Flex, FormLabel, Input } from '@chakra-ui/react'

export default function InputSearch() {
    return (
        <Flex justifyContent={'center'} alignItems={'center'}>
            <FormLabel htmlFor="search" mb={0} color={'gray.500'} fontFamily={'sans-serif'} fontSize={'sm'}>
                Search
            </FormLabel>
            <Input id="search" size={'sm'} type='search'/>
        </Flex>
    )
}
