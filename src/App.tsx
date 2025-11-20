import { createSignal, onMount, For, Show, createEffect } from 'solid-js';
import {
  Moon,
  Sun,
  Github,
  Mail,
  ExternalLink,
  Code2,
  Layers,
  Database,
  ChevronDown,
  Circle,
  Briefcase,
  ArrowUpRight,
} from 'lucide-solid';

// types
type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
};

type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
};

type Skill = {
  name: string;
  icon: any;
  level: number;
};

type GithubStats = {
  repos: number;
  followers: number;
  following: number;
};

export default function App() {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = createSignal('home');
  const [githubStats, setGithubStats] = createSignal<GithubStats | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [isVisible, setIsVisible] = createSignal(false);

  // data
  const projects: Project[] = [
    {
      id: 'p1',
      title: 'yurei',
      description:
        'Python toolkit for encryption, authentication, secure IDs, and lightweight storage - educational, fun, and perfect for devs and curious hackers.',
      tech: ['python', 'encryption', 'database', 'sha256'],
      github: 'https://github.com/ogkae/yurei',
      link: 'https://github.com/ogkae/yurei',
    },
    {
      id: 'p2',
      title: 'encrypted dns',
      description: 'DNS over HTTPS config profiles for iOS & macOS',
      tech: ['javascript', 'privacy', 'DNs'],
      github: 'https://github.com/ogkae/encrypted-dns',
    },
    {
      id: 'p3',
      title: 'perplexity omnibox',
      description:
        'Type @Perplexity in browser omnibox to get results from Perplexity AI',
      tech: ['extension', 'python', 'javascript'],
      github: 'https://github.com/ogkae/perplexity-omnibox',
    },
    {
      id: 'p4',
      title: 'hoopie',
      description:
        'Modular css framework',
      tech: ['css', 'framework', 'html'],
      github: 'https://github.com/ogkae/hoopie',
    }
  ];

  const experiences: Experience[] = [
    {
      role: 'my first cybersecurity project',
      company: 'tech startup',
      period: '2024',
      description: 'leading white-hat architecture and mentoring developers',
    },
    {
      role: 'frontend developer',
      company: 'digital agency',
      period: '2024 - 2025',
      description: 'building scalable web applications',
    },
  ];

  const skills: Skill[] = [
    { name: 'frontend development', icon: Code2, level: 70 },
    { name: 'ui/ux design', icon: Layers, level: 85 },
    { name: 'backend systems', icon: Database, level: 95 },
  ];

  // fetch github stats
  const fetchGithubStats = async () => {
    try {
      const response = await fetch('https://api.github.com/users/ogkae');
      const data = await response.json();
      setGithubStats({
        repos: data.public_repos || 0,
        followers: data.followers || 0,
        following: data.following || 0,
      });
    } catch (error) {
      console.error('failed to fetch github stats:', error);
    }
  };

  // intersection observer
  onMount(() => {
    fetchGithubStats();

    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 50);
    }, 1200);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  });

  // theme persistence
  createEffect(() => {
    document.documentElement.setAttribute('data-theme', theme());
    localStorage.setItem('theme', theme());
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div class={`app ${theme()}`}>
      {/* loading screen */}
      <Show when={isLoading()}>
        <div class="loading-screen">
          <div class="loading-spinner" />
        </div>
      </Show>

      {/* navigation */}
      <nav class={`navbar ${isVisible() ? 'visible' : ''}`}>
        <div class="nav-content">
          <h1 class="logo" onClick={() => scrollToSection('home')}>
            ogkae
          </h1>

          <div class="nav-links">
            <For each={['home', 'about', 'work', 'contact']}>
              {(link) => (
                <button
                  class={`nav-link ${activeSection() === link ? 'active' : ''}`}
                  onClick={() => scrollToSection(link)}
                >
                  {link}
                </button>
              )}
            </For>
          </div>

          <button
            onClick={toggleTheme}
            class="theme-toggle"
            aria-label="toggle theme"
          >
            <Show when={theme() === 'dark'} fallback={<Moon size={18} />}>
              <Sun size={18} />
            </Show>
          </button>
        </div>
      </nav>

      {/* hero section */}
      <section id="home" class="hero-section fade-in-section">
        <div class="container">
          <div class={isVisible() ? 'visible' : ''}>
            <div class="hero-status animate-fade-up delay-1">
              <Circle size={8} class="status-dot" />
              <span>available for work</span>
            </div>

            <h1 class="hero-title animate-fade-up delay-2">ogkae</h1>

            <p class="hero-subtitle animate-fade-up delay-3">
              developer & designer
            </p>

            <p class="hero-description animate-fade-up delay-4">
              creating functional digital experiences through clean code and
              thoughtful design
            </p>

            {/* github stats */}
            <Show when={githubStats()}>
              <div class="stats-grid animate-fade-up delay-5">
                <div class="stat-item">
                  <div class="stat-value">{githubStats()?.repos}</div>
                  <div class="stat-label">repositories</div>
                </div>
                <div class="stat-divider" />
                <div class="stat-item">
                  <div class="stat-value">{githubStats()?.followers}</div>
                  <div class="stat-label">followers</div>
                </div>
                <div class="stat-divider" />
                <div class="stat-item">
                  <div class="stat-value">{githubStats()?.following}</div>
                  <div class="stat-label">following</div>
                </div>
              </div>
            </Show>

            <div class="hero-actions animate-fade-up delay-6">
              <button
                class="btn-primary"
                onClick={() => scrollToSection('work')}
              >
                view work
                <ArrowUpRight size={16} />
              </button>
              <button
                class="btn-secondary"
                onClick={() => scrollToSection('contact')}
              >
                contact
              </button>
            </div>
          </div>

          <button
            class="scroll-indicator"
            onClick={() => scrollToSection('about')}
          >
            <ChevronDown size={20} class="bounce" />
          </button>
        </div>
      </section>

      {/* about section */}
      <section id="about" class="about-section fade-in-section">
        <div class="container">
          <h2 class="section-title">expertise</h2>

          {/* skills */}
          <div class="skills-grid">
            <For each={skills}>
              {(skill) => (
                <div class="skill-card">
                  <div class="skill-header">
                    <skill.icon size={20} class="skill-icon" />
                    <h3 class="skill-name">{skill.name}</h3>
                  </div>
                  <div class="skill-bar">
                    <div
                      class="skill-fill"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* experience */}
          <div class="experience-section">
            <h3 class="subsection-title">
              <Briefcase size={20} />
              experience
            </h3>
            <div class="timeline">
              <For each={experiences}>
                {(exp) => (
                  <div class="timeline-item">
                    <div class="timeline-marker" />
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <h4>{exp.role}</h4>
                        <span class="period">{exp.period}</span>
                      </div>
                      <p class="company">{exp.company}</p>
                      <p class="description">{exp.description}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>

      {/* projects section */}
      <section id="work" class="work-section fade-in-section">
        <div class="container">
          <h2 class="section-title">selected work</h2>

          <div class="projects-grid">
            <For each={projects}>
              {(project) => (
                <div class="project-card">
                  <div class="project-header">
                    <h3>{project.title}</h3>
                    <div class="project-links-header">
                      <Show when={project.github}>
                        <a
                          href={project.github}
                          target="_blank"
                          class="icon-link"
                          aria-label="view code"
                        >
                          <Github size={18} />
                        </a>
                      </Show>
                      <Show when={project.link}>
                        <a
                          href={project.link}
                          target="_blank"
                          class="icon-link"
                          aria-label="view live"
                        >
                          <ExternalLink size={18} />
                        </a>
                      </Show>
                    </div>
                  </div>

                  <p class="project-description">{project.description}</p>

                  <div class="tech-stack">
                    <For each={project.tech}>
                      {(tech) => <span class="tech-tag">{tech}</span>}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* contact section */}
      <section id="contact" class="contact-section fade-in-section">
        <div class="container">
          <div class="contact-content">
            <h2 class="section-title">get in touch</h2>
            <p class="contact-description">
              open to new opportunities and collaborations
            </p>

            <div class="contact-links">
              <a
                href="https://github.com/ogkae"
                target="_blank"
                class="contact-link"
              >
                <Github size={20} />
                <span>github.com/ogkae</span>
                <ExternalLink size={16} class="link-icon" />
              </a>

              <a href="mailto:contact@ogkae.dev" class="contact-link">
                <Mail size={20} />
                <span>contact@ogkae.dev</span>
                <ExternalLink size={16} class="link-icon" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <p>built with solid & typescript</p>
            <p>© 2026 ogkae</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
