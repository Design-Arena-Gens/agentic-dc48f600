'use client'

import { ChevronDown, ChevronRight, Plus, Trash2, FileText } from 'lucide-react'
import { Page } from '@/types'
import { useState } from 'react'

interface SidebarProps {
  pages: Page[]
  currentPageId: string | null
  onSelectPage: (id: string) => void
  onAddPage: (parentId: string | null) => void
  onDeletePage: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({
  pages,
  currentPageId,
  onSelectPage,
  onAddPage,
  onDeletePage,
  isOpen,
}: SidebarProps) {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set())
  const [hoveredPage, setHoveredPage] = useState<string | null>(null)

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages)
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId)
    } else {
      newExpanded.add(pageId)
    }
    setExpandedPages(newExpanded)
  }

  const getChildPages = (parentId: string | null) => {
    return pages.filter(p => p.parentId === parentId)
  }

  const hasChildren = (pageId: string) => {
    return pages.some(p => p.parentId === pageId)
  }

  const renderPage = (page: Page, level: number = 0) => {
    const isExpanded = expandedPages.has(page.id)
    const children = getChildPages(page.id)
    const isSelected = currentPageId === page.id
    const isHovered = hoveredPage === page.id

    return (
      <div key={page.id}>
        <div
          className={`
            flex items-center gap-1 px-2 py-1 rounded cursor-pointer group
            ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}
          `}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onMouseEnter={() => setHoveredPage(page.id)}
          onMouseLeave={() => setHoveredPage(null)}
        >
          {hasChildren(page.id) ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(page.id)
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <div className="w-[22px]" />
          )}

          <div
            className="flex-1 flex items-center gap-1.5 min-w-0"
            onClick={() => onSelectPage(page.id)}
          >
            <span className="text-sm">{page.emoji}</span>
            <span className="text-sm truncate flex-1">{page.title}</span>
          </div>

          {isHovered && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddPage(page.id)
                }}
                className="p-1 hover:bg-gray-200 rounded"
                title="Add subpage"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Delete this page and all its subpages?')) {
                    onDeletePage(page.id)
                  }
                }}
                className="p-1 hover:bg-gray-200 rounded text-red-600"
                title="Delete page"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {isExpanded && children.map(child => renderPage(child, level + 1))}
      </div>
    )
  }

  if (!isOpen) return null

  const rootPages = getChildPages(null)

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} />
          <h1 className="text-lg font-semibold">Notion Clone</h1>
        </div>
        <button
          onClick={() => onAddPage(null)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Plus size={16} />
          New Page
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {rootPages.map(page => renderPage(page))}
      </div>
    </div>
  )
}
