import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {increment, decrement } from './counterSlice';

const Counter = () => {
  // To get state from Redux store
  const count = useSelector((state) => state.counter.value);
  
  // To dispatch actions to Redux store
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}

export default Counter;
