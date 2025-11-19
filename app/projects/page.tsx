"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";

type ProjectRecord = {
  id: number;
  name: string;
  description: string;
  tech: string[];
  link: string;
  image?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        // DEBUG: log API response so you can verify the DB row is returned
        console.debug('[projects page] /api/projects ->', data);
        if (!mounted) return;

        // Remove any project that appears to be a CI/CD pipeline entry
        const removeCiCd = (items: ProjectRecord[] | any[]) => {
          if (!Array.isArray(items)) return items || [];
          return items.filter(it => {
            const name = (it?.name || '').toString().toLowerCase();
            // match common CI/CD labels
            if (name.includes('ci/cd') || name.includes('cicd') || name.includes('ci cd') || name.includes('ci-cd')) return false;
            if (name.includes('ci') && name.includes('cd') && name.length < 40) return false; // defensive
            return true;
          });
        }

        const prioritizeKeynote = (items: ProjectRecord[] | any[]) => {
          if (!Array.isArray(items) || items.length === 0) return items || [];
          const lowered = items.map((it) => ({ item: it, name: (it?.name || '').toString().toLowerCase() }));
          const idx = lowered.findIndex(x => x.name.includes('keynote') || x.name.includes('keynotes'));
          if (idx <= 0) return items || [];
          const copy = [...items];
          const [picked] = copy.splice(idx, 1);
          return [picked, ...copy];
        }

        const cleaned = removeCiCd(data || []);
        setProjects(prioritizeKeynote(cleaned));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Helper function to derive GIF path from image path
  const getGifPath = (imagePath?: string) => {
    if (!imagePath) return "/assets/gif/placeholder.gif";
    
    try {
      const parts = imagePath.split("/");
      const file = parts.length ? parts[parts.length - 1] : "";
      const basename = file.split(".").slice(0, -1).join(".") || file;
      
      if (basename) {
        return `/assets/gif/${basename}.gif`;
      }
    } catch (e) {
      console.error("Error deriving GIF path:", e);
    }
    
    return "/assets/gif/placeholder.gif";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-neutral-400 mb-8">
            Loading projects...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <div className="p-6 rounded-lg border border-red-600 bg-red-900/10 text-red-300">
            Error loading projects: {error}
          </div>
        </div>
      </main>
    );
  }

  if (!projects.length) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-neutral-400 mb-8">No projects found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-neutral-400 mb-8">
          A showcase of selected projects. Hover over cards to see demos.
        </p>

        {/* Grid with 3 columns, scrollable if needed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description}
              tech={project.tech}
              link={project.link}
              image={project.image}
              gifPath={getGifPath(project.image)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
