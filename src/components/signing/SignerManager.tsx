'use client'

import React, { useState } from 'react'
import {
  Plus,
  User,
  Mail,
  Trash2,
  Check,
  X,
  GripVertical,
  UserCheck,
} from 'lucide-react'
import { Signer, SIGNER_COLORS } from '@/types/signing'

interface SignerManagerProps {
  signers: Signer[]
  selectedSignerId: string | null
  onSelectSigner: (signerId: string | null) => void
  onAddSigner: (name: string, email: string, isSelf?: boolean) => void
  currentUserName?: string
  currentUserEmail?: string
  onUpdateSigner: (signerId: string, updates: Partial<Signer>) => void
  onRemoveSigner: (signerId: string) => void
}

const SignerManager: React.FC<SignerManagerProps> = ({
  signers,
  selectedSignerId,
  onSelectSigner,
  onAddSigner,
  onUpdateSigner,
  onRemoveSigner,
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  const handleAdd = () => {
    if (newName.trim() && newEmail.trim()) {
      onAddSigner(newName.trim(), newEmail.trim())
      setNewName('')
      setNewEmail('')
      setShowAddForm(false)
    }
  }

  const startEditing = (signer: Signer) => {
    setEditingId(signer.id)
    setEditName(signer.name)
    setEditEmail(signer.email)
  }

  const saveEdit = (signerId: string) => {
    if (editName.trim() && editEmail.trim()) {
      onUpdateSigner(signerId, { name: editName.trim(), email: editEmail.trim() })
      setEditingId(null)
    }
  }

  const getSignerColor = (index: number) => {
    return SIGNER_COLORS[index % SIGNER_COLORS.length]
  }

  return (
    <div className="p-4 space-y-4">
      {/* Signers List */}
      <div className="space-y-2">
        {signers.map((signer, index) => {
          const colorSet = getSignerColor(index)
          const isSelected = selectedSignerId === signer.id
          const isEditing = editingId === signer.id

          return (
            <div
              key={signer.id}
              className={`
                p-3 rounded-lg border-2 transition-all cursor-pointer
                ${isSelected
                  ? `${colorSet.bg} ${colorSet.border}`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
              onClick={() => !isEditing && onSelectSigner(signer.id)}
            >
              {isEditing ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    autoFocus
                  />
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => saveEdit(signer.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${colorSet.bg} ${colorSet.text}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {signer.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {signer.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(signer)
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Remove this signer and all their fields?')) {
                          onRemoveSigner(signer.id)
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Signer Form */}
      {showAddForm ? (
        <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Signer name"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoFocus
            />
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Signer email"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                setShowAddForm(false)
                setNewName('')
                setNewEmail('')
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newName.trim() || !newEmail.trim()}
              className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Signer
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Signer</span>
        </button>
      )}

      {/* Instructions */}
      {signers.length === 0 && !showAddForm && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Add signers to specify who needs to sign this document. Each signer will receive an email invitation.
          </p>
        </div>
      )}
    </div>
  )
}

export default SignerManager
