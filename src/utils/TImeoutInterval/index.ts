import { TimeoutInterval } from "./TimeoutInterval";
import { TimerCallBack } from "./types";


// timeout interval with remove function
const taskMap = new Map<number, TimeoutInterval>();

export const setTimeoutInterval = (cb: TimerCallBack, delay: number) => {
    const timeoutInterval = new TimeoutInterval(delay);
    taskMap.set(TimeoutInterval.instanceId, timeoutInterval);
    return timeoutInterval.add(cb);
}

export const clearTimeoutInterval = (id: number) => {
    const timeoutInterval = taskMap.get(id);
    if (!timeoutInterval) return false;
    timeoutInterval.removeAll();
    taskMap.delete(id);
    return true;
}
