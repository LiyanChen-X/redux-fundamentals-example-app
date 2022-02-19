
import React from 'react'

import { FC, memo } from "react"
import { CountDownDateMeta } from "./types"
import { useCountDown } from "./useCountDown" 
import { merge } from './utils'

interface CountDownProps {
    endTime: number, 
    onEnd?(): void,
    render?(date: CountDownDateMeta): JSX.Element,
    server?: boolean,
}




const defaultOnEnd = () => {
  console.log("Time end!")
} 

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  let angleInRadians = ((angleInDegrees - 90) * Math.PI)/180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  // TODO: why start and end are reversed here?
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y
  ].join(' '); 
  return d;
}


const SVGCircle = (props: {
  radius: number
}) => {
  const {radius} = props;
  const circle = (
  <svg className= "absolute top-0 left-0 w-[100px] h-[100px]">
    <path fill="none" stroke="#333" strokeWidth="4" d= {describeArc(50, 50, 48, 0, radius)}/>
  </svg>
  );
  return circle;
}

function scaleToDegree(number: number, in_min: number, in_max: number, out_min: number, out_max: number){
  return (
    ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
);
}


const CountDownDefaultRender = (date: CountDownDateMeta) => {
  const {d: days, h: hours, m: minutes, s: seconds} = date;
  const daysDegree = scaleToDegree(days, 30, 0, 0, 360);
  const hoursDegree = scaleToDegree(hours, 24, 0, 0, 360);
  const minutesDegree = scaleToDegree(minutes, 60, 0, 0, 360);
  const secondsDegree = scaleToDegree(seconds, 60, 0, 0, 360);
  return (
    <div>
              <div className="flex flex-row items-center justify-center flex-wrap">
                  <div className="text-[40px] text-gray-800 flex items-center justify-center flex-col leading-[30px] m-[10px] pt-[10px] w-[100px] h-[100px] relative">
                      {days}
                      <SVGCircle radius= {daysDegree} />
                      <span className="text-gray-500 text-[12px] font-semibold uppercase">days</span>
                  </div>
                  <div className="text-[40px] text-gray-800 flex items-center justify-center flex-col leading-[30px] m-[10px] pt-[10px] w-[100px] h-[100px] relative">
                      {hours}
                      <SVGCircle radius= {hoursDegree} />
                      <span className="text-gray-500 text-[12px] font-semibold uppercase">hours</span>
                  </div>
                  <div className="text-[40px] text-gray-800 flex items-center justify-center flex-col leading-[30px] m-[10px] pt-[10px] w-[100px] h-[100px] relative">
                      {minutes}
                      <SVGCircle radius= {minutesDegree} />
                      <span className="text-gray-500 text-[12px] font-semibold uppercase">minutes</span>
                  </div>
                  <div className="text-[40px] text-gray-800 flex items-center justify-center flex-col leading-[30px] m-[10px] pt-[10px] w-[100px] h-[100px] relative">
                      {seconds}
                      <SVGCircle radius= {secondsDegree} />
                      <span className="text-gray-500 text-[12px] font-semibold uppercase">seconds</span>
                  </div>
              </div>
    </div>
  )
}

// https://www.florin-pop.com/blog/2019/05/countdown-built-with-react/

// 如果你的component在相同props的情况下渲染相同的结果, 那么你可以通过将其包装在React.memo中调用， 以此通过记忆组件渲染结果的方式来提高组件的性能表现。 
// 这意味着在这种情况下， s变更React将跳过渲染组件的操作并直接复用最近一次渲染的结果。
// React.memo 仅仅检查prop。 如果函数组件被React.momo 包裹， 且其实现中拥有useState, useReducer或者useContext的Hook， 当state或者context发生变化时 它仍会重新渲染
export const CountDownComponent: FC<CountDownProps> = memo((props) => {
    const mergedProps: CountDownProps = merge({
      render: CountDownDefaultRender,
      endTime: Date.now() + 10000,
      onEnd: defaultOnEnd, 
      server: false,
    }, props);
    const time = useCountDown({ endTime: new Date(mergedProps.endTime).getTime(),  onEnd: mergedProps.onEnd, server:mergedProps.server })
    return <> {mergedProps.render!(time)} </>
})

