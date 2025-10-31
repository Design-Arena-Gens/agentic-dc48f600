'use client'

import { X } from 'lucide-react'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

const emojis = [
  '📄', '📝', '📋', '📌', '📍', '📎', '🔗', '💡',
  '⭐', '🌟', '✨', '🔥', '💥', '✅', '❌', '⚠️',
  '📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔',
  '🎯', '🎨', '🎭', '🎪', '🎬', '🎮', '🎲', '🎰',
  '💼', '📊', '📈', '📉', '💰', '💳', '💎', '🔨',
  '🏠', '🏢', '🏭', '🏗️', '🏛️', '⛪', '🕌', '🕍',
  '🌍', '🌎', '🌏', '🗺️', '🧭', '⛰️', '🏔️', '🗻',
  '👤', '👥', '👨', '👩', '👶', '👴', '👵', '🤝',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
  '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱',
  '🍕', '🍔', '🍟', '🌭', '🍿', '🥓', '🥚', '🍳',
]

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Choose an icon</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            className="text-2xl hover:bg-gray-100 rounded p-2 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
