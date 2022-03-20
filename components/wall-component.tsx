import { Props } from "next/script";
import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { WallPixel, fetchFakeChunk, hoverOn } from "../store/reducer/wall.reducer";



export default function Wall() {
    const wallChunks = useAppSelector(state => state.wallReducer.wallChunks);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchFakeChunk(BigInt(0)));
    }, []);

    if (wallChunks.size == 0)
        return <h2>Loading...</h2>

    return (
        <div>
            <div className="flex mt-12 items-center w-full flex-col items-center">
                <div className="relative">
                    <div className="hidden md:block sticky top-16 float-right mx-12 ">
                        <WallCoordinateHelper />
                    </div>
                    <div className="hidden md:block sticky top-12 float-left mx-12">
                        ➡️
                    </div>
                    <WallChunk chunk={wallChunks.get(BigInt(0))} />

                </div>
            </div>
        </div>
    )
}


export function WallChunk({ chunk }) {
    useEffect(() => {

    }, []);

    return (
        <div className="grid content-center grid-cols-32 gap-0 shadow-xl">
            {
                chunk?.map((value: WallPixel, key: any) => {
                    return <WallPixelUI key={key} pixel={value} />
                })
            }
        </div>
    )
}

export function WallPixelUI({ pixel }) {
    const dispatch = useAppDispatch();

    return <div onMouseEnter={() => dispatch(hoverOn(pixel))} className="w-4 h-4 hover:border-black hover:border-2" style={{ backgroundColor: pixel.colorString }}></div>
}



export function WallCoordinateHelper() {
    const hoveredWallPixel = useAppSelector(state => state.wallReducer.hoveredWallPixel);

    useEffect(() => {
    }, []);

    const getX = () => {
        return hoveredWallPixel?.xPos.toString() ?? '';
    }

    const getY = () => {
        return hoveredWallPixel?.yPos.toString() ?? '';
    }

    return (
        <div className="flex flex-col">
            <div>
                <h4>Coordinate</h4>
            </div>
            <div > X : {getX()}</div>
            <div > Y : {getY()}</div>
        </div>
    );
}