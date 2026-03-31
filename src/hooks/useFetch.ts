import { useState } from "react"
import { useGetProfile } from "./useGetProfile";

export const useFetch = () => {
    const profile = useGetProfile();
    const accessToken = profile?.accessToken
    const [isLoading, setIsLoading] = useState(false)

    const handleFetch = async (endpoint: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT', data?: any, loader = true) => {
        if (loader)
            setIsLoading(true)

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("authorization", `Bearer ${accessToken}`)

        let requestOptions = {}
        if (method == 'GET' || method == 'DELETE')
            requestOptions = {
                method,
                headers: myHeaders,
                redirect: 'follow',
                body: JSON.stringify(data),
            } as any
        else if (method == 'POST' || method == 'PUT') {
            requestOptions = {
                method,
                headers: myHeaders,
                body: JSON.stringify(data),
                redirect: 'follow'
            } as any
        }

        const response = await fetch(`/api/v1${endpoint}`, requestOptions)
        if (loader)
            setIsLoading(false)
        return response
    }

    return {
        isLoading,
        handleFetch
    }

}