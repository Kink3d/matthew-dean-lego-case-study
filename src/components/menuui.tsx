import { InterfaceState } from "../data";
import { GameStateResult } from "../hooks";
import { useState, useRef, useEffect } from "react";
import '../styles/menuui.css'

export interface MenuUiProps {
  gameStateResult: GameStateResult;
}

export function MenuUi(props: MenuUiProps) {
  const { gameStateResult } = props;
  const { Levels, setActiveLevelIndex, setInterfaceState, setLevelLoaded } = gameStateResult;
  
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startY, setStartY] = useState(0);
  const [_scrollTop, setScrollTop] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const DRAG_THRESHOLD = 10; // pixels

  const handleLevelSelect = (levelIndex: number) => {
    if (dragDistance <= DRAG_THRESHOLD) {
      setActiveLevelIndex(levelIndex);
      setInterfaceState(InterfaceState.Game);
      setLevelLoaded(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartY(clientY - (listRef.current?.scrollTop || 0));
    setDragDistance(0);
    setIsMouseDown(true);
  };



  const handleMouseUp = () => {
    setIsDragging(false);
    setIsMouseDown(false);
    setDragDistance(0);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsMouseDown(false);
      setDragDistance(0);
    };

    const handleGlobalMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!listRef.current || !isMouseDown) return;
      
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const currentY = clientY - (listRef.current?.scrollTop || 0);
      const distance = Math.abs(currentY - startY);
      
      setDragDistance(distance);
      
      if (distance > DRAG_THRESHOLD && !isDragging) {
        setIsDragging(true);
      }
      
      if (isDragging) {
        const newScrollTop = clientY - startY;
        listRef.current.scrollTop = newScrollTop;
        setScrollTop(newScrollTop);
      }
    };

    if (isMouseDown) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchend', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('touchmove', handleGlobalMouseMove, { passive: false });
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchend', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('touchmove', handleGlobalMouseMove);
    };
  }, [isMouseDown, isDragging, startY]);

  return (
    <div className="menu-overlay">
      <div className="menu-modal">
        <h2 style={{ marginBottom: 24 }}>Select Level</h2>
                 <div 
           ref={listRef}
           className={`level-list ${isDragging ? 'dragging' : ''}`}
           onMouseDown={handleMouseDown}
           onTouchStart={handleMouseDown}
           onMouseUp={handleMouseUp}
           onTouchEnd={handleMouseUp}
         >
          {Levels.map((_level, index) => (
            <button
              key={index}
              className="level-btn"
              onClick={() => handleLevelSelect(index)}
            >
              Level {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
