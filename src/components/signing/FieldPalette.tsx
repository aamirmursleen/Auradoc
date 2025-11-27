'use client'

import React from 'react'
import { useDrag } from 'react-dnd'
import {
  PenTool,
  Type,
  Calendar,
  AlignLeft,
  CheckSquare,
  Info,
} from 'lucide-react'
import { FieldType, FIELD_CONFIGS } from '@/types/signing'

interface FieldPaletteProps {
  onAddField: (fieldType: FieldType, x?: number, y?: number) => void
  selectedSignerId: string | null
  signers: Array<{ id: string; name: string; color: string }>
}

const FIELD_ICONS: Record<FieldType, React.ReactNode> = {
  signature: <PenTool className="w-5 h-5" />,
  initials: <Type className="w-5 h-5" />,
  date: <Calendar className="w-5 h-5" />,
  text: <AlignLeft className="w-5 h-5" />,
  checkbox: <CheckSquare className="w-5 h-5" />,
}

const DraggableFieldButton: React.FC<{
  fieldType: FieldType
  disabled: boolean
  onAddField: (fieldType: FieldType) => void
}> = ({ fieldType, disabled, onAddField }) => {
  const config = FIELD_CONFIGS[fieldType]

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'new-field',
    item: { type: 'new-field', fieldType },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [fieldType, disabled])

  return (
    <button
      ref={drag as unknown as React.LegacyRef<HTMLButtonElement>}
      onClick={() => !disabled && onAddField(fieldType)}
      disabled={disabled}
      className={`
        flex items-center gap-3 p-3 rounded-lg border-2 transition-all w-full text-left
        ${disabled
          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
          : isDragging
            ? 'border-primary-500 bg-primary-100 text-primary-700 shadow-lg scale-105'
            : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50 cursor-grab'
        }
      `}
    >
      <div className={`
        p-2 rounded-lg
        ${disabled ? 'bg-gray-100' : 'bg-primary-100 text-primary-600'}
      `}>
        {FIELD_ICONS[fieldType]}
      </div>
      <div>
        <p className="font-medium text-sm">{config.label}</p>
        <p className="text-xs text-gray-500">Drag or click to add</p>
      </div>
    </button>
  )
}

const FieldPalette: React.FC<FieldPaletteProps> = ({
  onAddField,
  selectedSignerId,
  signers,
}) => {
  const hasSigners = signers.length > 0
  const selectedSigner = signers.find(s => s.id === selectedSignerId)

  return (
    <div className="p-4 space-y-4">
      {/* Selected Signer Indicator */}
      {hasSigners && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Adding fields for:</p>
          {selectedSigner ? (
            <div
              className="flex items-center gap-2 p-2 rounded-lg border-2"
              style={{ borderColor: selectedSigner.color }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedSigner.color }}
              />
              <span className="font-medium text-sm">{selectedSigner.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-yellow-300 bg-yellow-50">
              <Info className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">Select a signer first</span>
            </div>
          )}
        </div>
      )}

      {/* No Signers Warning */}
      {!hasSigners && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 text-sm">Add signers first</p>
              <p className="text-xs text-yellow-700 mt-1">
                You need to add at least one signer before placing fields on the document.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Field Types */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Field Types</h3>
        <div className="space-y-2">
          {(Object.keys(FIELD_CONFIGS) as FieldType[]).map((fieldType) => (
            <DraggableFieldButton
              key={fieldType}
              fieldType={fieldType}
              disabled={!selectedSignerId}
              onAddField={onAddField}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <p className="font-medium mb-1">How to add fields:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Drag a field onto the document</li>
          <li>Or click to add at default position</li>
          <li>Resize and reposition as needed</li>
        </ul>
      </div>
    </div>
  )
}

export default FieldPalette
