import { FC, memo, useEffect, useState } from "react";
import { CountDown } from "./countDown";
import { CountDownManager } from "./countDownManager";
import { CountDownDateMeta, CountDownOpt } from "./types";

const countDownManager = new CountDownManager({
    debounce: 1000 * 3, 
    async getRemoteDate() {
        return Date.now()
    }
})

interface CountDownInstanceOpt extends Partial<CountDownOpt> {
    server?: boolean
}


// TODO: maybe we can also use different countDownManger here
export const getCountDownInstance = (opt: CountDownInstanceOpt) => {
    const {server, ...countDownOpt} = opt
    return new CountDown(Object.assign({}, server ? { manager: countDownManager } : {}, countDownOpt))
}


interface CountDownHookOpt {
    endTime: number, 
    onEnd?(): void, 
    server: boolean
}

export function useCountDown({endTime, onEnd, server = false}: CountDownHookOpt) {
    const [dateMeta, setDateMeta] = useState<CountDownDateMeta>({
        d: 0, 
        h: 0, 
        m: 0, 
        s: 0
    })


    // if you want to run an effect and clean it up only once, you can pass an empty array as a second argument.
    // This tells React that your effect doesn't depend on any values from props or state, so it never needs to re-run
    useEffect(() => {
        const countDown = getCountDownInstance({
            endTime, 
            server, 
            onEnd, 
            onStep: setDateMeta
        })
        return () => {
            countDown.clear()
        }
    }, [])

    return dateMeta
}


interface CountDownProps {
    endTime: number, 
    onEnd(): void
    render(date: CountDownDateMeta): JSX.Element
    server?: boolean
}


export const CountDownComponent: FC<CountDownProps> = memo(({endTime, onEnd, render, server}) => {
    const time = useCountDown({ endTime: new Date(endTime).getTime(), onEnd, server })
    return <>{render(time)}</>
})
