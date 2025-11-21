import { Image as ImageIcon, Zap, Camera } from 'lucide-react'

const projects = [
  {
    id: 1,
    name: 'POS Delico',
    description: 'Modern point-of-sale system for coffee shops with inventory management, sales tracking, and customer analytics',
    tech: ['Next.js', 'MongoDB', 'TailwindCSS', 'Node.js'],
    icon: Zap,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    name: 'Laundry Automation',
    description: 'Complete laundry management system with order tracking, customer management, and automated notifications',
    tech: ['React', 'Python', 'FastAPI', 'PostgreSQL'],
    icon: ImageIcon,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 3,
    name: 'AI Photobooth',
    description: 'AI-powered photobooth application with real-time image processing, filters, and instant sharing capabilities',
    tech: ['Next.js', 'Gemini AI', 'Cloud Storage', 'WebRTC'],
    icon: Camera,
    color: 'from-green-500 to-green-600'
  }
]

export default function ShowcasePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold text-gray-900">Project Showcase</h1>
        <p className="text-gray-600">Explore our production applications and automation projects</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="macos-card p-6 space-y-6 group cursor-pointer hover:shadow-xl transition-shadow">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <project.icon className="w-8 h-8 text-white" />
            </div>
            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map(tech => (
                <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium glass-panel text-gray-700">
                  {tech}
                </span>
              ))}
            </div>
            {/* Screenshot Placeholder */}
            <div className="relative w-full h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              <ImageIcon className="w-12 h-12 text-gray-400" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            {/* View Button */}
            <button className="btn-macos w-full text-center font-medium mt-4">
              View Project Details
            </button>
          </div>
        ))}
      </div>

      <div className="macos-card p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">About Our Projects</h2>
        <p className="text-gray-600 leading-relaxed">
          All projects are production-ready applications built with modern tech stacks, featuring robust architecture, clean code, and scalable infrastructure.
        </p>
      </div>
    </div>
  )
}
