'use client'

interface JsonViewerProps {
  data: any
}

export default function JsonViewer({ data }: JsonViewerProps) {
  return (
    <div className="json-viewer p-6 overflow-auto max-h-[600px]">
      <pre className="text-sm whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
