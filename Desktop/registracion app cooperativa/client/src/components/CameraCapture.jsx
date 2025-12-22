import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, Sparkles, AlertCircle } from 'lucide-react';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const CameraCapture = ({ onCapture, label, instruction }) => {
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const capture = useCallback(() => {
        setIsCapturing(true);
        const imageSrc = webcamRef.current.getScreenshot();
        setTimeout(() => {
            setImage(imageSrc);
            setIsCapturing(false);
        }, 300);
    }, [webcamRef]);

    const retake = () => {
        setImage(null);
    };

    const confirm = () => {
        onCapture(image);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 animate-scale-in">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-black mb-1 flex items-center justify-center gap-2">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        {label}
                    </span>
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{instruction}</p>
            </div>

            <div className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 mb-8 group">
                {!image ? (
                    <>
                        <Webcam
                            audio={false}
                            height={720}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={1280}
                            videoConstraints={videoConstraints}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay helpers */}
                        <div className="absolute inset-0 border-2 border-white/30 rounded-2xl m-6 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center pointer-events-none">
                            <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                        </div>
                    </>
                ) : (
                    <img src={image} alt="captured" className="w-full h-full object-cover animate-fade-in" />
                )}

                {/* Processing Overlay */}
                {isCapturing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>

            <div className="flex space-x-6 w-full justify-center">
                {!image ? (
                    <button
                        onClick={capture}
                        className="group flex flex-col items-center gap-2"
                    >
                        <div className="w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                            <Camera size={38} className="group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider">CAPTURAR</span>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={retake}
                            className="group flex flex-col items-center gap-2"
                        >
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-full text-gray-500 dark:text-gray-400 shadow-md hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                                <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                            </div>
                            <span className="text-xs font-bold text-gray-400 tracking-wider">REPETIR</span>
                        </button>
                        <button
                            onClick={confirm}
                            className="group flex flex-col items-center gap-2"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
                                <Check size={42} className="group-hover:scale-125 transition-transform" />
                            </div>
                            <span className="text-xs font-bold text-green-500 tracking-wider">CONFIRMAR</span>
                        </button>
                    </>
                )}
            </div>

            {/* Hint */}
            {!image && (
                <div className="mt-8 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-900/50 px-4 py-2 rounded-full border dark:border-slate-800">
                    <AlertCircle size={14} />
                    <span>Asegúrate de tener buena iluminación</span>
                </div>
            )}
        </div>
    );
};

export default CameraCapture;
