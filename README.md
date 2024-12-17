# SwisshubRP Regelwerke

A modern, responsive web application for managing and displaying roleplay rules and factions for SwisshubRP. Built with React, TypeScript, and Supabase.

![SwisshubRP Regelwerke](https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=3270&auto=format&fit=crop)

## Features

- 🌓 Dark/Light mode support
- 🔍 Advanced search functionality
- 📱 Fully responsive design
- 🔐 Secure admin panel
- 📚 Hierarchical rule management
- 👥 Faction management system
- 🎨 Beautiful, modern UI with animations
- 🚀 Fast and optimized performance

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Vite
  - Lucide Icons

- **Backend:**
  - Supabase (Database & Authentication)

- **Key Libraries:**
  - TipTap (Rich Text Editor)
  - React Router
  - React Hot Toast

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/swisshub-regelwerke.git
   cd swisshub-regelwerke
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `supabase.sql` in your Supabase SQL editor
3. Update your environment variables with the new project credentials

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── admin/        # Admin panel components
│   └── sidebar/      # Sidebar components
├── contexts/         # React contexts
├── lib/             # Utility functions and API clients
├── pages/           # Page components
└── types/           # TypeScript type definitions
```

## Features in Detail

### Rule Management
- Hierarchical category system
- Rich text editor for rule content
- Drag-and-drop reordering
- Search functionality

### Faction System
- Image upload support
- Discord integration
- Category-based organization
- Responsive grid layout

### Admin Panel
- Secure authentication
- CRUD operations for rules and factions
- Live preview
- User-friendly interface

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Lucide Icons](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.io/) for the backend infrastructure
- [TipTap](https://tiptap.dev/) for the rich text editor
