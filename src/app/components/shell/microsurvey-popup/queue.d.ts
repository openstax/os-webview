type NextItemFunction = () => null;
type OnDone = {onDone: NextItemFunction} | null;
type QueuedItemType = React.FC<
    React.PropsWithChildren<JSX.IntrinsicAttributes & OnDone>
>;

export default function useMSQueue(): [QueuedItemType, NextItemFunction];
