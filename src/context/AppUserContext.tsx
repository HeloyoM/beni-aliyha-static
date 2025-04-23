import { createContext } from 'react'

export default createContext({
    user: {} as any,
    updateUserContext: (user: any) => { },
})