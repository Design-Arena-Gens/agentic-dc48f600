'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Editor from '@/components/Editor'
import { Page } from '@/types'

export default function Home() {
  const [pages, setPages] = useState<Page[]>([])
  const [currentPageId, setCurrentPageId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('notion-pages')
    if (stored) {
      const parsed = JSON.parse(stored)
      setPages(parsed)
      if (parsed.length > 0 && !currentPageId) {
        setCurrentPageId(parsed[0].id)
      }
    } else {
      const defaultPage: Page = {
        id: '1',
        title: 'Welcome to Notion Clone',
        content: 'Start typing to create your first page...',
        emoji: '👋',
        parentId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      setPages([defaultPage])
      setCurrentPageId(defaultPage.id)
      localStorage.setItem('notion-pages', JSON.stringify([defaultPage]))
    }
  }, [])

  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem('notion-pages', JSON.stringify(pages))
    }
  }, [pages])

  const addPage = (parentId: string | null = null) => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      emoji: '📄',
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setPages([...pages, newPage])
    setCurrentPageId(newPage.id)
  }

  const updatePage = (id: string, updates: Partial<Page>) => {
    setPages(pages.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
    ))
  }

  const deletePage = (id: string) => {
    const deleteRecursive = (pageId: string): string[] => {
      const children = pages.filter(p => p.parentId === pageId).map(p => p.id)
      const allIds = [pageId, ...children.flatMap(deleteRecursive)]
      return allIds
    }

    const idsToDelete = deleteRecursive(id)
    const remainingPages = pages.filter(p => !idsToDelete.includes(p.id))
    setPages(remainingPages)

    if (currentPageId === id || idsToDelete.includes(currentPageId || '')) {
      setCurrentPageId(remainingPages.length > 0 ? remainingPages[0].id : null)
    }
  }

  const currentPage = pages.find(p => p.id === currentPageId)

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        pages={pages}
        currentPageId={currentPageId}
        onSelectPage={setCurrentPageId}
        onAddPage={addPage}
        onDeletePage={deletePage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 overflow-hidden">
        {currentPage ? (
          <Editor
            page={currentPage}
            onUpdate={updatePage}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-xl mb-4">No page selected</p>
              <button
                onClick={() => addPage()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create a page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
