import { useEffect, useState } from "react";
import { useStoreStateValue } from "../Store/Store";
import { $actionManager } from "../stores/stores";

export function useAction(actionName: string) {
    const [count, setCount] = useState(0);
    const actionManager = useStoreStateValue($actionManager);

    useEffect(() => {
        const callback = () => {
            setCount(count + 1);
        };
        actionManager.on(actionName, callback);

        return () => {
            actionManager.off(actionName, callback);
        };
    }, [count]);
}
