import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-white/80 dark:bg-black/50 backdrop-blur-sm border-t border-gray-200 dark:border-white/10 py-4 text-center text-gray-600 dark:text-gray-400">
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Left-aligned login icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Link
            to="/login"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Admin Login"
          >
            <LogIn className="w-4 h-4" />
          </Link>
        </div>

        {/* Centered text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          Made with{' '}
          <span className="inline-block animate-pulse text-[#911111] mx-1">♥</span>
          {' '}by Cryptic.gg
        </div>

        {/* Right-aligned icons */}
        <div className="flex items-center space-x-3 justify-end">
          <a
            href="https://gaming.v10networks.com/saltychat/download/stable"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Download SaltyChat"
            target="_blank"
            rel="noopener noreferrer"
          >
            SaltyChat
          </a>
          <a
            href="ts3server://swisshubrp"
            className="hover:opacity-80 transition-opacity"
            title="Join TeamSpeak"
          >
            <img
              src="https://cdn2.iconfinder.com/data/icons/gaming-platforms-squircle/250/teamspeak_squircle-512.png"
              alt="TeamSpeak"
              className="h-6 w-6"
            />
          </a>
          <a
            href="https://discord.gg/wKmCMGypFn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            title="Join Discord"
          >
            <img
              src="https://static-00.iconduck.com/assets.00/discord-icon-2048x2048-nnt62s2u.png"
              alt="Discord"
              className="h-6 w-6"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;