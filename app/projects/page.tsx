import Link from 'next/link'

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black-100 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Projects</h1>
        <p className="text-neutral-400 mb-6">A showcase of selected projects. More details coming soon.</p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <li className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50">
            <h3 className="font-semibold">Project One</h3>
            <p className="text-sm text-neutral-400">Brief description of the project.</p>
            <div className="mt-3">
              <Link href="#" className="text-rose-400 hover:underline">View</Link>
            </div>
          </li>
          <li className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50">
            <h3 className="font-semibold">Project Two</h3>
            <p className="text-sm text-neutral-400">Brief description of the project.</p>
            <div className="mt-3">
              <Link href="#" className="text-rose-400 hover:underline">View</Link>
            </div>
          </li>
        </ul>
      </div>
    </main>
  )
}
