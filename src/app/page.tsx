import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
          <h1 className="text-4xl font-bold mb-6">ChatGPT 4o Image Transformer</h1>
          <p className="text-xl mb-8">Transform images using the power of ChatGPT 4o</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            <Link 
              href="/generate" 
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center justify-center"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                Text to Image{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  →
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-center text-sm opacity-50">
                Generate images from text prompts
              </p>
            </Link>

            <Link
              href="/edit"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 flex flex-col items-center justify-center"
            >
              <h2 className="mb-3 text-2xl font-semibold">
                Edit Images{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  →
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-center text-sm opacity-50">
                Transform existing images with text prompts
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}