import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black py-12 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
        {/* Left Side - Copyright */}
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Riya Gupta. All Rights Reserved.
        </p>
        
        {/* Right Side - Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Riya922003"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-white transition-colors duration-200"
            aria-label="GitHub Profile"
          >
            <Github size={20} />
          </a>
          
          <a
            href="https://linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-white transition-colors duration-200"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={20} />
          </a>
          
          <a
            href="mailto:your-email@example.com"
            className="text-neutral-500 hover:text-white transition-colors duration-200"
            aria-label="Email Contact"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;