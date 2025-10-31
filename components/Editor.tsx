'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, Smile } from 'lucide-react'
import { Page } from '@/types'
import EmojiPicker from './EmojiPicker'

interface EditorProps {
  page: Page
  onUpdate: (id: string, updates: Partial<Page>) => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export default function Editor({ page, onUpdate, onToggleSidebar, sidebarOpen }: EditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current && contentRef.current.textContent !== page.content) {
      contentRef.current.textContent = page.content
    }
  }, [page.id])

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(page.id, { title: e.target.value })
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleContentChange = () => {
    if (contentRef.current) {
      onUpdate(page.id, { content: contentRef.current.textContent || '' })
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    onUpdate(page.id, { emoji })
    setShowEmojiPicker(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      document.execCommand('insertLineBreak')
    }
  }

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto'
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px'
    }
  }, [page.title])

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="text-sm text-gray-500">
          {new Date(page.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="mb-6 relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-6xl hover:bg-gray-100 rounded-lg p-2 transition-colors mb-4 inline-block"
              title="Change icon"
            >
              {page.emoji}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-24 left-0 z-10">
                <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
              </div>
            )}
          </div>

          <textarea
            ref={titleRef}
            value={page.title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-4xl font-bold border-none outline-none resize-none overflow-hidden mb-4"
            rows={1}
          />

          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            data-placeholder="Type '/' for commands or start writing..."
            className="min-h-[400px] text-base leading-relaxed outline-none whitespace-pre-wrap"
            suppressContentEditableWarning
          />
        </div>
      </div>
    </div>
  )
}
