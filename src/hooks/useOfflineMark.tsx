import { useRouter } from 'next/router';
import { useCallback } from 'react';

type Data = Record<string, any>;

const useOfflineMark = () => {
    const router = useRouter();
    //const [data_local, setData] = useState()

    const saveDataInStorage = useCallback((key: string, data: Data) => {
        const existingData = JSON.parse(localStorage.getItem('data') || '{}');
        existingData[key] = data;
        //setData(existingData)
        localStorage.setItem('data', JSON.stringify(existingData));
    }, []);

    const getDataInStorage = useCallback((key: string): Data | null => {
        const existingData = JSON.parse(localStorage.getItem('data') || '{}');
        //setData(existingData)
        return existingData[key] || null;
    }, []);

    const cleanKey = useCallback((key: string): void => {
        localStorage.removeItem(key);
    }, []);

    return {
        saveDataInStorage: (data: Data) => saveDataInStorage(router.pathname, data),
        getDataInStorage: () => getDataInStorage(router.pathname),
        cleanKey: (key: string) => cleanKey(key)
        //data_local
    };
};

export default useOfflineMark;
