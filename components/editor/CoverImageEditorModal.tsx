'use client';

import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface CoverImageEditorModalProps {
  tempImage: string; // 선택된 이미지의 임시 URL
  onClose: () => void;
  onConfirm: (croppedAreaPixels: any) => void;
}

export const CoverImageEditorModal = ({ tempImage, onClose, onConfirm }: CoverImageEditorModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // 크롭 영역 계산 완료 시 호출
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">커버 이미지 편집</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* 편집 영역 (Cropper가 들어갈 공간은 반드시 height가 지정되어야 함) */}
        <div className="relative flex-1 bg-slate-900 min-h-[400px]">
          <Cropper
            image={tempImage}
            crop={crop}
            zoom={zoom}
            aspect={21 / 9} // 💡 21:9 비율 고정
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* 컨트롤 및 하단 바 */}
        <div className="p-8 bg-white border-t space-y-6">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-5 h-5 text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <ZoomIn className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
            >
              취소
            </button>
            <button
              onClick={() => onConfirm(croppedAreaPixels)}
              className="flex-[2] py-4 px-6 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all"
            >
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};