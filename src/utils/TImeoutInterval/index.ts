import { TimeoutInterval } from "./TimeoutInterval";
import { TimerCallBack } from "./types";


// timeout interval with remove function
const taskMap = new Map<number, TimeoutInterval>();

export const setTimeoutInterval = (cb: TimerCallBack, delay: number) => {
    const timeoutInterval = new TimeoutInterval(delay);
    const timerId = timeoutInterval.add(cb);
    taskMap.set(TimeoutInterval.instanceId, timeoutInterval);
    return timerId
}

export const clearTimeoutInterval = (id: number) => {
    const timeoutInterval = taskMap.get(id);
    if (!timeoutInterval) return false;
    timeoutInterval.removeAll();
    taskMap.delete(id);
    return true;
}
