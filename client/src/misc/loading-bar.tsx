interface LocalParams {
    noText?: boolean,
    className?: string
}

export default function LoadingBar({ noText, className }: LocalParams) {
    return (
        <div className={`${className ?? "h-full w-full"} flex justify-center items-center`}>
            <div className="grid grid-rows-2">
                {!noText && <div className="text-teal-400 font-bold">завантаження</div>}
                <div className="flex flex-col justify-center w-full">
                    <div className="flex justify-center h-1/4">
                        <div className="flex justify-between gap-2 w-1/3">
                            <div className="rounded-full bg-teal-400 aspect-square animate-bounceWave [animation-delay:0s]" />
                            <div className="rounded-full bg-teal-400 aspect-square animate-bounceWave [animation-delay:0.2s]" />
                            <div className="rounded-full bg-teal-400 aspect-square animate-bounceWave [animation-delay:0.4s]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
