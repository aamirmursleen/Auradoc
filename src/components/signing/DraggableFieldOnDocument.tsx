'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import {
  PenTool,
  Type,
  Calendar,
  AlignLeft,
  CheckSquare,
  Trash2,
  GripVertical,
} from 'lucide-react'
import { DocumentField, FieldType, FIELD_CONFIGS } from '@/types/signing'

interface DraggableFieldOnDocumentProps {
  field: DocumentField
  signerColor: string
  signerName?: string
  isSelected: boolean
  isEditable: boolean
  containerWidth: number
  containerHeight: number
  onSelect: () => void
  onUpdate: (updates: Partial<DocumentField>) => void
  onDelete: () => void
}

const FIELD_ICONS: Record<FieldType, React.ReactNode> = {
  signature: <PenTool className="w-4 h-4" />,
  initials: <Type className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  text: <AlignLeft className="w-4 h-4" />,
  checkbox: <CheckSquare className="w-4 h-4" />,
}

const DraggableFieldOnDocument: React.FC<DraggableFieldOnDocumentProps> = ({
  field,
  signerColor,
  signerName,
  isSelected,
  isEditable,
  containerWidth,
  containerHeight,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const fieldRef = useRef<HTMLDivElement | null>(null)

  const config = FIELD_CONFIGS[field.field_type]

  // Drag handler
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'existing-field',
    item: { type: 'existing-field', fieldId: field.id },
    canDrag: isEditable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [field.id, isEditable])

  // Calculate pixel positions from percentages
  const pixelX = (field.x / 100) * containerWidth
  const pixelY = (field.y / 100) * containerHeight
  const pixelWidth = (field.width / 100) * containerWidth
  const pixelHeight = (field.height / 100) * containerHeight

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: pixelWidth,
      height: pixelHeight,
    })
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y

      const newWidth = Math.max(50, resizeStart.width + deltaX)
      const newHeight = Math.max(20, resizeStart.height + deltaY)

      // Convert back to percentages
      const widthPercent = (newWidth / containerWidth) * 100
      const heightPercent = (newHeight / containerHeight) * 100

      onUpdate({
        width: widthPercent,
        height: heightPercent,
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeStart, containerWidth, containerHeight, onUpdate])

  return (
    <div
      ref={(node) => {
        fieldRef.current = node
        if (isEditable) {
          drag(node)
        }
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      className={`
        absolute flex items-center justify-center border-2 rounded transition-all
        ${isSelected ? 'ring-2 ring-offset-2 ring-primary-500 z-20' : 'z-10'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isEditable ? 'cursor-move hover:shadow-lg' : 'cursor-default'}
      `}
      style={{
        left: pixelX,
        top: pixelY,
        width: pixelWidth,
        height: pixelHeight,
        borderColor: signerColor,
        backgroundColor: `${signerColor}15`,
      }}
    >
      {/* Field Icon and Label */}
      <div className="flex items-center gap-1 text-gray-600">
        {FIELD_ICONS[field.field_type]}
        <span className="text-xs font-medium">{config.label}</span>
      </div>

      {/* Signer Badge */}
      {signerName && (
        <div
          className="absolute -top-6 left-0 px-2 py-0.5 text-xs font-medium text-white rounded-t whitespace-nowrap"
          style={{ backgroundColor: signerColor }}
        >
          {signerName}
        </div>
      )}

      {/* Delete Button */}
      {isSelected && isEditable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (confirm('Delete this field?')) {
              onDelete()
            }
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg z-30"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* Resize Handle */}
      {isSelected && isEditable && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-br cursor-se-resize z-30"
          style={{
            borderTopLeftRadius: '4px',
          }}
        />
      )}

      {/* Required Indicator */}
      {field.required && (
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </div>
  )
}

export default DraggableFieldOnDocument
