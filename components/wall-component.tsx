import { Props } from "next/script";
import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { WallPixel, fetchFakeChunk } from "../store/reducer/wall.reducer";


export default function Wall() {
    const wallChunks = useAppSelector(state => state.wallReducer.wallChunks);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log('asd');
        dispatch(fetchFakeChunk(BigInt(0)));
    }, []);

    if (wallChunks.size == 0)
        return <h2>Loading...</h2>

    return (
        <div>
            <div className="flex mt-12 items-center w-full flex-col items-center">
                <h2>The Wall</h2>
                <WallChunk chunk={wallChunks.get(BigInt(0))} />
            </div>
        </div>
    )
}


export function WallChunk({chunk}) {
    useEffect(() => {

    }, []);

    return (
        <div className="grid content-center grid-cols-32 gap-0 shadow-xl">
            {
                chunk?.map((value: WallPixel, key: any) => {
                    return <WallPixelUI key={key} pixel={value}/>
                })
            }
        </div>
    )
}

export function WallPixelUI({pixel}) {
    const dispatch = useAppDispatch();

    return <div  onMouseEnter={() => console.log('a')} className="w-4 h-4 hover:border-black hover:border-2" style={{backgroundColor : pixel.colorString}}></div>
}

