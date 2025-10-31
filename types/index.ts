export interface Page {
  id: string
  title: string
  content: string
  emoji: string
  parentId: string | null
  createdAt: number
  updatedAt: number
}

export interface Block {
  id: string
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'todo'
  content: string
  checked?: boolean
}
