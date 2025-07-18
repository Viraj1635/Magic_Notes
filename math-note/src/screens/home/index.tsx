import { useEffect, useRef , useState} from "react";
import {SWATCHES} from '@/constants';
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "@/components/ui/button";
import Draggable from 'react-draggable';
import axios from 'axios';


interface Response{
    expr: string;
    result: string;
    assign: boolean;
}

interface GeneratedResult{
    expression: string;
    answer: string;
}

export default function Home(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing,setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255,255,255)');
    const [reset, setRest] = useState(false);
    const [result, setResult] = useState<GeneratedResult>();
    const [latexExpression,setLatexExpression] = useState<Array<string>>([]);
    const [latexPositions,setLatexPositions] = useState({x:10,y:200});
    const [dictOfVars, setDictOfVars] = useState({});

    useEffect(() =>{
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setRest(false);
        }
    },[reset]);

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(()=>{
        const canvas=canvasRef.current;

        if(canvas){
            const ctx = canvas.getContext('2d');
            if (ctx){
                canvas.width=window.innerWidth;
                canvas.height=window.innerHeight-canvas.offsetTop;
                ctx.lineCap='round';
                ctx.lineWidth=3;
            }
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
            });
        };

        return () => {
            document.head.removeChild(script);
        };

    },[]);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression([...latexExpression, latex]);

        // Clear the main canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const sendData = async()=>{
        const canvas=canvasRef.current;

        if(canvas){
            console.log("sending data",`${import.meta.env.VITE_API_URL}/calculate`)
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_API_URL}/calculate`,
                data: {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars
                }
            })

            const resp = await response.data;
            resp.data.forEach((data: Response) => {
                if (data.assign === true) {
                    setDictOfVars({
                        ...dictOfVars,
                        [data.expr]: data.result
                    })
                }
            })
            const ctx = canvas.getContext('2d');
            const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            setLatexPositions({ x: centerX, y: centerY });
            resp.data.forEach((data: Response) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result
                    });
                }, 1000);
            });
        }
    }

    const resetCanvas=()=>{
        const canvas=canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if (ctx){
                ctx.clearRect(0,0,canvas.width,canvas.height);

            }
        }
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => { 
        const canvas = canvasRef.current;
        if (canvas){
            canvas.style.background='black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const pos = getEventPos(e);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                setIsDrawing(true);
            }
        }
    };
    
    const stopDrawing = () => {
        setIsDrawing(false);
    };
    
    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.strokeStyle = color;
                const pos = getEventPos(e);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            }
        }
    };
    
    // Function to get position for both mouse & touch events
    const getEventPos = (e: any) => {
        if (e.nativeEvent instanceof TouchEvent) {
            const touch = e.nativeEvent.touches[0];
            return { x: touch.clientX, y: touch.clientY };
        } else {
            return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        }
    };
    

    return(
        <>
            <div className="grid grid-cols-3 gap-2 p-1">
                <Button
                    onClick={()=> setRest(true)}
                    className='z-20 bg-black text-white border'
                    variant='default'
                >
                    Reset
                </Button>
                <Group className="z-20 gap-3.5 pl-2">
                    {SWATCHES.map((swatchColor: string)=>(
                        <ColorSwatch
                        key={swatchColor}
                        color={swatchColor}
                        onClick={()=>setColor(swatchColor)}
                        />
                    ))}
                </Group>
                <Button
                    onClick={sendData}
                    className='z-20 bg-black text-white border'
                    variant='default'
                >
                    Run
                </Button>
            </div>
            <canvas 
                ref={canvasRef} 
                id="canvas"
                className="absolute top-0 left-0 w-full h-full"
                onMouseDown={startDrawing} onTouchStart={startDrawing}
                onMouseUp={stopDrawing} onTouchEnd={stopDrawing}
                onMouseMove={draw} onTouchMove={draw}
                onMouseOut={stopDrawing}
            />
            
            {latexExpression && latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPositions}
                    onStop={(e, data) => setLatexPositions({ x: data.x, y: data.y })}
                >
                    <div className="absolute p-2 text-white rounded shadow-md">
                        <div className="latex-content">{latex}</div>
                    </div>
                </Draggable>
            ))}

        </>
    );
}