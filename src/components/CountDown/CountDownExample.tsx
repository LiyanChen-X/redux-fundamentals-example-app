
import React from 'react'

import { FC, memo } from "react"
import { CountDownDateMeta } from "./types"
import { useCountDown } from "./useCountDown"

interface CountDownProps {
    endTime: number, 
    onEnd(): void
    render(date: CountDownDateMeta): JSX.Element
    server?: boolean
}


export const CountDownComponent: FC<CountDownProps> = memo(({endTime, onEnd, render, server}) => {
    const time = useCountDown({ endTime: new Date(endTime).getTime(), onEnd, server })
    return <> {render(time)} </>
})
