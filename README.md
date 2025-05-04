# ChatGPT 4o Image Transformer

A full-stack Next.js application for transforming images using ChatGPT's 4o image generation API. This application allows you to generate new images based on text prompts and edit existing images by either transforming them directly or creating variations.

## Features

- **Text-to-Image Generation**: Create images from detailed text prompts
- **Image Editing**: Transform existing images using text instructions
- **Image Variations**: Generate variations of uploaded images
- **Customizable Options**: Control model, size, quality, style, and number of outputs
- **Dark/Light Mode**: Theme support with system preference detection
- **Responsive Design**: Works on mobile and desktop devices
- **Image Storage**: Save generated images in Supabase storage

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (based on Radix UI)
- **Styling**: TailwindCSS with CSS variables for theming
- **Database/Auth**: Supabase
- **Image API**: ChatGPT 4o / DALL-E 3

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- OpenAI API key
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatgpt-4o-image-wrapper.git
   cd chatgpt-4o-image-wrapper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Set up your Supabase project:
   - Create a new project in Supabase
   - Initialize the database using the schema in `supabase/schema.sql`
   - Create a storage bucket named `images`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
chatgpt-4o-image-wrapper/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── generate/          # Image generation page
│   │   ├── edit/              # Image editing page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/                # UI components from shadcn
│   │   └── ...                # Application components
│   ├── lib/                   # Utilities and API clients
│   │   ├── supabase/          # Supabase client
│   │   ├── chatgpt-api.ts     # ChatGPT image API wrapper
│   │   └── utils.ts           # Utility functions
│   └── styles/                # Global styles
├── public/                    # Static assets
├── supabase/                  # Supabase schema and configuration
│   └── schema.sql             # Database schema
├── .env.local.example         # Example environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## API Endpoints

- **POST /api/generate-image**: Generate images from text prompts
- **POST /api/edit-image**: Edit images using text instructions
- **POST /api/image-variation**: Create variations of uploaded images

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Supabase](https://supabase.io/) - Open Source Firebase Alternative
- [OpenAI](https://openai.com/) - ChatGPT and DALL-E models