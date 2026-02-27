import { useEffect } from "react";

/**
 * A custom hook that delays the execution of an effect by a specified delay time.
 * Similar to useEffect, but the effect callback is executed after the delay instead of immediately.
 * 
 * @param delay - The delay in milliseconds before executing the effect
 * @param effect - The effect callback function to execute after the delay
 * @param deps - Optional dependency array. When dependencies change, the timer is reset and the effect is scheduled again
 * @returns void
 * 
 * @example
 * // Execute an effect after 500ms delay
 * useTimerEffect(500, () => {
 *   console.log('This runs after 500ms');
 * }, [someDependency]);
 */
export const useTimerEffect = (delay: number, effect: React.EffectCallback, deps?: React.DependencyList) => {
    useEffect(() => {
        const timer = setTimeout(effect, delay);
        return () => clearTimeout(timer);
    }, deps);
}