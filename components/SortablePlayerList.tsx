import React, { useState, useRef, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Player } from '@/lib/types';
import { GameFlowState } from '@/utils/GameStateMachine';
import { isReorderingAllowed } from '@/utils/playerUtils';

interface SortablePlayerListProps {
  players: Player[];
  onOrderChange: (newOrder: string[]) => void;
  isHost: boolean;
  flowState: GameFlowState;
  children: (player: Player, dragProps: any) => React.ReactNode;
}

const SortablePlayerList: React.FC<SortablePlayerListProps> = ({ 
  players, 
  onOrderChange,
  isHost,
  flowState,
  children
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const touchYRef = useRef<number | null>(null);
  const touchIdRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);
  const canReorder = isReorderingAllowed(flowState, isHost);

  // Handle document touch move events
  const handleDocumentTouchMove = useRef((e: TouchEvent) => {
    if (!touchIdRef.current || !canReorder) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const touchY = touch.pageY;
    
    if (!isDraggingRef.current) {
      const deltaY = Math.abs(touchY - (touchYRef.current || 0));
      if (deltaY > 10) { // Threshold to start dragging
        isDraggingRef.current = true;
      } else {
        return; // Don't process as drag if below threshold
      }
    }
    
    // Find the element at the touch position
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetElement = element?.closest('[data-player-id]') as HTMLElement;
    
    if (targetElement) {
      const targetId = targetElement.getAttribute('data-player-id');
      if (targetId && targetId !== touchIdRef.current) {
        setDragOverId(targetId);
        handleDragOverEvent(e, targetId);
      }
    }
  }).current;

  const handleDocumentTouchEnd = useRef((e: TouchEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
    }
    handleDragEnd();
  }).current;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Cleanup is handled by the cleanup function returned from handleTouchStart
    };
  }, []);
  
  // Handle drag over for both mouse and touch events
  const handleDragOverEvent = (e: React.DragEvent | TouchEvent, targetId: string) => {
    e.preventDefault();
    if (e instanceof TouchEvent) {
      (e as any).dataTransfer = { effectAllowed: 'move' };
    } else {
      (e as React.DragEvent).dataTransfer.dropEffect = 'move';
    }
    
    if (!draggedId || draggedId === targetId || !canReorder) return;
    
    const newOrder = [...players.map(p => p.id)];
    const fromIndex = newOrder.indexOf(draggedId);
    const toIndex = newOrder.indexOf(targetId);
    
    if (fromIndex === -1 || toIndex === -1) return;
    
    // Reorder array
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedId);
    
    // Update parent with new order
    onOrderChange(newOrder);
  };

  const handleDragStart = (playerId: string, e: React.DragEvent) => {
    if (!canReorder) return;
    try {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', playerId);
      }
      setDraggedId(playerId);
      isDraggingRef.current = true;
    } catch (err) {
      console.error('Drag start error:', err);
    }
  };

  const handleDragEnd = () => {
    if (!draggedId) return;
    setDraggedId(null);
    setDragOverId(null);
    isDraggingRef.current = false;
    document.removeEventListener('touchmove', handleDocumentTouchMove as any);
    document.removeEventListener('touchend', handleDocumentTouchEnd as any);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedId || draggedId === targetId || !canReorder) return;
    
    const newOrder = [...players.map(p => p.id)];
    const fromIndex = newOrder.indexOf(draggedId);
    const toIndex = newOrder.indexOf(targetId);
    
    if (fromIndex === -1 || toIndex === -1) return;
    
    // Reorder array
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedId);
    
    // Update parent with new order
    onOrderChange(newOrder);
  };

  // Enhanced touch handling
  const handleTouchStart = (playerId: string, e: React.TouchEvent) => {
    if (!canReorder) return;
    e.preventDefault();
    touchYRef.current = e.touches[0].pageY;
    touchIdRef.current = playerId;
    setDraggedId(playerId);
    isDraggingRef.current = false;
    
    // Add document-level listeners for better touch handling
    const touchMoveHandler = (e: Event) => handleDocumentTouchMove(e as TouchEvent);
    const touchEndHandler = (e: Event) => handleDocumentTouchEnd(e as TouchEvent);
    
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('touchend', touchEndHandler, { passive: true });
    
    // Store the handlers so we can remove them later
    const cleanup = () => {
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
    };
    
    return cleanup;
  };



  return (
    <View>
      {players.map((player) => {
        const isDragging = draggedId === player.id;
        const isDragOver = dragOverId === player.id;
        
        return (
          <div
            key={player.id}
            data-player-id={player.id}
            draggable={canReorder && Platform.OS === 'web'}
            onDragStart={(e) => handleDragStart(player.id, e)}
            onDragOver={(e) => {
              e.preventDefault();
              if (canReorder) {
                setDragOverId(player.id);
                handleDragOver(e, player.id);
              }
            }}
            onDragEnd={handleDragEnd}
            onDrop={(e) => {
              e.preventDefault();
              if (canReorder) handleDragOver(e, player.id);
            }}
            onTouchStart={(e) => handleTouchStart(player.id, e as any)}
            style={{
              opacity: isDragging ? 0.8 : 1,
              transform: `scale(${isDragging ? 0.98 : 1})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease',
              cursor: canReorder ? 'grab' : 'default',
              position: 'relative',
              zIndex: isDragging ? 100 : 'auto',
              backgroundColor: isDragOver ? 'rgba(0,0,0,0.05)' : 'transparent',
            }}
          >
            {children(player, {
              isDragging,
              dragHandleProps: {
                onMouseDown: (e: React.MouseEvent) => {
                  if (canReorder) e.stopPropagation();
                },
              },
            })}
          </div>
        );
      })}
    </View>
  );
};

export default SortablePlayerList;
