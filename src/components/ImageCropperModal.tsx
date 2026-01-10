import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

interface ImageCropperModalProps {
    imageSrc: string;
    onCancel: () => void;
    onCropComplete: (croppedBlob: Blob) => void;
}

const ImageCropperModal = ({ imageSrc, onCancel, onCropComplete }: ImageCropperModalProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-lg w-[90%] max-w-[500px] overflow-hidden flex flex-col shadow-2xl">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-['Familjen_Grotesk'] font-bold text-lg text-[#04330B]">Adjust Profile Photo</h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="relative w-full h-[300px] bg-gray-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // 1:1 for profile
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                        showGrid={true}
                        cropShape="rect" // Use rect but we style it mainly for avatar. Or 'round' if we want circular clip, but backend stores rectangular usually.
                    />
                </div>

                <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => {
                                setZoom(Number(e.target.value))
                            }}
                            className="w-full accent-[#0D5229] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2 rounded-md text-sm font-semibold text-white bg-[#0D5229] hover:bg-[#0a4220] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Save & Upload'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
